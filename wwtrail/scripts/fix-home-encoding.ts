/**
 * Repair mojibake in HomeBlock config text.
 *
 * Some home-configuration block titles/subtitles were saved through a
 * non-UTF-8 write path, which turned each accented character into one or two
 * literal "?" characters (e.g. "Últimos eventos añadidos" -> "??ltimos eventos
 * a??adidos"). That is byte-level data loss and cannot be recovered
 * programmatically in the general case, so this script performs *targeted*
 * replacements: it matches the still-intact parts of each known string and
 * rewrites the whole value to the correct UTF-8 text.
 *
 * It is idempotent and only touches values that still match a broken pattern.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npx tsx scripts/fix-home-encoding.ts
 *   # dry run (no writes):
 *   DATABASE_URL="postgresql://..." npx tsx scripts/fix-home-encoding.ts --dry
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY = process.argv.includes('--dry');

// Each rule matches a corrupted value by its intact fragments (accented chars
// replaced by one or more "?") and maps it to the correct string. Extend this
// list if you find other corrupted labels.
interface Rule {
  // Regex applied to a string value; if it matches, replace the whole value.
  match: RegExp;
  replacement: string;
}

const RULES: Rule[] = [
  { match: /^\?+ltimos eventos a\?+adidos$/i, replacement: 'Últimos eventos añadidos' },
  { match: /^Desc\?+brelos, enam\?+rate de ellos\.?$/i, replacement: 'Descúbrelos, enamórate de ellos.' },
];

// Config keys that hold user-facing text.
const TEXT_KEYS = ['title', 'subtitle', 'content', 'description', 'ctaLabel', 'buttonLabel'];

function repairValue(value: unknown): { changed: boolean; value: unknown } {
  if (typeof value !== 'string') return { changed: false, value };
  for (const rule of RULES) {
    if (rule.match.test(value)) {
      return { changed: true, value: rule.replacement };
    }
  }
  return { changed: false, value };
}

async function main() {
  const blocks = await prisma.homeBlock.findMany({ select: { id: true, type: true, config: true } });
  let fixed = 0;

  for (const block of blocks) {
    const config = block.config as Record<string, any> | null;
    if (!config || typeof config !== 'object') continue;

    let blockChanged = false;
    const nextConfig = { ...config };

    for (const key of TEXT_KEYS) {
      const { changed, value } = repairValue(config[key]);
      if (changed) {
        console.log(`  [${block.type}] ${key}: ${JSON.stringify(config[key])} -> ${JSON.stringify(value)}`);
        nextConfig[key] = value;
        blockChanged = true;
      }
    }

    if (blockChanged) {
      fixed++;
      if (!DRY) {
        await prisma.homeBlock.update({ where: { id: block.id }, data: { config: nextConfig } });
      }
    }
  }

  console.log(
    fixed === 0
      ? 'No corrupted home block text found. Nothing to do.'
      : `${DRY ? '[dry run] Would fix' : 'Fixed'} ${fixed} home block(s).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
