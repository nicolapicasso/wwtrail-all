// components/EventCard.tsx - Extended card with images and management features
// ✅ CON REDES SOCIALES

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Event } from '@/lib/types/event';
import { 
  Calendar, MapPin, Users, Eye, Edit, Trash2, Plus, 
  CheckCircle, XCircle, Clock, Star, Mountain, Globe, 
  TrendingUp, Image as ImageIcon 
} from 'lucide-react';

interface EventCardProps {
  event: Event;
  showStats?: boolean;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
  // Props para modo gestión
  managementMode?: boolean;
  userRole?: 'ADMIN' | 'ORGANIZER' | 'ATHLETE';
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onAddCompetition?: (eventId: string) => void;
  onApprove?: (eventId: string) => void;
  onReject?: (eventId: string) => void;
  onToggleFeatured?: (eventId: string) => void;
// Props para selección múltiple
  isSelected?: boolean;
  onSelect?: () => void;
  // Props para modo simplificado (solo imagen + logo)
  simplified?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const COUNTRY_FLAGS: { [key: string]: string } = {
  'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'CH': '🇨🇭',
  'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'AT': '🇦🇹',
  'PT': '🇵🇹', 'CA': '🇨🇦', 'NL': '🇳🇱', 'BE': '🇧🇪',
};

export default function EventCard({
  event,
  showStats = true,
  onClick,
  viewMode = 'grid',
  // Management mode props
  managementMode = false,
  userRole = 'ATHLETE',
  onEdit,
  onDelete,
  onAddCompetition,
  onApprove,
  onReject,
  onToggleFeatured,
// Selection props
  isSelected = false,
  onSelect,
  // Simplified mode
  simplified = false,
}: EventCardProps) {
  
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // ✅ FIX: Determinar imagen principal - Soportar campos nuevos y NO usar gallery
  const mainImage = event.coverImage || event.coverImageUrl || null;
  const logoImage = event.logo || event.logoUrl || null;
  const hasGallery = event.gallery && event.gallery.length > 0;
  const competitionCount = event._count?.competitions || 0;

  // ✅ NUEVO: Obtener redes sociales del evento
  const socialLinks = {
    instagram: (event as any).instagramUrl,
    facebook: (event as any).facebookUrl,
    twitter: (event as any).twitterUrl,
    youtube: (event as any).youtubeUrl,
  };

  // ✅ NUEVO: Verificar si tiene alguna red social
  const hasSocialLinks = Object.values(socialLinks).some(link => link);

  // Función para obtener config de estado (modo gestión)
  const getStatusConfig = (status: string) => {
    const configs = {
      PUBLISHED: {
        label: 'Publicado',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle,
      },
      DRAFT: {
        label: 'Borrador',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: Clock,
      },
      REJECTED: {
        label: 'Rechazado',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: XCircle,
      },
      CANCELLED: {
        label: 'Cancelado',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: XCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs.DRAFT;
  };

  // Permisos según rol (modo gestión)
  const statusConfig = getStatusConfig(event.status);
  const StatusIcon = statusConfig.icon;
  const canEdit = managementMode && (userRole === 'ADMIN' || event.status !== 'PUBLISHED');
  const canApprove = managementMode && userRole === 'ADMIN' && event.status === 'DRAFT';
  const canDelete = managementMode && userRole === 'ADMIN';
  const canAddCompetition = managementMode && event.status === 'PUBLISHED';
  const canToggleFeatured = managementMode && userRole === 'ADMIN';

  // Renderizar imagen o placeholder
  const renderImage = () => {
    if (mainImage && !imageError) {
      return (
        <Image
          src={mainImage}
          alt={event.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
          <Mountain className="h-20 w-20 text-gray-300" />
        </div>
      );
    }
  };

  // Modo simplificado: solo imagen + logo
  if (simplified) {
    const simplifiedContent = (
      <div className="group relative overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md bg-white border-gray-200 h-48">
        <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
          {renderImage()}

          {/* Overlay Gradient */}
          {mainImage && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          )}

          {/* Logo Overlay */}
          {logoImage && !logoError && (
            <div className="absolute bottom-3 left-3 bg-white rounded-lg p-2 shadow-lg z-10">
              <div className="relative w-12 h-12">
                <Image
                  src={logoImage}
                  alt={`${event.name} logo`}
                  fill
                  className="object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {(event.isFeatured || event.featured) && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            </div>
          )}

          {/* Typical Month Badge */}
          {event.typicalMonth && (
            <div className="absolute bottom-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-none text-xs font-semibold shadow-lg z-10">
              {MONTHS[event.typicalMonth - 1]}
            </div>
          )}
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-hover/0 transition-colors group-hover:bg-hover/5 pointer-events-none" />
      </div>
    );

    // Envolver en Link
    return (
      <Link href={`/events/${event.slug}`} className="block">
        {simplifiedContent}
      </Link>
    );
  }

  const content = (
<div className={`group relative overflow-hidden rounded-lg border text-card-foreground shadow-sm transition-all hover:shadow-md ${
      managementMode ? statusConfig.borderColor + ' bg-white' : 'bg-white border-gray-200'
    } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${viewMode === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col h-full'}`}>

    {/* Checkbox de selección (esquina superior izquierda) */}
      {managementMode && onSelect && (
        <div className="absolute top-3 left-3 z-20">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 text-blue-600 border-2 border-white bg-white/90 backdrop-blur-sm rounded 
                     focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer 
                     shadow-lg hover:scale-110 transition-transform"
          />
        </div>
      )}
      
      {/* Image Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 ${
        viewMode === 'list' ? 'w-full md:w-64 h-48 flex-shrink-0' : 'w-full h-48'
      }`}>
        {renderImage()}

        {/* Overlay Gradient (solo si hay imagen) */}
        {mainImage && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        )}

        {/* Logo Overlay */}
        {logoImage && !logoError && (
          <div className="absolute bottom-3 left-3 bg-white rounded-lg p-2 shadow-lg z-10">
            <div className="relative w-12 h-12">
              <Image
                src={logoImage}
                alt={`${event.name} logo`}
                fill
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          </div>
        )}

        {/* Top Right Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          {/* Featured Badge */}
          {(event.isFeatured || event.featured) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
              <Star className="h-3 w-3 fill-current" />
              Featured
            </span>
          )}
          
          {/* Status Badge (management mode) */}
          {managementMode && (
            <span className={`inline-flex items-center gap-1 rounded-none px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg ${
              event.status === 'PUBLISHED' ? 'bg-gray-800' :
              event.status === 'DRAFT' ? 'bg-gray-800' :
              event.status === 'REJECTED' ? 'bg-gray-800' :
              'bg-gray-800'
            }`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </span>
          )}
        </div>

      {/* Gallery Indicator */}
        {hasGallery && !managementMode && (
          <div className="absolute top-2 left-2 bg-gray-800 backdrop-blur-sm text-white px-2 py-1 rounded-none text-xs flex items-center gap-1 z-10">
            <ImageIcon className="h-3 w-3" />
            {event.gallery.length}
          </div>
        )}

        {/* Typical Month Badge */}
        {event.typicalMonth && (
          <div className="absolute bottom-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-none text-xs font-semibold shadow-lg z-10">
            {MONTHS[event.typicalMonth - 1]}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-4 flex flex-col ${viewMode === 'list' ? 'flex-1' : 'flex-1'}`}>
        {/* Title */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold group-hover:text-hover transition-colors flex-1 ${
            viewMode === 'list' ? 'text-xl' : 'text-lg line-clamp-2'
          }`}>
            {event.name}
          </h3>
          {managementMode && (event.isFeatured || event.featured) && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0 ml-2" />
          )}
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {COUNTRY_FLAGS[event.country] || '🌍'} {event.city}, {event.country}
          </span>
        </div>

        {/* Description */}
        {event.description && (
          <p className={`mb-3 text-sm text-gray-600 ${
            viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'
          } flex-1`}>
            {event.description}
          </p>
        )}

        {/* Rejection reason (management mode) */}
        {managementMode && event.status === 'REJECTED' && event.rejectionReason && (
          <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
            <strong>Motivo:</strong> {event.rejectionReason}
          </div>
        )}

        {/* Admin notes (management mode) */}
        {managementMode && userRole === 'ADMIN' && event.adminNotes && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
            <strong>Notas admin:</strong> {event.adminNotes}
          </div>
        )}

        {/* Stats Footer */}
        {showStats && (
          <div className={`pt-3 border-t border-gray-100 space-y-2 ${managementMode ? 'mb-0' : ''}`}>
            <div className={`flex items-center text-xs text-gray-500 ${
              viewMode === 'list' ? 'flex-wrap gap-4' : 'justify-between'
            }`}>
              {/* Left side stats */}
              <div className="flex items-center gap-3">
                {event.firstEditionYear && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Since {event.firstEditionYear}</span>
                  </div>
                )}
                
                {event.website && (
                  <div className="flex items-center gap-1 text-hover">
                    <Globe className="h-3 w-3" />
                    <span>Website</span>
                  </div>
                )}
              </div>

              {/* Right side - views */}
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{0} views</span>
              </div>
            </div>

            {/* Competitions count */}
            {competitionCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-hover font-medium">
                  <Mountain className="h-4 w-4" />
                  <span>{competitionCount} {competitionCount === 1 ? 'race' : 'races'}</span>
                </div>
                {!managementMode && (
                  <span className="text-xs text-gray-500 group-hover:text-hover transition-colors">
                    View details →
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ✅ NUEVA SECCIÓN: Redes Sociales */}
        {hasSocialLinks && (
          <div className="pt-3 mt-auto">
            <div className="flex items-center gap-2 justify-center">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white hover:scale-110 transition-transform shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white hover:scale-110 transition-transform shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}

              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:scale-110 transition-transform shadow-sm"
                  title="Twitter / X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}

              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white hover:scale-110 transition-transform shadow-sm"
                  title="YouTube"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions bar (management mode) */}
      {managementMode && (
        <div className="p-3 bg-gray-50 border-t flex flex-wrap gap-2">
          {/* Ver (siempre disponible) */}
          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="h-4 w-4" />
            Ver
          </Link>

          {/* Editar */}
          {canEdit && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>
          )}

          {/* Agregar competición */}
          {canAddCompetition && onAddCompetition && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddCompetition(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Competición
            </button>
          )}

          {/* Aprobar (admin, si draft) */}
          {canApprove && onApprove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Aprobar
            </button>
          )}

          {/* Rechazar (admin, si draft) */}
          {canApprove && onReject && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-4 w-4" />
              Rechazar
            </button>
          )}

          {/* Toggle Featured (admin) */}
          {canToggleFeatured && onToggleFeatured && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeatured(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Star className={`h-4 w-4 ${(event.isFeatured || event.featured) ? 'fill-yellow-500' : ''}`} />
              {(event.isFeatured || event.featured) ? 'Quitar' : 'Destacar'}
            </button>
          )}

          {/* Eliminar (admin, al final) */}
          {canDelete && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors ml-auto"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          )}
        </div>
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 bg-hover/0 transition-colors group-hover:bg-hover/5 pointer-events-none" />
    </div>
  );

  // Si hay onClick y NO está en modo gestión con acciones, envolver en button
  if (onClick && !managementMode) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  // Si NO está en modo gestión, envolver en Link
  if (!managementMode) {
    return (
      <Link href={`/events/${event.slug}`} className="block">
        {content}
      </Link>
    );
  }

  // En modo gestión, devolver solo el content (las acciones tienen sus propios handlers)
  return content;
}
