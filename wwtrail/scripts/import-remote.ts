/**
 * Import script to upload exported data to a remote WWTRAIL instance.
 *
 * Usage:
 *   npx tsx scripts/import-remote.ts <export-file.json> <remote-url> <admin-token>
 *
 * Example:
 *   npx tsx scripts/import-remote.ts wwtrail-export-2026-03-29.json https://wwtrail-5agxm.ondigitalocean.app eyJhbG...
 *
 * The admin token can be obtained by logging in via the API:
 *   curl -X POST https://your-app.ondigitalocean.app/api/v2/auth/login \
 *     -H "Content-Type: application/json" \
 *     -d '{"email":"admin@wwtrail.com","password":"your-password"}'
 */

import * as fs from 'fs';

const [,, exportFile, remoteUrl, adminToken] = process.argv;

if (!exportFile || !remoteUrl || !adminToken) {
  console.error('Usage: npx tsx scripts/import-remote.ts <export-file.json> <remote-url> <admin-token>');
  console.error('');
  console.error('Example:');
  console.error('  npx tsx scripts/import-remote.ts wwtrail-export-2026-03-29.json https://wwtrail-5agxm.ondigitalocean.app eyJhbG...');
  process.exit(1);
}

async function importToRemote() {
  console.log('==> Loading export file...');
  const data = JSON.parse(fs.readFileSync(exportFile, 'utf-8'));
  console.log(`    Exported at: ${data.exportedAt}`);
  console.log(`    Version: ${data.version}`);
  console.log('    Counts:', data.counts);

  const baseUrl = remoteUrl.replace(/\/$/, '');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
  };

  // Helper to make API calls
  async function apiCall(endpoint: string, body: any): Promise<any> {
    const url = `${baseUrl}${endpoint}`;
    console.log(`    POST ${endpoint}...`);
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(`    ERROR ${response.status}:`, result);
      return null;
    }
    return result;
  }

  // Step 1: Import terrain types
  if (data.data.terrainTypes?.length > 0) {
    console.log('\n==> Step 1: Importing terrain types...');
    const result = await apiCall('/api/v2/admin/import', { type: 'terrain-types' });
    if (result) console.log(`    Result:`, result.data || result);
  }

  // Step 2: Import organizers using native format
  if (data.data.organizers?.length > 0) {
    console.log(`\n==> Step 2: Importing ${data.data.organizers.length} organizers...`);
    const result = await apiCall('/api/v2/admin/import/native', {
      entityType: 'organizers',
      data: data.data.organizers,
      conflictResolution: 'skip',
    });
    if (result) console.log(`    Created: ${result.data?.summary?.created || 0}, Skipped: ${result.data?.summary?.skipped || 0}`);
  }

  // Step 3: Import special series
  if (data.data.specialSeries?.length > 0) {
    console.log(`\n==> Step 3: Importing ${data.data.specialSeries.length} special series...`);
    const result = await apiCall('/api/v2/admin/import/native', {
      entityType: 'specialSeries',
      data: data.data.specialSeries,
      conflictResolution: 'skip',
    });
    if (result) console.log(`    Created: ${result.data?.summary?.created || 0}, Skipped: ${result.data?.summary?.skipped || 0}`);
  }

  // Step 4: Import events
  if (data.data.events?.length > 0) {
    console.log(`\n==> Step 4: Importing ${data.data.events.length} events...`);
    const result = await apiCall('/api/v2/admin/import/native', {
      entityType: 'events',
      data: data.data.events,
      conflictResolution: 'skip',
    });
    if (result) console.log(`    Created: ${result.data?.summary?.created || 0}, Skipped: ${result.data?.summary?.skipped || 0}`);
  }

  // Step 5: Import competitions
  if (data.data.competitions?.length > 0) {
    console.log(`\n==> Step 5: Importing ${data.data.competitions.length} competitions...`);
    const result = await apiCall('/api/v2/admin/import/native', {
      entityType: 'competitions',
      data: data.data.competitions,
      conflictResolution: 'skip',
    });
    if (result) console.log(`    Created: ${result.data?.summary?.created || 0}, Skipped: ${result.data?.summary?.skipped || 0}`);
  }

  // Step 6: Import editions
  if (data.data.editions?.length > 0) {
    console.log(`\n==> Step 6: Importing ${data.data.editions.length} editions...`);
    const result = await apiCall('/api/v2/admin/import/native', {
      entityType: 'editions',
      data: data.data.editions,
      conflictResolution: 'skip',
    });
    if (result) console.log(`    Created: ${result.data?.summary?.created || 0}, Skipped: ${result.data?.summary?.skipped || 0}`);
  }

  // Step 7: Import services
  if (data.data.services?.length > 0) {
    console.log(`\n==> Step 7: Importing ${data.data.services.length} services...`);
    const result = await apiCall('/api/v2/admin/import/native', {
      entityType: 'services',
      data: data.data.services,
      conflictResolution: 'skip',
    });
    if (result) console.log(`    Created: ${result.data?.summary?.created || 0}, Skipped: ${result.data?.summary?.skipped || 0}`);
  }

  // Step 8: Import posts
  if (data.data.posts?.length > 0) {
    console.log(`\n==> Step 8: Importing ${data.data.posts.length} posts...`);
    const result = await apiCall('/api/v2/admin/import/native', {
      entityType: 'posts',
      data: data.data.posts,
      conflictResolution: 'skip',
    });
    if (result) console.log(`    Created: ${result.data?.summary?.created || 0}, Skipped: ${result.data?.summary?.skipped || 0}`);
  }

  console.log('\n==> Import complete!');
}

importToRemote()
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
