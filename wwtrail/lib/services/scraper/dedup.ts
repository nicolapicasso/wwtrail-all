// lib/services/scraper/dedup.ts
// Annotates a scraped graph with matches already present in the database, so the
// admin can see at a glance what is new vs. what already exists.

import prisma from '@/lib/db';
import type { ScrapedGraph } from './types';

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export async function annotateExisting(graph: ScrapedGraph): Promise<ScrapedGraph> {
  // --- Event match: same normalized name (+ country when available) ---
  const eventName = graph.event.name;
  let matchedEventId: string | null = null;

  if (eventName) {
    const candidates = await prisma.event.findMany({
      where: {
        name: { contains: eventName.split(/\s+/)[0], mode: 'insensitive' },
        ...(graph.event.country ? { country: graph.event.country } : {}),
      },
      select: { id: true, slug: true, name: true },
      take: 25,
    });
    const target = norm(eventName);
    const hit = candidates.find((c) => norm(c.name) === target);
    if (hit) {
      matchedEventId = hit.id;
      graph.event.existing = { id: hit.id, slug: hit.slug, name: hit.name };
    } else {
      graph.event.existing = null;
    }
  }

  // --- Competition + edition matches (only meaningful if the event exists) ---
  if (matchedEventId) {
    const existingComps = await prisma.competition.findMany({
      where: { eventId: matchedEventId },
      select: {
        id: true,
        slug: true,
        name: true,
        editions: { select: { id: true, year: true } },
      },
    });

    for (const comp of graph.competitions) {
      const compTarget = norm(comp.name);
      const hit = existingComps.find((c) => norm(c.name) === compTarget);
      if (hit) {
        comp.existing = { id: hit.id, slug: hit.slug };
        for (const ed of comp.editions) {
          const edHit = hit.editions.find((e) => e.year === ed.year);
          ed.existing = edHit ? { id: edHit.id } : null;
        }
      } else {
        comp.existing = null;
        comp.editions.forEach((ed) => (ed.existing = null));
      }
    }
  } else {
    for (const comp of graph.competitions) {
      comp.existing = null;
      comp.editions.forEach((ed) => (ed.existing = null));
    }
  }

  return graph;
}
