/**
 * migrate-uploads-to-spaces.js
 *
 * Script to migrate all local upload files to DigitalOcean Spaces
 * and update the database URLs.
 *
 * Usage:
 *   1. Set environment variables (or create .env in wwtrail/ folder):
 *        DO_SPACES_KEY=your-key
 *        DO_SPACES_SECRET=your-secret
 *        DO_SPACES_ENDPOINT=https://ams3.digitaloceanspaces.com
 *        DO_SPACES_BUCKET=wwtrail-uploads
 *        DO_SPACES_CDN=https://wwtrail-uploads.ams3.cdn.digitaloceanspaces.com
 *        DATABASE_URL=postgresql://...  (production DB URL)
 *        UPLOADS_DIR=C:\wwtrail_new\wwtrail-backend\uploads
 *
 *   2. Run from the wwtrail/ directory:
 *        node scripts/migrate-uploads-to-spaces.js
 *
 *   3. Add --dry-run to preview without uploading:
 *        node scripts/migrate-uploads-to-spaces.js --dry-run
 */

const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Load .env if present
try { require('dotenv').config(); } catch {}

// ============ Configuration ============
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', '..', 'wwtrail-backend', 'uploads');
const SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT || 'https://ams3.digitaloceanspaces.com';
const SPACES_BUCKET = process.env.DO_SPACES_BUCKET || 'wwtrail-uploads';
const SPACES_CDN = process.env.DO_SPACES_CDN || 'https://wwtrail-uploads.ams3.cdn.digitaloceanspaces.com';
const DRY_RUN = process.argv.includes('--dry-run');

const MIME_TYPES = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf',
};

// ============ S3 Client ============
const s3 = new S3Client({
  endpoint: SPACES_ENDPOINT,
  forcePathStyle: false,
  region: 'ams3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
});

// ============ Prisma Client ============
const prisma = new PrismaClient();

// ============ Helpers ============
function getAllFiles(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.join(base, entry.name);
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, relativePath));
    } else {
      results.push({ fullPath, relativePath: relativePath.replace(/\\/g, '/') });
    }
  }
  return results;
}

async function fileExistsOnSpaces(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: SPACES_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile(fullPath, key) {
  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  await s3.send(new PutObjectCommand({
    Bucket: SPACES_BUCKET,
    Key: key,
    Body: buffer,
    ACL: 'public-read',
    ContentType: contentType,
    CacheControl: 'public, max-age=2592000, immutable',
  }));

  return `${SPACES_CDN}/${key}`;
}

// ============ Database URL Update ============
async function updateDatabaseUrls() {
  console.log('\n📝 Updating database URLs...\n');

  // All models and their URL fields
  const urlFields = [
    { model: 'event', fields: ['logoUrl', 'coverImage'] },
    { model: 'event', field: 'gallery', isArray: true },
    { model: 'competition', fields: ['logoUrl', 'coverImage'] },
    { model: 'competition', field: 'gallery', isArray: true },
    { model: 'edition', fields: ['logoUrl', 'coverImage'] },
    { model: 'organizer', fields: ['logoUrl'] },
    { model: 'specialSeries', fields: ['logoUrl'] },
    { model: 'service', fields: ['logoUrl', 'coverImage'] },
    { model: 'service', field: 'gallery', isArray: true },
    { model: 'user', fields: ['avatar'] },
    { model: 'file', fields: ['url'] },
    { model: 'editionPhoto', fields: ['url', 'thumbnail'] },
    { model: 'post', fields: ['coverImage'] },
    { model: 'post', field: 'gallery', isArray: true },
  ];

  let totalUpdated = 0;

  for (const config of urlFields) {
    const prismaModel = prisma[config.model];
    if (!prismaModel) continue;

    if (config.isArray) {
      // Handle array fields (gallery)
      try {
        const records = await prismaModel.findMany({
          select: { id: true, [config.field]: true },
        });

        for (const record of records) {
          const arr = record[config.field];
          if (!Array.isArray(arr) || arr.length === 0) continue;

          let changed = false;
          const newArr = arr.map(url => {
            const newUrl = convertUrl(url);
            if (newUrl !== url) changed = true;
            return newUrl;
          });

          if (changed) {
            if (!DRY_RUN) {
              await prismaModel.update({
                where: { id: record.id },
                data: { [config.field]: newArr },
              });
            }
            totalUpdated++;
            console.log(`  ✅ ${config.model}.${config.field} (array) - ${record.id}`);
          }
        }
      } catch {}
      continue;
    }

    // Handle scalar fields
    for (const field of (config.fields || [])) {
      try {
        const records = await prismaModel.findMany({
          where: { [field]: { not: null } },
          select: { id: true, [field]: true },
        });

        for (const record of records) {
          const oldUrl = record[field];
          if (!oldUrl) continue;
          const newUrl = convertUrl(oldUrl);

          if (newUrl !== oldUrl) {
            if (!DRY_RUN) {
              await prismaModel.update({
                where: { id: record.id },
                data: { [field]: newUrl },
              });
            }
            totalUpdated++;
            console.log(`  ✅ ${config.model}.${field} - ${oldUrl.substring(0, 60)}... → CDN`);
          }
        }
      } catch {}
    }
  }

  console.log(`\n📊 Total URL fields updated: ${totalUpdated}`);
}

function convertUrl(url) {
  if (!url || typeof url !== 'string') return url;

  // Already a Spaces CDN URL
  if (url.startsWith(SPACES_CDN)) return url;

  // localhost URLs → extract relative path
  if (url.startsWith('http://localhost:3001')) {
    const relativePath = url.substring('http://localhost:3001'.length);
    return `${SPACES_CDN}${relativePath}`;
  }
  if (url.startsWith('http://localhost:3000')) {
    const relativePath = url.substring('http://localhost:3000'.length);
    return `${SPACES_CDN}${relativePath}`;
  }

  // Relative /uploads/ path
  if (url.startsWith('/uploads/')) {
    return `${SPACES_CDN}${url}`;
  }

  // Relative uploads/ (no leading slash)
  if (url.startsWith('uploads/')) {
    return `${SPACES_CDN}/${url}`;
  }

  // Production domain URL → convert to CDN
  if (url.includes('ondigitalocean.app/uploads/')) {
    const idx = url.indexOf('/uploads/');
    return `${SPACES_CDN}${url.substring(idx)}`;
  }

  return url;
}

// ============ Main ============
async function main() {
  console.log('🚀 WWTRAIL Upload Migration to DigitalOcean Spaces');
  console.log('='.repeat(50));
  console.log(`📁 Source: ${UPLOADS_DIR}`);
  console.log(`☁️  Target: ${SPACES_CDN}`);
  console.log(`🪣 Bucket: ${SPACES_BUCKET}`);
  if (DRY_RUN) console.log('⚠️  DRY RUN - no files will be uploaded or URLs changed');
  console.log();

  if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
    console.error('❌ DO_SPACES_KEY and DO_SPACES_SECRET are required');
    process.exit(1);
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error(`❌ Uploads directory not found: ${UPLOADS_DIR}`);
    process.exit(1);
  }

  // Step 1: Scan files
  const files = getAllFiles(UPLOADS_DIR);
  console.log(`📄 Found ${files.length} files to upload\n`);

  // Step 2: Upload to Spaces
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const spacesKey = `uploads/${file.relativePath}`;

    try {
      // Check if already exists
      const exists = await fileExistsOnSpaces(spacesKey);
      if (exists) {
        skipped++;
        process.stdout.write(`⏭ `);
        continue;
      }

      if (DRY_RUN) {
        uploaded++;
        process.stdout.write(`📤 `);
        continue;
      }

      const cdnUrl = await uploadFile(file.fullPath, spacesKey);
      uploaded++;
      process.stdout.write(`✅ `);
    } catch (err) {
      errors++;
      console.error(`\n❌ Error uploading ${file.relativePath}: ${err.message}`);
    }
  }

  console.log(`\n\n📊 Upload results:`);
  console.log(`   ✅ Uploaded: ${uploaded}`);
  console.log(`   ⏭  Skipped (already exists): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);

  // Step 3: Update database URLs
  if (!DRY_RUN || true) { // Always show what would be updated
    await updateDatabaseUrls();
  }

  await prisma.$disconnect();
  console.log('\n🎉 Migration complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
