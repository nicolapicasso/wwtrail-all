import Link from 'next/link';
import Image from 'next/image';
import { Promotion } from '@/types/v2';
import { Gift, Lock, Globe, MapPin } from 'lucide-react';

interface PromotionCardProps {
  promotion: Promotion;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function PromotionCard({ promotion, showActions = false, onEdit, onDelete }: PromotionCardProps) {
  const isCoupon = promotion.type === 'COUPON';
  const isExclusive = promotion.type === 'EXCLUSIVE_CONTENT';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Cover Image */}
      <Link href={`/promotions/${promotion.slug}`} className="block relative h-48 bg-gray-200">
        {promotion.coverImage ? (
          <Image
            src={promotion.coverImage}
            alt={promotion.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
            {isCoupon ? (
              <Gift className="h-16 w-16 text-green-600" />
            ) : (
              <Lock className="h-16 w-16 text-green-600" />
            )}
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isCoupon
              ? 'bg-blue-500 text-white'
              : 'bg-purple-500 text-white'
          }`}>
            {isCoupon ? '🎟️ Cupón' : '🔒 Exclusivo'}
          </span>
        </div>

        {/* Featured Badge */}
        {promotion.featured && (
          <div className="absolute top-2 right-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900">
              ⭐ Destacado
            </span>
          </div>
        )}

        {/* Status Badge */}
        {promotion.status !== 'PUBLISHED' && (
          <div className="absolute bottom-2 right-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              promotion.status === 'DRAFT'
                ? 'bg-gray-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {promotion.status === 'DRAFT' ? 'Borrador' : 'Archivado'}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/promotions/${promotion.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-green-600 mb-2 line-clamp-2">
            {promotion.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {promotion.description}
        </p>

        {/* Category */}
        {promotion.category && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <span>{promotion.category.icon}</span>
            <span>{promotion.category.name}</span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          {promotion.isGlobal ? (
            <>
              <Globe className="h-3 w-3" />
              <span>Global</span>
            </>
          ) : (
            <>
              <MapPin className="h-3 w-3" />
              <span>{promotion.countries?.length || 0} países</span>
            </>
          )}
        </div>

        {/* Coupon Stats */}
        {isCoupon && promotion.couponStats && (
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Disponibles:</span>
              <span className="font-bold text-blue-600">
                {promotion.couponStats.available}/{promotion.couponStats.total}
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${(promotion.couponStats.available / promotion.couponStats.total) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && onEdit && onDelete && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <button
              onClick={() => onEdit(promotion.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(promotion.id)}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        )}

        {/* CTA */}
        {!showActions && (
          <Link
            href={`/promotions/${promotion.slug}`}
            className="block w-full mt-3 px-4 py-2 text-center text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            {isCoupon ? 'Obtener Cupón' : 'Ver Contenido'}
          </Link>
        )}
      </div>
    </div>
  );
}
