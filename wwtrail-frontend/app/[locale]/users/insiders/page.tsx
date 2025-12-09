'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, User, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { userService } from '@/lib/api/user.service';
import { COUNTRIES } from '@/lib/utils/countries';

interface InsiderData {
  config: {
    badgeUrl: string | null;
    introTextES: string | null;
    introTextEN: string | null;
    introTextIT: string | null;
    introTextCA: string | null;
    introTextFR: string | null;
    introTextDE: string | null;
  } | null;
  insiders: Array<{
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
    country: string | null;
    city: string | null;
    bio: string | null;
  }>;
  stats: {
    total: number;
    byCountry: Record<string, number>;
  };
}

export default function InsidersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  const [data, setData] = useState<InsiderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await userService.getPublicInsiders();
        setData(result);
      } catch (err: any) {
        console.error('Error fetching insiders:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIntroText = () => {
    if (!data?.config) return null;

    const textMap: Record<string, string | null> = {
      es: data.config.introTextES,
      en: data.config.introTextEN,
      it: data.config.introTextIT,
      ca: data.config.introTextCA,
      fr: data.config.introTextFR,
      de: data.config.introTextDE,
    };

    // Return text for current locale, or fallback to Spanish, or any available text
    return textMap[locale] || textMap['es'] || Object.values(textMap).find(t => t) || null;
  };

  const getCountryName = (code: string) => {
    const country = COUNTRIES.find((c) => c.code === code);
    return country?.name || code;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const introText = getIntroText();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - 150px height */}
      <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white h-[150px] flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6">
            {/* Badge */}
            <div className="shrink-0">
              {data?.config?.badgeUrl ? (
                <Image
                  src={data.config.badgeUrl}
                  alt="WWTrail Insider"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white fill-white" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">WWTrail Insiders</h1>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{data?.stats?.total || 0} Insiders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{Object.keys(data?.stats?.byCountry || {}).length} Países</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Intro Text */}
        {introText && (
          <div className="max-w-3xl mx-auto mb-12">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {introText}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Insiders Grid */}
        {data?.insiders && data.insiders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.insiders.map((insider) => (
              <Link
                key={insider.id}
                href={`/users/${insider.username}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {/* Avatar with badge */}
                      <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                          {insider.avatar ? (
                            <Image
                              src={insider.avatar}
                              alt={insider.fullName}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                        </div>
                        {/* Insider badge overlay */}
                        {data.config?.badgeUrl && (
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 z-10">
                            <Image
                              src={data.config.badgeUrl}
                              alt="Insider"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#B66916] transition-colors">
                        {insider.fullName}
                      </h3>

                      {/* Username */}
                      <p className="text-sm text-gray-500 mb-2">@{insider.username}</p>

                      {/* Location */}
                      {(insider.city || insider.country) && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {[insider.city, insider.country && getCountryName(insider.country)]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}

                      {/* Bio preview */}
                      {insider.bio && (
                        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                          {insider.bio}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Próximamente
            </h2>
            <p className="text-gray-600">
              Pronto conocerás a nuestros corresponsales especiales de trail running
            </p>
          </div>
        )}

        {/* Country Distribution */}
        {data?.stats?.byCountry && Object.keys(data.stats.byCountry).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Insiders por País
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(data.stats.byCountry)
                .sort((a, b) => b[1] - a[1])
                .map(([code, count]) => (
                  <div
                    key={code}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border"
                  >
                    <span className="font-medium text-gray-700">{getCountryName(code)}</span>
                    <span className="text-sm text-gray-500">({count})</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
