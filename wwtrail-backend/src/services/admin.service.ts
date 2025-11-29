// src/services/admin.service.ts

import { UserRole, Prisma, Gender } from '@prisma/client';
import prisma from '../config/database';
import bcrypt from 'bcrypt';

// ============================================
// INTERFACES
// ============================================

interface GetUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  isInsider?: boolean;
  sortBy?: 'createdAt' | 'firstName' | 'email' | 'role';
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedUsers {
  users: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalCompetitions: number;
  totalEditions: number;
  pendingApprovals: number;
  newUsersThisMonth: number;
  newEventsThisMonth: number;
  activeUsers: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  recentActivity: {
    type: string;
    count: number;
    date: string;
  }[];
}

interface UserStats {
  totalCompetitions: number;
  totalReviews: number;
  lastActivity: Date | null;
}

// ============================================
// ADMIN SERVICE
// ============================================

class AdminService {
  /**
   * Obtener estadísticas generales del dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Ejecutar todas las queries en paralelo
    const [
      totalUsers,
      totalEvents,
      totalCompetitions,
      totalEditions,
      pendingEvents,
      newUsersThisMonth,
      newEventsThisMonth,
      activeUsers,
      usersByRole,
    ] = await Promise.all([
      // Total de usuarios
      prisma.user.count(),

      // Total de eventos
      prisma.event.count(),

      // Total de competiciones
      prisma.competition.count(),

      // Total de ediciones
      prisma.edition.count(),

      // Eventos pendientes de aprobación (DRAFT)
      prisma.event.count({
        where: { status: 'DRAFT' },
      }),

      // Nuevos usuarios este mes
      prisma.user.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),

      // Nuevos eventos este mes
      prisma.event.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),

      // Usuarios activos
      prisma.user.count({
        where: { isActive: true },
      }),

      // Usuarios por rol
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true,
        },
      }),
    ]);

    // Actividad reciente (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const recentEvents = await prisma.event.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const recentReviews = await prisma.review.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      totalUsers,
      totalEvents,
      totalCompetitions,
      totalEditions,
      pendingApprovals: pendingEvents,
      newUsersThisMonth,
      newEventsThisMonth,
      activeUsers,
      usersByRole: usersByRole.map((item) => ({
        role: item.role,
        count: item._count.id,
      })),
      recentActivity: [
        {
          type: 'users',
          count: recentUsers,
          date: sevenDaysAgo.toISOString(),
        },
        {
          type: 'events',
          count: recentEvents,
          date: sevenDaysAgo.toISOString(),
        },
        {
          type: 'reviews',
          count: recentReviews,
          date: sevenDaysAgo.toISOString(),
        },
      ],
    };
  }

  /**
   * Obtener estadísticas completas del portal
   */
  async getComprehensiveStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Ejecutar todas las queries en paralelo
    const [
      // Users
      totalUsers,
      activeUsers,
      inactiveUsers,
      insiders,
      publicProfiles,
      usersByRole,
      usersThisMonth,
      usersThisWeek,

      // Events
      totalEvents,
      eventsByStatus,
      eventsByCountry,
      eventsThisMonth,

      // Competitions
      totalCompetitions,
      competitionsByStatus,
      competitionsByType,
      competitionsThisMonth,

      // Editions
      totalEditions,
      editionsByStatus,
      upcomingEditions,
      pastEditions,
      editionsThisMonth,

      // Special Series
      totalSpecialSeries,
      specialSeriesByStatus,

      // Services
      totalServices,
      servicesByStatus,
      servicesByCategory,
      featuredServices,

      // Reviews
      totalReviews,
      reviewsThisMonth,
      reviewsThisWeek,
      avgRating,

      // Organizers
      totalOrganizers,
      verifiedOrganizers,

      // Categories
      totalCategories,

      // Participants
      totalParticipants,

      // Favorites
      totalFavorites,
    ] = await Promise.all([
      // === USERS ===
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { isInsider: true } }),
      prisma.user.count({ where: { isPublic: true } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),

      // === EVENTS ===
      prisma.event.count(),
      prisma.event.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.event.groupBy({
        by: ['country'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      prisma.event.count({ where: { createdAt: { gte: firstDayOfMonth } } }),

      // === COMPETITIONS ===
      prisma.competition.count(),
      prisma.competition.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.competition.groupBy({
        by: ['type'],
        _count: { id: true },
      }),
      prisma.competition.count({ where: { createdAt: { gte: firstDayOfMonth } } }),

      // === EDITIONS ===
      prisma.edition.count(),
      prisma.edition.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.edition.count({ where: { startDate: { gte: now } } }),
      prisma.edition.count({ where: { startDate: { lt: now } } }),
      prisma.edition.count({ where: { createdAt: { gte: firstDayOfMonth } } }),

      // === SPECIAL SERIES ===
      prisma.specialSeries.count(),
      prisma.specialSeries.groupBy({
        by: ['status'],
        _count: { id: true },
      }),

      // === SERVICES ===
      prisma.service.count(),
      prisma.service.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.service.groupBy({
        by: ['categoryId'],
        _count: { id: true },
      }),
      prisma.service.count({ where: { isFeatured: true } }),

      // === REVIEWS ===
      prisma.review.count(),
      prisma.review.count({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.review.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.review.aggregate({
        _avg: { rating: true },
      }),

      // === ORGANIZERS ===
      prisma.organizer.count(),
      prisma.organizer.count({ where: { verified: true } }),

      // === CATEGORIES ===
      prisma.category.count(),

      // === PARTICIPANTS ===
      prisma.participant.count(),

      // === FAVORITES ===
      prisma.favorite.count(),
    ]);

    // Obtener nombres de categorías de servicios
    const serviceCategories = await prisma.serviceCategory.findMany({
      select: { id: true, name: true },
    });
    const categoryMap = new Map(serviceCategories.map(c => [c.id, c.name]));

    return {
      overview: {
        totalUsers,
        totalEvents,
        totalCompetitions,
        totalEditions,
        totalSpecialSeries,
        totalServices,
        totalReviews,
        totalOrganizers,
        totalCategories,
        totalParticipants,
        totalFavorites,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        insiders,
        publicProfiles,
        privateProfiles: totalUsers - publicProfiles,
        newThisMonth: usersThisMonth,
        newThisWeek: usersThisWeek,
        byRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.id,
        })),
      },
      events: {
        total: totalEvents,
        newThisMonth: eventsThisMonth,
        byStatus: eventsByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        byCountry: eventsByCountry.map(item => ({
          country: item.country,
          count: item._count.id,
        })),
      },
      competitions: {
        total: totalCompetitions,
        newThisMonth: competitionsThisMonth,
        byStatus: competitionsByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        byType: competitionsByType.map(item => ({
          type: item.type,
          count: item._count.id,
        })),
      },
      editions: {
        total: totalEditions,
        upcoming: upcomingEditions,
        past: pastEditions,
        newThisMonth: editionsThisMonth,
        byStatus: editionsByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
      },
      specialSeries: {
        total: totalSpecialSeries,
        byStatus: specialSeriesByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
      },
      services: {
        total: totalServices,
        featured: featuredServices,
        byStatus: servicesByStatus.map(item => ({
          status: item.status,
          count: item._count.id,
        })),
        byCategory: servicesByCategory.map(item => ({
          categoryId: item.categoryId,
          categoryName: categoryMap.get(item.categoryId) || 'Sin categoría',
          count: item._count.id,
        })),
      },
      reviews: {
        total: totalReviews,
        thisMonth: reviewsThisMonth,
        thisWeek: reviewsThisWeek,
        averageRating: avgRating._avg.rating ? Math.round(avgRating._avg.rating * 10) / 10 : 0,
      },
      organizers: {
        total: totalOrganizers,
        verified: verifiedOrganizers,
        unverified: totalOrganizers - verifiedOrganizers,
      },
      recentActivity: {
        usersThisWeek,
        eventsThisMonth,
        competitionsThisMonth,
        editionsThisMonth,
        reviewsThisWeek,
      },
    };
  }

  /**
   * Listar usuarios con filtros y paginación
   */
  async getUsers(filters: GetUsersFilters): Promise<PaginatedUsers> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      isInsider,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Construir where clause
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isInsider !== undefined) {
      where.isInsider = isInsider;
    }

    // Calcular offset
    const skip = (page - 1) * limit;

    // Ejecutar queries en paralelo
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          country: true,
          gender: true,
          role: true,
          isActive: true,
          isInsider: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              userCompetitions: true,
              reviews: true,
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
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        avatar: user.avatar,
        country: user.country,
        gender: user.gender,
        role: user.role,
        isActive: user.isActive,
        isInsider: user.isInsider,
        isPublic: user.isPublic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        stats: {
          competitions: user._count.userCompetitions,
          reviews: user._count.reviews,
        },
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
   * Obtener un usuario por ID con información detallada
   */
  async getUserById(userId: string) {
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
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userCompetitions: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
      bio: user.bio,
      avatar: user.avatar,
      phone: user.phone,
      city: user.city,
      country: user.country,
      language: user.language,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats: {
        competitions: user._count.userCompetitions,
        reviews: user._count.reviews,
      },
    };
  }

  /**
   * Cambiar el rol de un usuario
   */
  async updateUserRole(userId: string, newRole: UserRole, adminId: string) {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // No permitir que un admin se quite su propio rol de admin
    if (userId === adminId && user.role === 'ADMIN' && newRole !== 'ADMIN') {
      throw new Error('Cannot remove your own admin role');
    }

    // Actualizar rol
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      fullName: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.username,
    };
  }

  /**
   * Activar/Desactivar un usuario
   */
  async toggleUserStatus(userId: string, adminId: string) {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true, role: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // No permitir desactivar el propio usuario admin
    if (userId === adminId) {
      throw new Error('Cannot deactivate your own account');
    }

    // Toggle isActive
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      fullName: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.username,
    };
  }

  /**
   * Actualizar datos de un usuario
   */
  async updateUser(userId: string, data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    country?: string;
    gender?: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        country: data.country,
        gender: data.gender as any,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        isInsider: true,
        country: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      fullName: `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || updatedUser.username,
    };
  }

  /**
   * Eliminar un usuario (soft delete si tiene contenido)
   */
  async deleteUser(userId: string, adminId: string) {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        _count: {
          select: {
            userCompetitions: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // No permitir eliminar el propio usuario admin
    if (userId === adminId) {
      throw new Error('Cannot delete your own account');
    }

    // Verificar si el usuario tiene contenido asociado
    const hasContent =
      user._count.userCompetitions > 0 ||
      user._count.reviews > 0;

    if (hasContent) {
      // Soft delete: desactivar usuario
      const deactivatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
        select: {
          id: true,
          email: true,
          isActive: true,
        },
      });

      return {
        deleted: false,
        deactivated: true,
        user: deactivatedUser,
        message:
          'User has associated content. Account has been deactivated instead of deleted.',
      };
    } else {
      // Hard delete: eliminar usuario completamente
      await prisma.user.delete({
        where: { id: userId },
      });

      return {
        deleted: true,
        deactivated: false,
        message: 'User deleted successfully',
      };
    }
  }

  /**
   * Obtener contadores de contenido pendiente (DRAFT) para badge de admin
   */
  async getPendingContentCounts() {
    const [
      pendingEvents,
      pendingCompetitions,
      pendingServices,
      pendingOrganizers,
      pendingSpecialSeries,
      pendingPosts,
      pendingPromotions,
    ] = await Promise.all([
      prisma.event.count({ where: { status: 'DRAFT' } }),
      prisma.competition.count({ where: { status: 'DRAFT' } }),
      prisma.service.count({ where: { status: 'DRAFT' } }),
      prisma.organizer.count({ where: { status: 'DRAFT' } }),
      prisma.specialSeries.count({ where: { status: 'DRAFT' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.promotion.count({ where: { status: 'DRAFT' } }),
    ]);

    const total =
      pendingEvents +
      pendingCompetitions +
      pendingServices +
      pendingOrganizers +
      pendingSpecialSeries +
      pendingPosts +
      pendingPromotions;

    return {
      total,
      breakdown: {
        events: pendingEvents,
        competitions: pendingCompetitions,
        services: pendingServices,
        organizers: pendingOrganizers,
        specialSeries: pendingSpecialSeries,
        posts: pendingPosts,
        promotions: pendingPromotions,
      },
    };
  }

  /**
   * Obtener listado de contenido pendiente de revisión
   */
  async getPendingContent() {
    const [events, competitions, services, organizers, specialSeries, posts, promotions] =
      await Promise.all([
        prisma.event.findMany({
          where: { status: 'DRAFT' },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.competition.findMany({
          where: { status: 'DRAFT' },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            event: {
              select: {
                id: true,
                name: true,
              },
            },
            organizer: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.service.findMany({
          where: { status: 'DRAFT' },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            createdAt: true,
            organizer: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.organizer.findMany({
          where: { status: 'DRAFT' },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            createdAt: true,
            createdBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.specialSeries.findMany({
          where: { status: 'DRAFT' },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            name: true,
            slug: true,
            country: true,
            createdAt: true,
            createdBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.post.findMany({
          where: { status: 'DRAFT' },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
        prisma.promotion.findMany({
          where: { status: 'DRAFT' },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
            createdAt: true,
            createdBy: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }),
      ]);

    return {
      events: events.map((e) => ({
        ...e,
        type: 'event',
        createdByName: e.user
          ? `${e.user.firstName || ''} ${e.user.lastName || ''}`.trim() || e.user.username
          : 'Unknown',
      })),
      competitions: competitions.map((c) => ({
        ...c,
        type: 'competition',
        eventName: c.event?.name,
        createdByName: c.organizer
          ? `${c.organizer.firstName || ''} ${c.organizer.lastName || ''}`.trim() ||
            c.organizer.username
          : 'Unknown',
      })),
      services: services.map((s) => ({
        ...s,
        type: 'service',
        createdByName: s.organizer
          ? `${s.organizer.firstName || ''} ${s.organizer.lastName || ''}`.trim() ||
            s.organizer.username
          : 'Unknown',
      })),
      organizers: organizers.map((o) => ({
        ...o,
        type: 'organizer',
        createdByName: o.createdBy
          ? `${o.createdBy.firstName || ''} ${o.createdBy.lastName || ''}`.trim() ||
            o.createdBy.username
          : 'Unknown',
      })),
      specialSeries: specialSeries.map((ss) => ({
        ...ss,
        type: 'specialSeries',
        createdByName: ss.createdBy
          ? `${ss.createdBy.firstName || ''} ${ss.createdBy.lastName || ''}`.trim() ||
            ss.createdBy.username
          : 'Unknown',
      })),
      posts: posts.map((p) => ({
        ...p,
        type: 'post',
        createdByName: p.author
          ? `${p.author.firstName || ''} ${p.author.lastName || ''}`.trim() || p.author.username
          : 'Unknown',
      })),
      promotions: promotions.map((pr) => ({
        ...pr,
        type: 'promotion',
        createdByName: pr.createdBy
          ? `${pr.createdBy.firstName || ''} ${pr.createdBy.lastName || ''}`.trim() ||
            pr.createdBy.username
          : 'Unknown',
      })),
    };
  }

  /**
   * Obtener estadísticas de un usuario específico
   */
  async getUserStats(userId: string): Promise<UserStats> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        _count: {
          select: {
            userCompetitions: true,
            reviews: true,
          },
        },
        userCompetitions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { createdAt: true },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Determinar última actividad
    const activities = [
      ...(user.userCompetitions.length > 0
        ? [user.userCompetitions[0].createdAt]
        : []),
      ...(user.reviews.length > 0 ? [user.reviews[0].createdAt] : []),
    ];

    const lastActivity =
      activities.length > 0
        ? activities.reduce((latest, current) =>
            current > latest ? current : latest
          )
        : null;

    const stats: UserStats = {
      totalCompetitions: user._count.userCompetitions,
      totalReviews: user._count.reviews,
      lastActivity,
    };

    return stats;
  }

  // ============================================
  // USER CREATION
  // ============================================

  /**
   * Crear un nuevo usuario (admin only)
   */
  async createUser(data: {
    email: string;
    username: string;
    firstName: string;
    lastName?: string;
    role: UserRole;
    country?: string;
    gender?: Gender;
  }) {
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Generate random password
    const randomPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        country: data.country,
        gender: data.gender,
        password: hashedPassword,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        country: true,
        gender: true,
        createdAt: true,
      },
    });

    return {
      user,
      generatedPassword: randomPassword,
    };
  }

  /**
   * Generate a random password
   */
  private generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  // ============================================
  // INSIDER MANAGEMENT
  // ============================================

  /**
   * Get all insiders with stats
   */
  async getInsiders() {
    const insiders = await prisma.user.findMany({
      where: { isInsider: true },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        country: true,
        gender: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { firstName: 'asc' },
    });

    // Get stats
    const byCountry: Record<string, number> = {};
    const byGender: Record<string, number> = { MALE: 0, FEMALE: 0, NON_BINARY: 0, unknown: 0 };

    insiders.forEach((insider) => {
      // Count by country
      const country = insider.country || 'unknown';
      byCountry[country] = (byCountry[country] || 0) + 1;

      // Count by gender
      const gender = insider.gender || 'unknown';
      byGender[gender] = (byGender[gender] || 0) + 1;
    });

    return {
      insiders: insiders.map((i) => ({
        ...i,
        fullName: `${i.firstName || ''} ${i.lastName || ''}`.trim() || i.username,
      })),
      stats: {
        total: insiders.length,
        byCountry,
        byGender,
      },
    };
  }

  /**
   * Toggle insider status for a user
   */
  async toggleInsiderStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isInsider: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isInsider: !user.isInsider },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isInsider: true,
      },
    });

    return updatedUser;
  }

  /**
   * Toggle public status for a user
   */
  async togglePublicStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isPublic: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isPublic: !user.isPublic },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isPublic: true,
      },
    });

    return updatedUser;
  }

  // ============================================
  // INSIDER CONFIG
  // ============================================

  /**
   * Get insider config (badge and intro texts)
   */
  async getInsiderConfig() {
    let config = await prisma.insiderConfig.findFirst();

    // Create default config if not exists
    if (!config) {
      config = await prisma.insiderConfig.create({
        data: {},
      });
    }

    return config;
  }

  /**
   * Update insider config
   */
  async updateInsiderConfig(data: {
    badgeUrl?: string;
    introTextES?: string;
    introTextEN?: string;
    introTextIT?: string;
    introTextCA?: string;
    introTextFR?: string;
    introTextDE?: string;
  }) {
    let config = await prisma.insiderConfig.findFirst();

    if (config) {
      config = await prisma.insiderConfig.update({
        where: { id: config.id },
        data,
      });
    } else {
      config = await prisma.insiderConfig.create({
        data,
      });
    }

    return config;
  }
}

export default new AdminService();
