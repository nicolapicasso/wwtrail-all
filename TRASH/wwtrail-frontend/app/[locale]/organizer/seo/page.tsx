'use client';

import { useState, useEffect, useMemo } from 'react';
import { seoService, type SEO } from '@/lib/api/seo.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Minus,
  Clock,
  CheckCircle2,
  Search,
  Globe,
  FileText,
  Flag,
  Award,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Grouped SEO structure
interface GroupedSEO {
  entityType: string;
  entityId: string;
  slug: string | null;
  entityName: string;
  languages: SEO[];
}

export default function SEOManagementPage() {
  const [allSEO, setAllSEO] = useState<SEO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSEO, setEditingSEO] = useState<SEO | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAllSEO();
  }, []);

  const loadAllSEO = async () => {
    try {
      setLoading(true);

      // Load SEO for all entity types in parallel
      const [events, competitions, posts] = await Promise.all([
        seoService.listSEO('event', 1, 1000),
        seoService.listSEO('competition', 1, 1000),
        seoService.listSEO('post', 1, 1000),
      ]);

      const allData = [
        ...events.data,
        ...competitions.data,
        ...posts.data,
      ];

      setAllSEO(allData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar SEO',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Group SEO by entity (entityType + entityId/slug)
  const groupedSEO = useMemo(() => {
    const groups = new Map<string, GroupedSEO>();

    allSEO.forEach((seo) => {
      const key = `${seo.entityType}-${seo.entityId || seo.slug}`;

      if (!groups.has(key)) {
        groups.set(key, {
          entityType: seo.entityType,
          entityId: seo.entityId || '',
          slug: seo.slug,
          entityName: seo.metaTitle?.split('|')[0]?.trim() || seo.slug || seo.entityId || 'Sin nombre',
          languages: [],
        });
      }

      groups.get(key)!.languages.push(seo);
    });

    return Array.from(groups.values());
  }, [allSEO]);

  // Filter by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedSEO;

    const query = searchQuery.toLowerCase();
    return groupedSEO.filter((group) =>
      group.entityName.toLowerCase().includes(query) ||
      group.slug?.toLowerCase().includes(query) ||
      group.entityId.toLowerCase().includes(query)
    );
  }, [groupedSEO, searchQuery]);

  // Group by entity type
  const groupedByType = useMemo(() => {
    const byType: Record<string, GroupedSEO[]> = {
      event: [],
      competition: [],
      post: [],
    };

    filteredGroups.forEach((group) => {
      if (byType[group.entityType]) {
        byType[group.entityType].push(group);
      }
    });

    return byType;
  }, [filteredGroups]);

  const handleEdit = (seo: SEO) => {
    setEditingSEO({ ...seo });
  };

  const handleSave = async () => {
    if (!editingSEO) return;

    try {
      await seoService.updateSEO(editingSEO.id, {
        metaTitle: editingSEO.metaTitle,
        metaDescription: editingSEO.metaDescription,
        llmFaq: editingSEO.llmFaq,
      });

      toast({
        title: '✅ Guardado',
        description: 'SEO actualizado correctamente',
      });

      setEditingSEO(null);
      await loadAllSEO();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este SEO?')) return;

    try {
      await seoService.deleteSEO(id);
      toast({
        title: '✅ Eliminado',
        description: 'SEO eliminado correctamente',
      });
      await loadAllSEO();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar',
        variant: 'destructive',
      });
    }
  };

  const handleRegenerate = async (seo: SEO) => {
    if (!confirm('¿Regenerar SEO? Esto eliminará el contenido actual y generará uno nuevo con IA.'))
      return;

    try {
      setRegenerating(seo.id);

      toast({
        title: '⏳ Regenerando...',
        description: 'El SEO se está regenerando con IA. Esto puede tardar unos segundos...',
      });

      await seoService.regenerateSEO({
        entityType: seo.entityType,
        entityId: seo.entityId,
        slug: seo.slug,
      } as any);

      toast({
        title: '✅ Regenerado',
        description: 'El SEO ha sido regenerado exitosamente',
      });

      await loadAllSEO();
      setRegenerating(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al regenerar SEO',
        variant: 'destructive',
      });
      setRegenerating(null);
    }
  };

  const addFAQItem = () => {
    if (!editingSEO) return;
    setEditingSEO({
      ...editingSEO,
      llmFaq: [...(editingSEO.llmFaq || []), { question: '', answer: '' }],
    });
  };

  const removeFAQItem = (index: number) => {
    if (!editingSEO) return;
    setEditingSEO({
      ...editingSEO,
      llmFaq: editingSEO.llmFaq?.filter((_, i) => i !== index),
    });
  };

  const updateFAQItem = (index: number, field: 'question' | 'answer', value: string) => {
    if (!editingSEO) return;
    setEditingSEO({
      ...editingSEO,
      llmFaq: editingSEO.llmFaq?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'event':
        return <Award className="h-4 w-4" />;
      case 'competition':
        return <Flag className="h-4 w-4" />;
      case 'post':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getEntityLabel = (entityType: string) => {
    switch (entityType) {
      case 'event':
        return 'Eventos';
      case 'competition':
        return 'Competiciones';
      case 'post':
        return 'Posts';
      default:
        return entityType;
    }
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      ES: 'Español',
      EN: 'English',
      IT: 'Italiano',
      CA: 'Català',
      FR: 'Français',
      DE: 'Deutsch',
    };
    return labels[lang.toUpperCase()] || lang;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 Gestión de SEO</h1>
        <p className="text-muted-foreground">
          Administra el SEO de eventos, competiciones y posts. Agrupado por entidad con todos los idiomas.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, slug o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : allSEO.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center text-muted-foreground">
              No hay SEO generado aún
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="event" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Eventos
              <Badge variant="secondary" className="ml-1">{groupedByType.event.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Competiciones
              <Badge variant="secondary" className="ml-1">{groupedByType.competition.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
              <Badge variant="secondary" className="ml-1">{groupedByType.post.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {(['event', 'competition', 'post'] as const).map((entityType) => {
            const groups = groupedByType[entityType];

            return (
              <TabsContent key={entityType} value={entityType} className="mt-6">
                {groups.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center text-muted-foreground">
                        No hay SEO generado para {getEntityLabel(entityType).toLowerCase()}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {groups.map((group) => (
                      <Card key={`${group.entityType}-${group.entityId || group.slug}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{group.entityName}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {group.slug || group.entityId}
                              </CardDescription>
                            </div>
                            <Badge variant="outline">
                              <Globe className="h-3 w-3 mr-1" />
                              {group.languages.length} idiomas
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Idioma</TableHead>
                                <TableHead>Meta Title</TableHead>
                                <TableHead>FAQ</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.languages.map((seo) => (
                                <TableRow key={seo.id}>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {getLanguageLabel(seo.language)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-medium max-w-xs truncate">
                                    {seo.metaTitle || '-'}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{seo.llmFaq?.length || 0} preguntas</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {seo.autoGenerated ? (
                                      <Badge variant="outline">
                                        <Clock className="mr-1 h-3 w-3" />
                                        Auto
                                      </Badge>
                                    ) : (
                                      <Badge>
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Manual
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(seo)}
                                        title="Editar"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRegenerate(seo)}
                                        disabled={regenerating === seo.id}
                                        title="Regenerar con IA"
                                      >
                                        {regenerating === seo.id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <RefreshCw className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(seo.id)}
                                        title="Eliminar"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Dialog de Edición */}
      <Dialog open={!!editingSEO} onOpenChange={(open) => !open && setEditingSEO(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar SEO</DialogTitle>
            <DialogDescription>
              Modifica el meta title, meta description y las preguntas frecuentes
            </DialogDescription>
          </DialogHeader>

          {editingSEO && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={editingSEO.metaTitle || ''}
                  onChange={(e) =>
                    setEditingSEO({ ...editingSEO, metaTitle: e.target.value })
                  }
                  placeholder="Título SEO..."
                />
                <p className="text-xs text-muted-foreground">
                  {editingSEO.metaTitle?.length || 0} / 60 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={editingSEO.metaDescription || ''}
                  onChange={(e) =>
                    setEditingSEO({ ...editingSEO, metaDescription: e.target.value })
                  }
                  placeholder="Descripción SEO..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {editingSEO.metaDescription?.length || 0} / 155 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Preguntas Frecuentes (FAQ)</Label>
                  <Button variant="outline" size="sm" onClick={addFAQItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir
                  </Button>
                </div>

                {editingSEO.llmFaq?.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label className="text-xs">Pregunta {index + 1}</Label>
                            <Input
                              value={item.question}
                              onChange={(e) =>
                                updateFAQItem(index, 'question', e.target.value)
                              }
                              placeholder="¿Cuándo es el evento?"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Respuesta {index + 1}</Label>
                            <Textarea
                              value={item.answer}
                              onChange={(e) =>
                                updateFAQItem(index, 'answer', e.target.value)
                              }
                              placeholder="El evento se celebra el..."
                              rows={2}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFAQItem(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!editingSEO.llmFaq || editingSEO.llmFaq.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay preguntas. Haz click en "Añadir" para crear una.
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSEO(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
