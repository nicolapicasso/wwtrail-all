// lib/services/scraper/types.ts
// Normalized shapes produced by the AI-assisted scraper. These are intentionally
// close to what EventService/CompetitionService/EditionService.create accept, so
// the import step is a thin mapping.

// A candidate match found in our DB for a scraped entity, with a confidence
// score (0-1) and a short human reason. Used to surface "possible duplicates".
export interface MatchInfo {
  id: string;
  slug?: string;
  name: string;
  score: number; // 0-1
  reason: string;
}

export interface ScrapedEdition {
  year: number;
  startDate?: string | null; // ISO date (YYYY-MM-DD)
  endDate?: string | null;
  distance?: number | null; // km (overrides competition base for this year)
  elevation?: number | null; // m+
  registrationUrl?: string | null;
  // Set during dedup: the matching edition already in the DB, if any.
  existing?: { id: string } | null;
}

export interface ScrapedCompetition {
  name: string;
  description?: string | null;
  type?: string | null; // e.g. TRAIL, ULTRA, VERTICAL... (free text, mapped as-is)
  baseDistance?: number | null; // km
  baseElevation?: number | null; // m+
  itraPoints?: number | null; // 0-6
  editions: ScrapedEdition[];
  // Set during dedup: a confident match (auto-reused on import).
  existing?: { id: string; slug: string } | null;
  // A softer candidate the admin can confirm (medium confidence).
  suggestion?: MatchInfo | null;
}

export interface ScrapedEvent {
  name: string;
  country?: string | null; // ISO-2
  city?: string | null;
  website?: string | null;
  description?: string | null;
  typicalMonth?: number | null; // 1-12
  firstEditionYear?: number | null;
  // Set during dedup: a confident match (auto-reused on import).
  existing?: { id: string; slug: string; name: string } | null;
  // A softer candidate the admin can confirm (medium confidence).
  suggestion?: MatchInfo | null;
}

export interface ScrapedGraph {
  event: ScrapedEvent;
  competitions: ScrapedCompetition[];
}

export type FetchMode = 'auto' | 'static' | 'render' | 'paste';

export interface ScanInput {
  url?: string;
  html?: string; // used when mode === 'paste'
  mode?: FetchMode;
}

export interface ScanResult {
  sourceUrl: string | null;
  fetchMode: FetchMode;
  title: string | null;
  graph: ScrapedGraph;
  warnings: string[];
}
