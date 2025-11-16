-- Seed data for TerrainType
INSERT INTO "terrain_types" (id, name, slug, description, "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Alta montaña', 'alta-montana', 'Terreno de alta montaña con altitudes superiores a 2000m', 1, true, NOW(), NOW()),
  (gen_random_uuid(), 'Media montaña', 'media-montana', 'Terreno montañoso entre 1000m y 2000m de altitud', 2, true, NOW(), NOW()),
  (gen_random_uuid(), 'Baja montaña', 'baja-montana', 'Terreno montañoso por debajo de 1000m de altitud', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'Costa', 'costa', 'Terreno costero junto al mar', 4, true, NOW(), NOW()),
  (gen_random_uuid(), 'Desierto', 'desierto', 'Terreno desértico árido', 5, true, NOW(), NOW()),
  (gen_random_uuid(), 'Pista de tierra', 'pista-de-tierra', 'Caminos y pistas de tierra', 6, true, NOW(), NOW()),
  (gen_random_uuid(), 'Bosque', 'bosque', 'Terreno boscoso y forestal', 7, true, NOW(), NOW()),
  (gen_random_uuid(), 'Jungla', 'jungla', 'Terreno de selva tropical', 8, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
