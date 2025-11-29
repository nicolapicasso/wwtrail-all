// src/services/user.service.ts

import { Prisma, Gender } from '@prisma/client';
import prisma from '../config/database';
import bcrypt from 'bcrypt';
import { UpdateUserInput, ChangePasswordInput, GetPublicUsersQuery } from '../schemas/user.schema';

// ============================================
// INTERFACES
// ============================================

interface PaginatedPublicUsers {
  users: PublicUserSummary[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface PublicUserSummary {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar: string | null;
  country: string | null;
  city: string | null;
  bio: string | null;
  gender: Gender | null;
  age: number | null;
  isInsider: boolean;
  participationsCount: number;
  finishesCount: number;
}

interface PublicUserProfile {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  avatar: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  gender: Gender | null;
  age: number | null;
  isInsider: boolean;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  createdAt: Date;
  participations: UserParticipation[];
  stats: {
    totalParticipations: number;
    totalFinishes: number;
    totalDNF: number;
  };
}

interface UserParticipation {
  id: string;
  editionId: string;
  status: string;
  finishTime: string | null;
  position: number | null;
  categoryPosition: number | null;
  categoryType: string | null;
  categoryName: string | null;
  edition: {
    id: string;
    year: number;
    slug: string;
    competition: {
      id: string;
      name: string;
      slug: string;
      event: {
        id: string;
        name: string;
        slug: string;
        country: string;
      };
    };
  };
}

// ============================================
// USER SERVICE
// ============================================

class UserService {
  /**
   * Obtener perfil propio (autenticado)
   */
  async getOwnProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        phone: true,
        city: true,
        country: true,
        language: true,
        role: true,
        isActive: true,
        gender: true,
        birthDate: true,
        isPublic: true,
        instagramUrl: true,
        facebookUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userEditions: true,
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
      age: user.birthDate ? this.calculateAge(user.birthDate) : null,
      stats: {
        participations: user._count.userEditions,
        reviews: user._count.reviews,
        favorites: user._count.favorites,
      },
    };
  }

  /**
   * Obtener perfil público por username
   */
  async getPublicProfileByUsername(username: string): Promise<PublicUserProfile> {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        city: true,
        country: true,
        gender: true,
        birthDate: true,
        isPublic: true,
        isInsider: true,
        instagramUrl: true,
        facebookUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        createdAt: true,
        userEditions: {
          where: {
            status: {
              in: ['COMPLETED', 'DNF'],
            },
          },
          orderBy: [
            { edition: { year: 'desc' } },
            { createdAt: 'desc' },
          ],
          select: {
            id: true,
            editionId: true,
            status: true,
            finishTime: true,
            position: true,
            categoryPosition: true,
            categoryType: true,
            categoryName: true,
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
                        country: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isPublic) {
      throw new Error('This profile is private');
    }

    const completedCount = user.userEditions.filter(ue => ue.status === 'COMPLETED').length;
    const dnfCount = user.userEditions.filter(ue => ue.status === 'DNF').length;

    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
      avatar: user.avatar,
      bio: user.bio,
      country: user.country,
      city: user.city,
      gender: user.gender,
      age: user.birthDate ? this.calculateAge(user.birthDate) : null,
      isInsider: user.isInsider,
      instagramUrl: user.instagramUrl,
      facebookUrl: user.facebookUrl,
      twitterUrl: user.twitterUrl,
      youtubeUrl: user.youtubeUrl,
      createdAt: user.createdAt,
      participations: user.userEditions,
      stats: {
        totalParticipations: user.userEditions.length,
        totalFinishes: completedCount,
        totalDNF: dnfCount,
      },
    };
  }

  /**
   * Listar usuarios públicos con filtros
   */
  async getPublicUsers(filters: GetPublicUsersQuery): Promise<PaginatedPublicUsers> {
    const {
      page: pageParam = 1,
      limit: limitParam = 20,
      search,
      country,
      minAge,
      maxAge,
      editionId,
    } = filters;

    // Ensure page and limit are integers
    const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : pageParam;
    const limit = typeof limitParam === 'string' ? parseInt(limitParam, 10) : limitParam;

    // Construir where clause
    const where: Prisma.UserWhereInput = {
      isPublic: true,
      isActive: true,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (country) {
      where.country = country;
    }

    // Filtro por edad (basado en birthDate)
    if (minAge !== undefined || maxAge !== undefined) {
      const now = new Date();

      if (minAge !== undefined) {
        const maxBirthDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
        where.birthDate = {
          ...((where.birthDate as Prisma.DateTimeFilter) || {}),
          lte: maxBirthDate,
        };
      }

      if (maxAge !== undefined) {
        const minBirthDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
        where.birthDate = {
          ...((where.birthDate as Prisma.DateTimeFilter) || {}),
          gte: minBirthDate,
        };
      }
    }

    // Filtro por participación en edición específica
    if (editionId) {
      where.userEditions = {
        some: {
          editionId,
          status: {
            in: ['COMPLETED', 'DNF'],
          },
        },
      };
    }

    // Calcular offset
    const skip = (page - 1) * limit;

    // Ejecutar queries en paralelo
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { firstName: 'asc' },
          { lastName: 'asc' },
        ],
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          country: true,
          city: true,
          bio: true,
          gender: true,
          birthDate: true,
          isInsider: true,
          _count: {
            select: {
              userEditions: {
                where: {
                  status: {
                    in: ['COMPLETED', 'DNF'],
                  },
                },
              },
            },
          },
          userEditions: {
            where: {
              status: 'COMPLETED',
            },
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Calcular paginación
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        avatar: user.avatar,
        country: user.country,
        city: user.city,
        bio: user.bio,
        gender: user.gender,
        age: user.birthDate ? this.calculateAge(user.birthDate) : null,
        isInsider: user.isInsider,
        participationsCount: user._count.userEditions,
        finishesCount: user.userEditions.length,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Actualizar perfil propio
   */
  async updateProfile(userId: string, data: UpdateUserInput) {
    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Si se cambia el username, verificar que no existe
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: data.username },
      });

      if (usernameExists) {
        throw new Error('Username already taken');
      }
    }

    // Preparar datos para actualizar
    const updateData: Prisma.UserUpdateInput = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.avatar !== undefined) updateData.avatar = data.avatar || null;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.birthDate !== undefined) updateData.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    if (data.instagramUrl !== undefined) updateData.instagramUrl = data.instagramUrl || null;
    if (data.facebookUrl !== undefined) updateData.facebookUrl = data.facebookUrl || null;
    if (data.twitterUrl !== undefined) updateData.twitterUrl = data.twitterUrl || null;
    if (data.youtubeUrl !== undefined) updateData.youtubeUrl = data.youtubeUrl || null;

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        phone: true,
        city: true,
        country: true,
        language: true,
        role: true,
        gender: true,
        birthDate: true,
        isPublic: true,
        instagramUrl: true,
        facebookUrl: true,
        twitterUrl: true,
        youtubeUrl: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      fullName: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.username,
      age: updatedUser.birthDate ? this.calculateAge(updatedUser.birthDate) : null,
    };
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId: string, data: ChangePasswordInput) {
    // Obtener usuario con contraseña
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);

    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash nueva contraseña
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Obtener participaciones del usuario
   */
  async getUserParticipations(userId: string) {
    const participations = await prisma.userEdition.findMany({
      where: { userId },
      orderBy: [
        { edition: { year: 'desc' } },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        editionId: true,
        status: true,
        finishTime: true,
        finishTimeSeconds: true,
        position: true,
        categoryPosition: true,
        categoryType: true,
        categoryName: true,
        bibNumber: true,
        notes: true,
        personalRating: true,
        completedAt: true,
        createdAt: true,
        edition: {
          select: {
            id: true,
            year: true,
            slug: true,
            startDate: true,
            distance: true,
            elevation: true,
            competition: {
              select: {
                id: true,
                name: true,
                slug: true,
                baseDistance: true,
                baseElevation: true,
                event: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    country: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return participations;
  }

  /**
   * Obtener participantes de una edición (para bloque público)
   */
  async getEditionParticipants(editionId: string) {
    const participants = await prisma.userEdition.findMany({
      where: {
        editionId,
        status: {
          in: ['COMPLETED', 'DNF'],
        },
        user: {
          isPublic: true,
          isActive: true,
        },
      },
      orderBy: [
        { position: 'asc' },
        { finishTimeSeconds: 'asc' },
      ],
      select: {
        id: true,
        status: true,
        finishTime: true,
        position: true,
        categoryPosition: true,
        categoryType: true,
        categoryName: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            country: true,
          },
        },
      },
    });

    return participants.map((p) => ({
      id: p.id,
      status: p.status,
      finishTime: p.finishTime,
      position: p.position,
      categoryPosition: p.categoryPosition,
      categoryType: p.categoryType,
      categoryName: p.categoryName,
      user: {
        id: p.user.id,
        username: p.user.username,
        fullName: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || p.user.username,
        avatar: p.user.avatar,
        country: p.user.country,
      },
    }));
  }

  /**
   * Calcular edad a partir de fecha de nacimiento
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Obtener insiders públicos con configuración
   */
  async getPublicInsiders() {
    // Obtener configuración de insiders
    const config = await prisma.insiderConfig.findFirst();

    // Obtener lista de insiders públicos
    const insiders = await prisma.user.findMany({
      where: {
        isInsider: true,
        isActive: true,
        isPublic: true,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        country: true,
        city: true,
        bio: true,
      },
      orderBy: { firstName: 'asc' },
    });

    // Calcular stats por país
    const byCountry: Record<string, number> = {};
    insiders.forEach((i) => {
      const country = i.country || 'unknown';
      byCountry[country] = (byCountry[country] || 0) + 1;
    });

    return {
      config: config
        ? {
            badgeUrl: config.badgeUrl,
            introTextES: config.introTextES,
            introTextEN: config.introTextEN,
            introTextIT: config.introTextIT,
            introTextCA: config.introTextCA,
            introTextFR: config.introTextFR,
            introTextDE: config.introTextDE,
          }
        : null,
      insiders: insiders.map((i) => ({
        id: i.id,
        username: i.username,
        fullName: `${i.firstName || ''} ${i.lastName || ''}`.trim() || i.username,
        avatar: i.avatar,
        country: i.country,
        city: i.city,
        bio: i.bio,
      })),
      stats: {
        total: insiders.length,
        byCountry,
      },
    };
  }
}

export default new UserService();
