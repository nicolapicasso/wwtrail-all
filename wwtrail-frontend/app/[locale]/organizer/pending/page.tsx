'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Flag,
  Calendar,
  MapPin,
  Building2,
  FileText,
  Clock,
  User,
  ExternalLink,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { adminService, PendingContentCounts, PendingContentItem } from '@/lib/api/admin.service';

export default function PendingContentPage() {
  const router = useRouter();
  const locale = useLocale();

  const [counts, setCounts] = useState<PendingContentCounts | null>(null);
  const [items, setItems] = useState<PendingContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [countsData, itemsData] = await Promise.all([
        adminService.getPendingContentCounts(),
        adminService.getPendingContent(),
      ]);
      setCounts(countsData);
      setItems(itemsData);
    } catch (err: any) {
      console.error('Error fetching pending content:', err);
      setError('Error al cargar el contenido pendiente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'competition':
        return <Flag className="w-5 h-5 text-blue-500" />;
      case 'edition':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'event':
        return <MapPin className="w-5 h-5 text-green-500" />;
      case 'service':
        return <Building2 className="w-5 h-5 text-orange-500" />;
      case 'magazine':
        return <FileText className="w-5 h-5 text-pink-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'competition':
        return 'Competición';
      case 'edition':
        return 'Edición';
      case 'event':
        return 'Evento';
      case 'service':
        return 'Servicio';
      case 'magazine':
        return 'Artículo';
      default:
        return type;
    }
  };

  const getReviewLink = (item: PendingContentItem) => {
    switch (item.type) {
      case 'competition':
        return `/${locale}/organizer/competitions/edit/${item.id}`;
      case 'edition':
        return `/${locale}/organizer/editions/edit/${item.id}`;
      case 'event':
        return `/${locale}/organizer/events/edit/${item.id}`;
      case 'service':
        return `/${locale}/organizer/services/edit/${item.id}`;
      case 'magazine':
        return `/${locale}/organizer/posts/edit/${item.id}`;
      default:
        return '#';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            Contenido Pendiente de Revisión
          </h1>
          <p className="text-gray-600 mt-1">
            Revisa y aprueba el contenido enviado por los organizadores
          </p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {counts && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className={counts.total > 0 ? 'border-red-200 bg-red-50' : ''}>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${counts.total > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                <p className={`text-2xl font-bold ${counts.total > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {counts.total}
                </p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Flag className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{counts.competitions}</p>
                <p className="text-sm text-gray-500">Competiciones</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{counts.editions}</p>
                <p className="text-sm text-gray-500">Ediciones</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{counts.events}</p>
                <p className="text-sm text-gray-500">Eventos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{counts.services}</p>
                <p className="text-sm text-gray-500">Servicios</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                <p className="text-2xl font-bold">{counts.magazines}</p>
                <p className="text-sm text-gray-500">Artículos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Items List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Todo al día
            </h3>
            <p className="text-gray-500">
              No hay contenido pendiente de revisión
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Elementos Pendientes ({items.length})</CardTitle>
            <CardDescription>
              Haz clic en un elemento para revisarlo y aprobarlo o rechazarlo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="py-4 flex items-center justify-between hover:bg-gray-50 -mx-6 px-6 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                            {getTypeLabel(item.type)}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.createdAt)}
                        </span>
                        {item.createdBy && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.createdBy.username}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={getReviewLink(item)}>
                    <Button variant="outline" size="sm">
                      Revisar
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
