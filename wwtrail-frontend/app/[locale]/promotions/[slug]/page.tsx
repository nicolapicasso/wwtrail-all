'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { promotionsService } from '@/lib/api/v2';
import { Promotion } from '@/types/v2';
import Image from 'next/image';
import { Gift, Lock, Globe, MapPin, ExternalLink, Calendar, Eye } from 'lucide-react';

export default function PromotionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coupon redemption
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState('');

  useEffect(() => {
    if (slug) {
      loadPromotion();
    }
  }, [slug]);

  const loadPromotion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionsService.getByIdOrSlug(slug);
      setPromotion(response.data);
    } catch (err: any) {
      console.error('Error loading promotion:', err);
      setError(err.message || 'Error al cargar la promoción');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotion) return;

    try {
      setRedeeming(true);
      const response = await promotionsService.redeemCoupon(promotion.id, {
        userName,
        userEmail,
      });

      setRedeemedCode(response.data.code);
      setRedemptionSuccess(true);
      setShowRedeemForm(false);
    } catch (err: any) {
      alert(err.message || 'Error al canjear el cupón');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Promoción no encontrada'}</p>
          <button
            onClick={() => router.push('/promotions')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ver todas las promociones
          </button>
        </div>
      </div>
    );
  }

  const isCoupon = promotion.type === 'COUPON';
  const isExclusive = promotion.type === 'EXCLUSIVE_CONTENT';
  const requiresLogin = isExclusive && !user && promotion.requiresLogin;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Cover Image */}
          {promotion.coverImage && (
            <div className="relative h-96 bg-gray-200">
              <Image
                src={promotion.coverImage}
                alt={promotion.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Type Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                isCoupon ? 'bg-blue-500 text-white' : 'bg-[#B66916] text-white'
              }`}>
                {isCoupon ? '🎟️ Cupón' : '🔒 Contenido Exclusivo'}
              </span>
              {promotion.featured && (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-400 text-gray-900">
                  ⭐ Destacado
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{promotion.title}</h1>

            <p className="text-lg text-gray-600 mb-6">{promotion.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              {promotion.category && (
                <div className="flex items-center gap-2">
                  <span>{promotion.category.icon}</span>
                  <span>{promotion.category.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {promotion.isGlobal ? (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Global</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>{promotion.countries?.length || 0} países</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{promotion.viewCount} vistas</span>
              </div>
            </div>

            {/* Brand URL */}
            {promotion.brandUrl && (
              <a
                href={promotion.brandUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6"
              >
                <span>Visitar sitio web</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Gallery */}
        {promotion.gallery && promotion.gallery.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {promotion.gallery.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupon Section */}
        {isCoupon && !redemptionSuccess && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <Gift className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Obtener Cupón</h2>

              {promotion.couponStats && (
                <p className="text-gray-600 mb-6">
                  {promotion.couponStats.available} de {promotion.couponStats.total} cupones disponibles
                </p>
              )}

              {!showRedeemForm ? (
                <button
                  onClick={() => setShowRedeemForm(true)}
                  disabled={!promotion.couponStats || promotion.couponStats.available === 0}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {promotion.couponStats && promotion.couponStats.available === 0
                    ? 'Cupones Agotados'
                    : 'Solicitar Cupón'}
                </button>
              ) : (
                <form onSubmit={handleRedeemCoupon} className="max-w-md mx-auto">
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tu Nombre *
                      </label>
                      <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Tu Email *
                      </label>
                      <input
                        id="userEmail"
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRedeemForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      disabled={redeeming}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={redeeming}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {redeeming ? 'Canjeando...' : 'Canjear Cupón'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Redemption Success */}
        {redemptionSuccess && redeemedCode && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg shadow-lg p-8 mb-8 text-center">
            <div className="text-green-600 mb-4">
              <Gift className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cupón Obtenido!</h2>
            <p className="text-gray-600 mb-6">
              Hemos enviado tu cupón a {userEmail}
            </p>
            <div className="bg-white border-2 border-dashed border-green-500 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">Tu código de cupón:</p>
              <p className="text-3xl font-bold text-green-600 font-mono">{redeemedCode}</p>
            </div>
            {promotion.brandUrl && (
              <a
                href={promotion.brandUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <span>Usar Cupón Ahora</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>
        )}

        {/* Exclusive Content Section */}
        {isExclusive && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {requiresLogin ? (
              <div className="text-center py-8">
                <Lock className="h-16 w-16 text-[#B66916] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contenido Exclusivo</h2>
                <p className="text-gray-600 mb-6">
                  Debes iniciar sesión para ver este contenido exclusivo
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => router.push(`/auth/login?redirect=/promotions/${slug}`)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => router.push(`/auth/register?redirect=/promotions/${slug}`)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6 text-[#B66916]" />
                  Contenido Exclusivo
                </h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: promotion.exclusiveContent || '' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
