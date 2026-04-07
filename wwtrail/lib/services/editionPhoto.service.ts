import { prisma } from '@/lib/db';
import { ApiError as AppError } from '@/lib/utils/errors';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { uploadToSpaces, deleteFromSpaces, getKeyFromUrl, isSpacesConfigured } from '@/lib/services/spaces.client';
import type {
  UpdatePhotoMetadataInput,
  ReorderPhotosInput,
} from '@/lib/schemas/editionPhoto.schema';

export class EditionPhotoService {
  /**
   * Process image with Sharp and return buffers
   * - Resize if too large
   * - Generate thumbnail
   * - Optimize quality
   */
  static async processImage(filePath: string): Promise<{
    originalBuffer: Buffer;
    thumbnailBuffer: Buffer;
    width: number;
    height: number;
    fileSize: number;
  }> {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      const maxWidth = 1920;
      const maxHeight = 1080;
      const thumbnailWidth = 400;

      // Process original (resize if too large)
      let originalBuffer: Buffer;
      if (metadata.width && metadata.width > maxWidth) {
        originalBuffer = await sharp(filePath)
          .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
      } else {
        originalBuffer = await sharp(filePath)
          .jpeg({ quality: 85 })
          .toBuffer();
      }

      // Generate thumbnail
      const thumbnailBuffer = await sharp(filePath)
        .resize(thumbnailWidth, null, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Get processed metadata
      const processedMeta = await sharp(originalBuffer).metadata();

      return {
        originalBuffer,
        thumbnailBuffer,
        width: processedMeta.width || 0,
        height: processedMeta.height || 0,
        fileSize: originalBuffer.length,
      };
    } catch (error) {
      throw new AppError('Error processing image', 500);
    }
  }

  /**
   * Upload photo to an edition
   */
  static async upload(
    editionId: string,
    file: Express.Multer.File,
    metadata: {
      caption?: string;
      photographer?: string;
      sortOrder?: number;
      isFeatured?: boolean;
    }
  ) {
    // Verify edition exists
    const edition = await prisma.edition.findUnique({
      where: { id: editionId },
    });

    if (!edition) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      throw new AppError('Edition not found', 404);
    }

    // Process image
    const processed = await this.processImage(file.path);

    // Generate unique names
    const ext = '.jpg'; // Sharp outputs JPEG
    const baseName = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .substring(0, 80);
    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 8);
    const originalKey = `uploads/photos/${baseName}-${timestamp}-${rand}${ext}`;
    const thumbnailKey = `uploads/photos/${baseName}-${timestamp}-${rand}-thumb${ext}`;

    let url: string;
    let thumbnail: string;

    if (isSpacesConfigured()) {
      // Upload to DigitalOcean Spaces
      url = await uploadToSpaces(processed.originalBuffer, originalKey, 'image/jpeg');
      thumbnail = await uploadToSpaces(processed.thumbnailBuffer, thumbnailKey, 'image/jpeg');
    } else {
      // Fallback: save locally
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'photos');
      fs.mkdirSync(uploadDir, { recursive: true });

      const originalPath = path.join(uploadDir, `${baseName}-${timestamp}-${rand}${ext}`);
      const thumbPath = path.join(uploadDir, `${baseName}-${timestamp}-${rand}-thumb${ext}`);
      fs.writeFileSync(originalPath, processed.originalBuffer);
      fs.writeFileSync(thumbPath, processed.thumbnailBuffer);

      url = `/uploads/photos/${baseName}-${timestamp}-${rand}${ext}`;
      thumbnail = `/uploads/photos/${baseName}-${timestamp}-${rand}-thumb${ext}`;
    }

    // Clean up temp upload file
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    // Create DB record
    const photo = await prisma.editionPhoto.create({
      data: {
        editionId,
        url,
        thumbnail,
        caption: metadata.caption,
        photographer: metadata.photographer,
        width: processed.width,
        height: processed.height,
        fileSize: processed.fileSize,
        mimeType: 'image/jpeg',
        sortOrder: metadata.sortOrder || 0,
        isFeatured: metadata.isFeatured || false,
      },
    });

    return photo;
  }

  /**
   * Get all photos for an edition
   */
  static async getByEdition(editionId: string) {
    return prisma.editionPhoto.findMany({
      where: { editionId },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  /**
   * Get photo by ID
   */
  static async getById(photoId: string) {
    const photo = await prisma.editionPhoto.findUnique({
      where: { id: photoId },
      include: {
        edition: {
          select: {
            id: true,
            year: true,
            slug: true,
            competition: {
              select: {
                id: true,
                name: true,
                slug: true,
                event: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    return photo;
  }

  /**
   * Update photo metadata
   */
  static async updateMetadata(photoId: string, data: UpdatePhotoMetadataInput) {
    const existingPhoto = await prisma.editionPhoto.findUnique({
      where: { id: photoId },
    });

    if (!existingPhoto) {
      throw new AppError('Photo not found', 404);
    }

    return prisma.editionPhoto.update({
      where: { id: photoId },
      data,
    });
  }

  /**
   * Delete a photo (from Spaces/filesystem and DB)
   */
  static async delete(photoId: string) {
    const photo = await prisma.editionPhoto.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new AppError('Photo not found', 404);
    }

    // Delete files
    try {
      if (isSpacesConfigured()) {
        const key = getKeyFromUrl(photo.url);
        if (key) await deleteFromSpaces(key);
        if (photo.thumbnail) {
          const thumbKey = getKeyFromUrl(photo.thumbnail);
          if (thumbKey) await deleteFromSpaces(thumbKey);
        }
      } else {
        // Local filesystem fallback
        const urlPath = photo.url.startsWith('http') ? new URL(photo.url).pathname : photo.url;
        const filePath = path.join(process.cwd(), 'public', urlPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (photo.thumbnail) {
          const thumbUrlPath = photo.thumbnail.startsWith('http') ? new URL(photo.thumbnail).pathname : photo.thumbnail;
          const thumbFilePath = path.join(process.cwd(), 'public', thumbUrlPath);
          if (fs.existsSync(thumbFilePath)) fs.unlinkSync(thumbFilePath);
        }
      }
    } catch (error) {
      console.error('Error deleting files:', error);
    }

    await prisma.editionPhoto.delete({ where: { id: photoId } });
    return { message: 'Photo deleted successfully' };
  }

  /**
   * Reorder photos
   */
  static async reorder(editionId: string, data: ReorderPhotosInput) {
    const edition = await prisma.edition.findUnique({
      where: { id: editionId },
    });

    if (!edition) {
      throw new AppError('Edition not found', 404);
    }

    const updates = data.photoOrders.map((item) =>
      prisma.editionPhoto.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    );

    await Promise.all(updates);
    return this.getByEdition(editionId);
  }
}
