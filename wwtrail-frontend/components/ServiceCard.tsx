// components/ServiceCard.tsx - Card for services (alojamientos, restaurantes, etc.)

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Service } from '@/types/v2';
import {
  MapPin, Eye, Edit, Trash2, Star,
  Image as ImageIcon, Tag
} from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  showStats?: boolean;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
  // Props para modo gestión
  managementMode?: boolean;
  userRole?: 'ADMIN' | 'ORGANIZER' | 'ATHLETE';
  onEdit?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
  onToggleFeatured?: (serviceId: string) => void;
}

const COUNTRY_FLAGS: { [key: string]: string } = {
  'ES': '🇪🇸', 'FR': '🇫🇷', 'IT': '🇮🇹', 'CH': '🇨🇭',
  'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'AT': '🇦🇹',
  'PT': '🇵🇹', 'CA': '🇨🇦', 'NL': '🇳🇱', 'BE': '🇧🇪',
};

export default function ServiceCard({
  service,
  showStats = true,
  onClick,
  viewMode = 'grid',
  managementMode = false,
  userRole = 'ATHLETE',
  onEdit,
  onDelete,
  onToggleFeatured,
}: ServiceCardProps) {

  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const mainImage = service.coverImage || null;
  const logoImage = service.logoUrl || null;
  const hasGallery = service.gallery && service.gallery.length > 0;

  // Render main image or placeholder
  const renderImage = () => {
    if (mainImage && !imageError) {
      return (
        <Image
          src={mainImage}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
      );
    }

    // Placeholder with service category
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-2" />
          {service.category && (
            <p className="text-xs text-gray-500 font-semibold uppercase">
              {service.category.icon} {service.category.name}
            </p>
          )}
        </div>
      </div>
    );
  };

  const content = (
    <div className={`group relative overflow-hidden rounded-lg border bg-white text-card-foreground shadow-sm transition-all hover:shadow-md ${
      viewMode === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col h-full'
    }`}>

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
                alt={`${service.name} logo`}
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
          {service.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
              <Star className="h-3 w-3 fill-current" />
              Destacado
            </span>
          )}

          {/* Status Badge (management mode) */}
          {managementMode && (
            <span className={`inline-flex items-center gap-1 rounded-none px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg ${
              service.status === 'PUBLISHED' ? 'bg-gray-800' :
              service.status === 'DRAFT' ? 'bg-gray-800' :
              'bg-gray-800'
            }`}>
              {service.status === 'PUBLISHED' ? 'Publicado' :
               service.status === 'DRAFT' ? 'Borrador' :
               service.status}
            </span>
          )}
        </div>

        {/* Gallery Indicator */}
        {hasGallery && !managementMode && (
          <div className="absolute top-2 left-2 bg-gray-800 backdrop-blur-sm text-white px-2 py-1 rounded-none text-xs flex items-center gap-1 z-10">
            <ImageIcon className="h-3 w-3" />
            {service.gallery!.length}
          </div>
        )}

        {/* Category Badge */}
        {service.category && (
          <div className="absolute bottom-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-none text-xs font-semibold shadow-lg z-10 flex items-center gap-1">
            <span>{service.category.icon}</span>
            <span>{service.category.name}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-4 flex flex-col ${viewMode === 'list' ? 'flex-1' : 'flex-1'}`}>
        {/* Title */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold group-hover:text-blue-600 transition-colors flex-1 ${
            viewMode === 'list' ? 'text-xl' : 'text-lg line-clamp-2'
          }`}>
            {service.name}
          </h3>
          {managementMode && service.featured && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0 ml-2" />
          )}
        </div>

        {/* Description */}
        {service.description && (
          <p className={`text-sm text-muted-foreground mb-3 ${
            viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'
          }`}>
            {service.description}
          </p>
        )}

        {/* Location & Stats */}
        <div className="mt-auto space-y-2">
          {/* Location */}
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>
              {COUNTRY_FLAGS[service.country] || service.country}{' '}
              {service.city}
            </span>
          </div>

          {/* Stats */}
          {showStats && !managementMode && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{service.viewCount || 0}</span>
              </div>
            </div>
          )}

          {/* Management Actions */}
          {managementMode && (userRole === 'ADMIN' || userRole === 'ORGANIZER') && (
            <div className="flex items-center gap-2 pt-2 border-t">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(service.id);
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
              )}

              {userRole === 'ADMIN' && onToggleFeatured && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFeatured(service.id);
                  }}
                  className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
                >
                  <Star className="h-4 w-4" />
                  {service.featured ? 'Quitar destacado' : 'Destacar'}
                </button>
              )}

              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
                      onDelete(service.id);
                    }
                  }}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Si hay onClick o es managementMode, envolver en Link
  if (!managementMode && service.slug) {
    return (
      <Link href={`/services/${service.slug}`} className="block">
        {content}
      </Link>
    );
  }

  // Modo gestión o sin slug
  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      {content}
    </div>
  );
}
