// types/terrainType.ts - TerrainType catalog types

/**
 * TerrainType - Tipo de terreno para competiciones
 * Ejemplo: Alta montaña, Media montaña, Baja montaña, Costa, Desierto, etc.
 */
export interface TerrainType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Statistics (when included)
  _count?: {
    competitions: number;
    events: number;
  };
}

/**
 * TerrainTypeListItem - Simplified terrain type for selects/lists
 */
export interface TerrainTypeListItem {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

/**
 * CreateTerrainTypeInput - Data for creating a new terrain type
 */
export interface CreateTerrainTypeInput {
  name: string;
  description?: string;
  sortOrder?: number;
}

/**
 * UpdateTerrainTypeInput - Data for updating a terrain type
 */
export interface UpdateTerrainTypeInput {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

/**
 * TerrainTypeFilters - Filters for listing terrain types
 */
export interface TerrainTypeFilters {
  isActive?: boolean;
  search?: string;
}
