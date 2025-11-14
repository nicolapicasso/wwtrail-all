import { prisma } from '../config/database';
import { AppError } from '../utils/errors';
import type {
  CreateHomeConfigurationInput,
  UpdateHomeConfigurationInput,
  CreateHomeBlockInput,
  UpdateHomeBlockInput,
  UpdateFullHomeConfigInput,
  ReorderBlocksInput,
} from '../schemas/homeConfiguration.schema';

export class HomeConfigurationService {
  /**
   * Obtener la configuración activa de la home
   */
  static async getActiveConfiguration() {
    const config = await prisma.homeConfiguration.findFirst({
      where: { isActive: true },
      include: {
        blocks: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    // Si no existe configuración, crear una por defecto
    if (!config) {
      return this.create({
        heroTitle: 'Bienvenido a WWTRAIL',
        heroSubtitle: 'La plataforma para trail runners',
        isActive: true,
      });
    }

    return config;
  }

  /**
   * Obtener configuración por ID
   */
  static async getById(id: string) {
    const config = await prisma.homeConfiguration.findUnique({
      where: { id },
      include: {
        blocks: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!config) {
      throw new AppError('Home configuration not found', 404);
    }

    return config;
  }

  /**
   * Crear nueva configuración
   */
  static async create(data: CreateHomeConfigurationInput) {
    // Si se marca como activa, desactivar las demás
    if (data.isActive) {
      await prisma.homeConfiguration.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const config = await prisma.homeConfiguration.create({
      data,
      include: {
        blocks: {
          orderBy: [{ order: 'asc' }],
        },
      },
    });

    return config;
  }

  /**
   * Actualizar configuración existente
   */
  static async update(id: string, data: UpdateHomeConfigurationInput) {
    // Verificar que existe
    await this.getById(id);

    // Si se marca como activa, desactivar las demás
    if (data.isActive) {
      await prisma.homeConfiguration.updateMany({
        where: {
          isActive: true,
          NOT: { id },
        },
        data: { isActive: false },
      });
    }

    const config = await prisma.homeConfiguration.update({
      where: { id },
      data,
      include: {
        blocks: {
          orderBy: [{ order: 'asc' }],
        },
      },
    });

    return config;
  }

  /**
   * Eliminar configuración
   */
  static async delete(id: string) {
    // Verificar que existe
    await this.getById(id);

    await prisma.homeConfiguration.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Actualizar configuración completa (hero + bloques)
   */
  static async updateFull(id: string, data: UpdateFullHomeConfigInput) {
    // Verificar que existe
    const existingConfig = await this.getById(id);

    // Iniciar transacción
    return await prisma.$transaction(async (tx) => {
      // 1. Actualizar hero
      await tx.homeConfiguration.update({
        where: { id },
        data: {
          heroImage: data.heroImage,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
        },
      });

      // 2. Separar bloques existentes (con ID) de nuevos (sin ID)
      const blocksToUpdate = data.blocks.filter((b) => b.id);
      const blocksToCreate = data.blocks.filter((b) => !b.id);

      // 3. Obtener IDs de bloques existentes que deben mantenerse
      const keepIds = blocksToUpdate.map((b) => b.id!);

      // 4. Eliminar bloques que ya no están en la lista
      await tx.homeBlock.deleteMany({
        where: {
          configurationId: id,
          id: {
            notIn: keepIds,
          },
        },
      });

      // 5. Actualizar bloques existentes
      for (const block of blocksToUpdate) {
        await tx.homeBlock.update({
          where: { id: block.id! },
          data: {
            type: block.type,
            order: block.order,
            visible: block.visible,
            config: block.config as any,
          },
        });
      }

      // 6. Crear nuevos bloques
      for (const block of blocksToCreate) {
        await tx.homeBlock.create({
          data: {
            configurationId: id,
            type: block.type,
            order: block.order,
            visible: block.visible,
            config: block.config as any,
          },
        });
      }

      // 7. Devolver configuración actualizada
      return tx.homeConfiguration.findUnique({
        where: { id },
        include: {
          blocks: {
            orderBy: [{ order: 'asc' }],
          },
        },
      });
    });
  }

  /**
   * Reordenar bloques
   */
  static async reorderBlocks(configId: string, data: ReorderBlocksInput) {
    // Verificar que la configuración existe
    await this.getById(configId);

    // Actualizar orden de cada bloque
    await prisma.$transaction(
      data.blockOrders.map(({ id, order }) =>
        prisma.homeBlock.update({
          where: { id },
          data: { order },
        })
      )
    );

    // Devolver configuración actualizada
    return this.getById(configId);
  }

  // =================================
  // BLOQUES INDIVIDUALES
  // =================================

  /**
   * Crear nuevo bloque
   */
  static async createBlock(configId: string, data: CreateHomeBlockInput) {
    // Verificar que la configuración existe
    await this.getById(configId);

    const block = await prisma.homeBlock.create({
      data: {
        configurationId: configId,
        type: data.type,
        order: data.order,
        visible: data.visible,
        config: data.config as any,
      },
    });

    return block;
  }

  /**
   * Actualizar bloque existente
   */
  static async updateBlock(blockId: string, data: UpdateHomeBlockInput) {
    // Verificar que el bloque existe
    const existingBlock = await prisma.homeBlock.findUnique({
      where: { id: blockId },
    });

    if (!existingBlock) {
      throw new AppError('Block not found', 404);
    }

    const block = await prisma.homeBlock.update({
      where: { id: blockId },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.visible !== undefined && { visible: data.visible }),
        ...(data.config && { config: data.config as any }),
      },
    });

    return block;
  }

  /**
   * Eliminar bloque
   */
  static async deleteBlock(blockId: string) {
    // Verificar que el bloque existe
    const existingBlock = await prisma.homeBlock.findUnique({
      where: { id: blockId },
    });

    if (!existingBlock) {
      throw new AppError('Block not found', 404);
    }

    await prisma.homeBlock.delete({
      where: { id: blockId },
    });

    return { success: true };
  }

  /**
   * Cambiar visibilidad de un bloque
   */
  static async toggleBlockVisibility(blockId: string) {
    const block = await prisma.homeBlock.findUnique({
      where: { id: blockId },
    });

    if (!block) {
      throw new AppError('Block not found', 404);
    }

    return await prisma.homeBlock.update({
      where: { id: blockId },
      data: { visible: !block.visible },
    });
  }
}
