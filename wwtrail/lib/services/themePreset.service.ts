// lib/services/themePreset.service.ts
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';
import {
  BUILTIN_PRESETS,
  THEME_FIELDS,
  pickThemeValues,
  type ThemePreset,
  type ThemeValues,
} from '@/lib/theme/presets';

export class ThemePresetService {
  /**
   * List all presets: built-ins first, then user-created ones (newest first).
   */
  static async list(): Promise<ThemePreset[]> {
    const saved = await prisma.themePreset.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const savedMapped: ThemePreset[] = saved.map((p) => ({
      id: p.id,
      name: p.name,
      builtin: false,
      ...pickThemeValues(p),
    }));

    return [...BUILTIN_PRESETS, ...savedMapped];
  }

  /**
   * Create a user preset from a theme snapshot. The name must be unique and
   * cannot collide with a built-in preset name.
   */
  static async create(name: string, values: Partial<ThemeValues>): Promise<ThemePreset> {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      throw new Error('El nombre del preset es obligatorio');
    }
    if (BUILTIN_PRESETS.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error('Ese nombre está reservado para un preset integrado');
    }

    const themeValues = pickThemeValues(values);
    // Guard against saving an empty/partial snapshot.
    if (!themeValues.colorPrimary) {
      throw new Error('No hay valores de tema válidos para guardar');
    }

    const created = await prisma.themePreset.create({
      data: { name: trimmed, ...themeValues },
    });

    logger.info(`ThemePreset created: ${trimmed}`);

    return { id: created.id, name: created.name, builtin: false, ...pickThemeValues(created) };
  }

  /**
   * Delete a user preset. Built-in presets (id prefixed with "builtin:") cannot
   * be deleted.
   */
  static async delete(id: string): Promise<void> {
    if (id.startsWith('builtin:')) {
      throw new Error('Los presets integrados no se pueden eliminar');
    }
    await prisma.themePreset.delete({ where: { id } });
    logger.info(`ThemePreset deleted: ${id}`);
  }
}

export { THEME_FIELDS };
