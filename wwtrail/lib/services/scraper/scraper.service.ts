// lib/services/scraper/scraper.service.ts
// Orchestrates the AI-assisted scraper: scan (fetch -> extract -> dedup, no
// writes) and import (create the reviewed graph via the real services).

import { EventService } from '@/lib/services/event.service';
import { CompetitionService } from '@/lib/services/competition.service';
import { EditionService } from '@/lib/services/edition.service';
import logger from '@/lib/utils/logger';
import { fetchContent } from './fetcher';
import { extractGraph } from './extractor';
import { annotateExisting } from './dedup';
import type { ScanInput, ScanResult, ScrapedGraph } from './types';

export interface ImportGraphResult {
  event: { id: string; slug: string; created: boolean };
  competitions: Array<{ name: string; id?: string; created: boolean; skipped?: boolean; error?: string }>;
  editions: Array<{ competition: string; year: number; created: boolean; skipped?: boolean; error?: string }>;
}

export class ScraperService {
  /** Fetch + extract + dedup. Does not write anything. */
  static async scan(input: ScanInput): Promise<ScanResult> {
    const fetched = await fetchContent({ url: input.url, html: input.html, mode: input.mode });

    if (!fetched.text || fetched.text.length < 40) {
      throw new Error(
        'No se pudo obtener contenido legible de la página. Si es un sitio JavaScript, usa el modo "Pegar HTML".'
      );
    }

    const graph = await extractGraph(fetched.text, fetched.sourceUrl);

    if (!graph.event.name) {
      return {
        sourceUrl: fetched.sourceUrl,
        fetchMode: fetched.usedMode,
        title: fetched.title,
        graph,
        warnings: [...fetched.warnings, 'No se detectó ninguna carrera de trail en el contenido.'],
      };
    }

    const annotated = await annotateExisting(graph);

    return {
      sourceUrl: fetched.sourceUrl,
      fetchMode: fetched.usedMode,
      title: fetched.title,
      graph: annotated,
      warnings: fetched.warnings,
    };
  }

  /**
   * Create the reviewed graph. `userId` must be an ADMIN/ORGANIZER. Entities
   * flagged as existing are reused (not duplicated); new ones are created.
   */
  static async importGraph(
    graph: ScrapedGraph,
    userId: string,
    userRole: string
  ): Promise<ImportGraphResult> {
    const result: ImportGraphResult = { event: { id: '', slug: '', created: false }, competitions: [], editions: [] };

    // --- Event ---
    let eventId: string;
    if (graph.event.existing?.id) {
      eventId = graph.event.existing.id;
      result.event = { id: eventId, slug: graph.event.existing.slug, created: false };
    } else {
      // Event.firstEditionYear is required. Fall back to the earliest edition
      // year found, else the current year.
      const editionYears = graph.competitions
        .flatMap((c) => c.editions.map((e) => e.year))
        .filter((y): y is number => Number.isFinite(y));
      const firstEditionYear =
        graph.event.firstEditionYear ||
        (editionYears.length ? Math.min(...editionYears) : new Date().getFullYear());

      const created = await EventService.create(
        {
          name: graph.event.name,
          city: graph.event.city || '',
          country: graph.event.country || null,
          website: graph.event.website || undefined,
          typicalMonth: graph.event.typicalMonth || undefined,
          firstEditionYear,
          description: graph.event.description || undefined,
        },
        userId,
        userRole
      );
      eventId = created.id;
      result.event = { id: created.id, slug: created.slug, created: true };
    }

    // --- Competitions + editions ---
    for (const comp of graph.competitions) {
      let competitionId: string | undefined;

      if (comp.existing?.id) {
        competitionId = comp.existing.id;
        result.competitions.push({ name: comp.name, id: competitionId, created: false, skipped: true });
      } else {
        try {
          const createdComp = await CompetitionService.create(
            eventId,
            {
              name: comp.name,
              description: comp.description || undefined,
              type: comp.type || undefined,
              baseDistance: comp.baseDistance ?? undefined,
              baseElevation: comp.baseElevation ?? undefined,
              itraPoints: comp.itraPoints ?? undefined,
            },
            userId
          );
          competitionId = createdComp.id;
          result.competitions.push({ name: comp.name, id: competitionId, created: true });
        } catch (err: any) {
          result.competitions.push({ name: comp.name, created: false, error: err.message });
          logger.error(`Scraper import competition "${comp.name}" failed: ${err.message}`);
          continue;
        }
      }

      // Editions (require a startDate; skip those without one)
      for (const ed of comp.editions) {
        if (ed.existing?.id) {
          result.editions.push({ competition: comp.name, year: ed.year, created: false, skipped: true });
          continue;
        }
        if (!ed.startDate) {
          result.editions.push({ competition: comp.name, year: ed.year, created: false, skipped: true, error: 'sin fecha de inicio' });
          continue;
        }
        try {
          await EditionService.create(
            competitionId!,
            {
              year: ed.year,
              startDate: ed.startDate,
              endDate: ed.endDate || undefined,
              distance: ed.distance ?? undefined,
              elevation: ed.elevation ?? undefined,
              registrationUrl: ed.registrationUrl || undefined,
            },
            userId
          );
          result.editions.push({ competition: comp.name, year: ed.year, created: true });
        } catch (err: any) {
          result.editions.push({ competition: comp.name, year: ed.year, created: false, error: err.message });
          logger.error(`Scraper import edition ${comp.name} ${ed.year} failed: ${err.message}`);
        }
      }
    }

    return result;
  }
}
