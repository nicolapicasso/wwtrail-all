'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { landingService, Landing } from '@/lib/api/landing.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Globe,
  Calendar,
  Eye
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function LandingsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [landings, setLandings] = useState<Landing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    loadLandings();
  }, [page, search]);

  const loadLandings = async () => {
    try {
      setLoading(true);
      const response = await landingService.getAll({
        page,
        limit: 20,
        search: search || undefined,
      });
      setLandings(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar las landings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${title}"?`)) {
      return;
    }

    try {
      await landingService.delete(id);
      toast({
        title: '✅ Eliminado',
        description: 'Landing eliminada correctamente',
      });
      loadLandings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || (loading && landings.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">📄 Landings</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las páginas landing personalizadas
          </p>
        </div>
        <Link href="/admin/landings/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Landing
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por título..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Landings List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : landings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {search ? 'No se encontraron resultados' : 'No hay landings creadas'}
            </p>
            <Link href="/admin/landings/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear primera landing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {landings.map((landing) => (
            <Card key={landing.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{landing.title}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {landing.language}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>/page/{landing.slug}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(landing.createdAt).toLocaleDateString()}</span>
                      </div>
                      {landing.translations && landing.translations.length > 0 && (
                        <span className="text-green-600">
                          {landing.translations.length} traducción(es)
                        </span>
                      )}
                    </div>

                    {landing.metaDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {landing.metaDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/page/${landing.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/landings/${landing.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(landing.id, landing.title)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
