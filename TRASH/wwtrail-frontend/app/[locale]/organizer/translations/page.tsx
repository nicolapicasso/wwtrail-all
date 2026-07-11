'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Languages,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Trophy,
  FileText,
  Briefcase,
  Tag,
  Star,
  Play,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import translationsService from '@/lib/api/v2/translations.service';

interface EntityStats {
  total: number;
  withTranslations: number;
  missingTranslations: number;
}

interface TranslationStats {
  events: EntityStats;
  competitions: EntityStats;
  posts: EntityStats;
  services: EntityStats;
  promotions: EntityStats;
  specialSeries: EntityStats;
}

type EntityType = 'event' | 'competition' | 'post' | 'service' | 'promotion' | 'specialSeries';

interface EntityConfig {
  key: EntityType;
  label: string;
  icon: React.ElementType;
  color: string;
}

const ENTITY_CONFIGS: EntityConfig[] = [
  { key: 'event', label: 'Eventos', icon: Calendar, color: 'text-blue-600' },
  { key: 'competition', label: 'Competiciones', icon: Trophy, color: 'text-green-600' },
  { key: 'post', label: 'Artículos', icon: FileText, color: 'text-purple-600' },
  { key: 'service', label: 'Servicios', icon: Briefcase, color: 'text-orange-600' },
  { key: 'promotion', label: 'Promociones', icon: Tag, color: 'text-pink-600' },
  { key: 'specialSeries', label: 'Series Especiales', icon: Star, color: 'text-yellow-600' },
];

export default function TranslationsDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translatingEntity, setTranslatingEntity] = useState<EntityType | null>(null);
  const [translatingAll, setTranslatingAll] = useState(false);
  const [lastTranslationResult, setLastTranslationResult] = useState<string | null>(null);

  // Check auth
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/organizer');
    }
  }, [user, authLoading, router]);

  // Load stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await translationsService.getStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Error loading translation stats:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslateEntity = async (entityType: EntityType) => {
    try {
      setTranslatingEntity(entityType);
      setLastTranslationResult(null);
      const result = await translationsService.bulkTranslate(entityType);
      setLastTranslationResult(`${result.data.translated} elementos traducidos`);
      await loadStats(); // Refresh stats
    } catch (err: any) {
      console.error('Error translating:', err);
      setLastTranslationResult(`Error: ${err.message}`);
    } finally {
      setTranslatingEntity(null);
    }
  };

  const handleTranslateAll = async () => {
    try {
      setTranslatingAll(true);
      setLastTranslationResult(null);
      const results = await translationsService.bulkTranslateAll();
      const totalTranslated = results.reduce((acc, r) => acc + (r.data?.translated || 0), 0);
      setLastTranslationResult(`Total: ${totalTranslated} elementos traducidos`);
      await loadStats(); // Refresh stats
    } catch (err: any) {
      console.error('Error translating all:', err);
      setLastTranslationResult(`Error: ${err.message}`);
    } finally {
      setTranslatingAll(false);
    }
  };

  const getProgressPercentage = (entityStats: EntityStats) => {
    if (entityStats.total === 0) return 100;
    return Math.round((entityStats.withTranslations / entityStats.total) * 100);
  };

  const getTotalStats = () => {
    if (!stats) return { total: 0, withTranslations: 0, missingTranslations: 0 };
    return {
      total: Object.values(stats).reduce((acc, s) => acc + s.total, 0),
      withTranslations: Object.values(stats).reduce((acc, s) => acc + s.withTranslations, 0),
      missingTranslations: Object.values(stats).reduce((acc, s) => acc + s.missingTranslations, 0),
    };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const totalStats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Languages className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Traducciones</h1>
                <p className="text-gray-600">Gestiona las traducciones automáticas con IA</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadStats}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                onClick={handleTranslateAll}
                disabled={translatingAll || totalStats.missingTranslations === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {translatingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traduciendo...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Traducir Todo ({totalStats.missingTranslations} pendientes)
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Last result message */}
          {lastTranslationResult && (
            <div className={`p-3 rounded-lg mb-4 ${
              lastTranslationResult.startsWith('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {lastTranslationResult.startsWith('Error') ? (
                <AlertCircle className="h-4 w-4 inline mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 inline mr-2" />
              )}
              {lastTranslationResult}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumen General</CardTitle>
            <CardDescription>Estado global de traducciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900">{totalStats.total}</div>
                <div className="text-sm text-gray-600">Total elementos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{totalStats.withTranslations}</div>
                <div className="text-sm text-gray-600">Con traducciones</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{totalStats.missingTranslations}</div>
                <div className="text-sm text-gray-600">Sin traducciones</div>
              </div>
            </div>
            {totalStats.total > 0 && (
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Progreso total</span>
                  <span className="text-sm font-medium">{getProgressPercentage(totalStats)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(totalStats)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Entity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats && ENTITY_CONFIGS.map((config) => {
            const entityStats = stats[config.key === 'event' ? 'events' :
                                       config.key === 'competition' ? 'competitions' :
                                       config.key === 'post' ? 'posts' :
                                       config.key === 'service' ? 'services' :
                                       config.key === 'promotion' ? 'promotions' :
                                       'specialSeries'];
            const Icon = config.icon;
            const progress = getProgressPercentage(entityStats);
            const isTranslating = translatingEntity === config.key;

            return (
              <Card key={config.key} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <CardTitle className="text-lg">{config.label}</CardTitle>
                    </div>
                    <span className={`text-sm font-medium ${
                      progress === 100 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {progress}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">{entityStats.total}</div>
                        <div className="text-gray-500 text-xs">Total</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{entityStats.withTranslations}</div>
                        <div className="text-gray-500 text-xs">Traducidos</div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-600">{entityStats.missingTranslations}</div>
                        <div className="text-gray-500 text-xs">Pendientes</div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleTranslateEntity(config.key)}
                      disabled={isTranslating || entityStats.missingTranslations === 0}
                    >
                      {isTranslating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Traduciendo...
                        </>
                      ) : entityStats.missingTranslations === 0 ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Completo
                        </>
                      ) : (
                        <>
                          <Languages className="h-4 w-4 mr-2" />
                          Traducir pendientes ({entityStats.missingTranslations})
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Acerca de las traducciones</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>Las traducciones se generan automáticamente usando IA (OpenAI GPT-4o-mini)</li>
            <li>Se traducen del idioma base de cada contenido a: EN, ES, FR, IT, DE, CA</li>
            <li>Solo se traducen los elementos que no tienen traducciones previas</li>
            <li>Las traducciones se aplican a: nombre, descripción, y otros campos de texto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
