// lib/services/scraper/dedup.ts
// Fuzzy-matches a scraped graph against the database so the admin can see what
// already exists vs. what is new — even when names don't match exactly. Matching
// combines name similarity (token + bigram), competition distance proximity and
// event/location signals.

import prisma from '@/lib/db';
import type { ScrapedGraph, MatchInfo } from './types';

// Confidence thresholds.
const HIGH = 0.7; // auto-flag as existing
const MEDIUM = 0.48; // surface as a suggestion for the admin to confirm

function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Stopwords that add noise to trail-event names.
const STOP = new Set(['de', 'la', 'el', 'los', 'las', 'del', 'trail', 'by', 'the', 'ultra', 'race', 'carrera', 'cursa']);

function tokens(s: string): string[] {
  return norm(s).split(' ').filter((t) => t && !STOP.has(t));
}

function jaccard(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  sa.forEach((t) => sb.has(t) && inter++);
  return inter / (sa.size + sb.size - inter);
}

function bigrams(s: string): Set<string> {
  const n = norm(s).replace(/ /g, '');
  const set = new Set<string>();
  for (let i = 0; i < n.length - 1; i++) set.add(n.slice(i, i + 2));
  return set;
}

function dice(a: string, b: string): number {
  const ba = bigrams(a);
  const bb = bigrams(b);
  if (!ba.size || !bb.size) return 0;
  let inter = 0;
  ba.forEach((g) => bb.has(g) && inter++);
  return (2 * inter) / (ba.size + bb.size);
}

/** Name similarity in [0,1], blending token overlap and character bigrams. */
function nameSim(a: string, b: string): number {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  return 0.55 * jaccard(tokens(a), tokens(b)) + 0.45 * dice(a, b);
}

/** Distance proximity in [0,1]; 1 when equal, decaying with relative diff. */
function distSim(a?: number | null, b?: number | null): number | null {
  if (a == null || b == null || a <= 0 || b <= 0) return null;
  const rel = Math.abs(a - b) / Math.max(a, b);
  return Math.max(0, 1 - rel * 2); // within ~15% still scores decently
}

function pct(x: number): number {
  return Math.round(x * 100);
}

export async function annotateExisting(graph: ScrapedGraph): Promise<ScrapedGraph> {
  const country = graph.event.country || null;

  // ---------- Event matching (fuzzy) ----------
  const eventCandidates = await prisma.event.findMany({
    where: country ? { country } : {},
    select: { id: true, slug: true, name: true, city: true },
    take: 800,
  });

  let matchedEventId: string | null = null;
  {
    let best: { c: (typeof eventCandidates)[number]; score: number } | null = null;
    for (const c of eventCandidates) {
      let score = nameSim(graph.event.name, c.name);
      // City agreement is a strong corroborator.
      if (graph.event.city && c.city && norm(graph.event.city) === norm(c.city)) {
        score = Math.min(1, score + 0.12);
      }
      if (!best || score > best.score) best = { c, score };
    }
    if (best && best.score >= MEDIUM) {
      const info: MatchInfo = {
        id: best.c.id,
        slug: best.c.slug,
        name: best.c.name,
        score: best.score,
        reason: `Nombre ${pct(best.score)}%${graph.event.city ? ' + ubicación' : ''}`,
      };
      if (best.score >= HIGH) {
        matchedEventId = best.c.id;
        graph.event.existing = { id: best.c.id, slug: best.c.slug, name: best.c.name };
        graph.event.suggestion = null;
      } else {
        graph.event.existing = null;
        graph.event.suggestion = info;
      }
    } else {
      graph.event.existing = null;
      graph.event.suggestion = null;
    }
  }

  // ---------- Competition matching (fuzzy, distance-aware) ----------
  // Pool: competitions of the matched event (strong) plus competitions in the
  // same country (to catch duplicates filed under a different event).
  const pool = await prisma.competition.findMany({
    where: matchedEventId
      ? { OR: [{ eventId: matchedEventId }, ...(country ? [{ event: { country } }] : [])] }
      : country
      ? { event: { country } }
      : { name: { contains: tokens(graph.competitions[0]?.name || '')[0] || '', mode: 'insensitive' } },
    select: {
      id: true,
      slug: true,
      name: true,
      baseDistance: true,
      eventId: true,
      event: { select: { name: true, city: true } },
      editions: { select: { id: true, year: true } },
    },
    take: 2000,
  });

  for (const comp of graph.competitions) {
    let best: { c: (typeof pool)[number]; score: number; ds: number | null } | null = null;
    for (const c of pool) {
      const ns = nameSim(comp.name, c.name);
      const ds = distSim(comp.baseDistance, c.baseDistance);
      const sameEvent = matchedEventId && c.eventId === matchedEventId ? 1 : 0;
      // Weight name most; distance corroborates; same event nudges up.
      let score = ds != null ? 0.62 * ns + 0.28 * ds + 0.1 * sameEvent : 0.9 * ns + 0.1 * sameEvent;
      score = Math.min(1, score);
      if (!best || score > best.score) best = { c, score, ds };
    }

    if (best && best.score >= MEDIUM) {
      const reasonParts = [`Nombre ${pct(nameSim(comp.name, best.c.name))}%`];
      if (best.ds != null) reasonParts.push(`distancia ${pct(best.ds)}%`);
      const info: MatchInfo = {
        id: best.c.id,
        slug: best.c.slug,
        name: `${best.c.name}${best.c.event?.name ? ` · ${best.c.event.name}` : ''}`,
        score: best.score,
        reason: reasonParts.join(' + '),
      };
      if (best.score >= HIGH) {
        comp.existing = { id: best.c.id, slug: best.c.slug };
        comp.suggestion = null;
        for (const ed of comp.editions) {
          const edHit = best.c.editions.find((e) => e.year === ed.year);
          ed.existing = edHit ? { id: edHit.id } : null;
        }
      } else {
        comp.existing = null;
        comp.suggestion = info;
        comp.editions.forEach((ed) => (ed.existing = null));
      }
    } else {
      comp.existing = null;
      comp.suggestion = null;
      comp.editions.forEach((ed) => (ed.existing = null));
    }
  }

  return graph;
}
