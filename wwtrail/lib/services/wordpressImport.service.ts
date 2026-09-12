// lib/services/wordpressImport.service.ts
// Imports blog posts parsed from a native WordPress WXR export (parsed to JSON
// client-side via the browser's DOMParser). Preserves original slugs when free,
// dedupes by slug, and maps WP status to our PostStatus.

import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import { generateUniqueSlug } from '@/lib/utils/slugify';
import { internalizeImageUrl, internalizeHtmlImages } from './imageImport';
import { PostCategory, PostStatus, Language } from '@prisma/client';

export interface WpPostInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  status?: string;       // WP status: publish | draft | pending | private | ...
  publishedAt?: string;  // ISO date
  featuredImage?: string;
}

export interface WpImportOptions {
  authorId: string;
  language: string;      // ES | EN | ...
  category: string;      // PostCategory
  statusOverride?: string; // force DRAFT/PUBLISHED/ARCHIVED, else map from WP
  onlyDrafts?: boolean;  // import everything as DRAFT for review
  internalizeImages?: boolean; // download images to our CDN (default true)
}

export interface WpImportResult {
  created: number;
  skipped: number;
  errors: { title: string; reason: string }[];
}

function mapStatus(wp?: string, override?: string, onlyDrafts?: boolean): PostStatus {
  if (onlyDrafts) return 'DRAFT';
  if (override && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(override)) return override as PostStatus;
  switch ((wp || '').toLowerCase()) {
    case 'publish': return 'PUBLISHED';
    case 'trash':
    case 'archived': return 'ARCHIVED';
    default: return 'DRAFT'; // draft, pending, private, future, ...
  }
}

const normCategory = (c: string): PostCategory => {
  const up = (c || 'GENERAL').toUpperCase();
  const valid: PostCategory[] = ['GENERAL', 'TRAINING', 'NUTRITION', 'GEAR', 'DESTINATIONS', 'INTERVIEWS', 'RACE_REPORTS', 'TIPS'];
  return (valid.includes(up as PostCategory) ? up : 'GENERAL') as PostCategory;
};

const normLang = (l: string): Language => {
  const up = (l || 'ES').toUpperCase();
  return (['ES', 'EN', 'IT', 'CA', 'FR', 'DE'].includes(up) ? up : 'ES') as Language;
};

export const WordpressImportService = {
  async importPosts(posts: WpPostInput[], opts: WpImportOptions): Promise<WpImportResult> {
    const res: WpImportResult = { created: 0, skipped: 0, errors: [] };
    const category = normCategory(opts.category);
    const language = normLang(opts.language);

    for (const p of posts) {
      const title = (p.title || '').trim();
      if (!title || !(p.content || '').trim()) { res.skipped++; continue; }
      try {
        const desiredSlug = (p.slug || '').trim().toLowerCase();
        // Dedupe: skip if a post already exists at the exported slug.
        if (desiredSlug) {
          const existing = await prisma.post.findUnique({ where: { slug: desiredSlug }, select: { id: true } });
          if (existing) { res.skipped++; continue; }
        }
        const slug = desiredSlug || (await generateUniqueSlug(title, 'post'));

        const status = mapStatus(p.status, opts.statusOverride, opts.onlyDrafts);
        const publishedAt = p.publishedAt ? new Date(p.publishedAt) : null;

        // Move images to our own CDN so posts don't hot-link the old WordPress.
        let content = p.content;
        let featuredImage = p.featuredImage?.trim() || null;
        if (opts.internalizeImages !== false) {
          featuredImage = (await internalizeImageUrl(featuredImage, 'imported/posts')) || null;
          content = (await internalizeHtmlImages(content, 'imported/posts')).html;
        }

        await prisma.post.create({
          data: {
            title,
            slug,
            excerpt: p.excerpt?.trim() || null,
            content,
            featuredImage,
            category,
            language,
            status,
            authorId: opts.authorId,
            publishedAt: status === 'PUBLISHED' ? (publishedAt || new Date()) : publishedAt,
          },
        });
        res.created++;
      } catch (e: any) {
        logger.warn(`[wp-import] "${title}" failed: ${e?.message || e}`);
        res.errors.push({ title, reason: e?.message || 'error' });
        res.skipped++;
      }
    }

    logger.info(`[wp-import] created=${res.created} skipped=${res.skipped} errors=${res.errors.length}`);
    return res;
  },

  /**
   * Migrate images of ALREADY-imported posts to our CDN. Processes a slice
   * (offset/limit) so the caller can drive it in batches and avoid timeouts;
   * idempotent (URLs already on our storage are skipped). Returns totals and
   * how many posts remain after this batch.
   */
  async migratePostImages(offset = 0, limit = 15): Promise<{
    total: number; processed: number; updated: number; migratedImages: number; remaining: number;
  }> {
    const total = await prisma.post.count();
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit,
      select: { id: true, content: true, featuredImage: true },
    });

    let updated = 0;
    let migratedImages = 0;
    for (const post of posts) {
      try {
        const newFeatured = await internalizeImageUrl(post.featuredImage, 'imported/posts');
        const { html, migrated } = await internalizeHtmlImages(post.content, 'imported/posts');
        const featuredChanged = newFeatured !== post.featuredImage;
        if (featuredChanged || migrated > 0) {
          await prisma.post.update({
            where: { id: post.id },
            data: { content: html, featuredImage: newFeatured || null },
          });
          updated++;
          migratedImages += migrated + (featuredChanged ? 1 : 0);
        }
      } catch (e: any) {
        logger.warn(`[wp-migrate-images] post ${post.id} failed: ${e?.message || e}`);
      }
    }

    const nextOffset = offset + posts.length;
    return { total, processed: posts.length, updated, migratedImages, remaining: Math.max(0, total - nextOffset) };
  },
};

export default WordpressImportService;
