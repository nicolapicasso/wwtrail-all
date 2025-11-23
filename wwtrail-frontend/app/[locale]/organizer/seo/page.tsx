'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Minus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function SEOManagementPage() {
  const [entityType, setEntityType] = useState('event');
  const [seoList, setSeoList] = useState<SEO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSEO, setEditingSEO] = useState<SEO | null>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSEO();
  }, [entityType, page]);

  const loadSEO = async () => {
    try {
      setLoading(true);
      const response = await seoService.listSEO(entityType, page, 20);
      setSeoList(response.data);
      setTotalPages(response.meta.totalPages);
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
      await loadSEO();
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
      await loadSEO();
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

      // Llamar al endpoint de regeneración
      await seoService.regenerateSEO({
        entityType: seo.entityType,
        entityId: seo.entityId,
        slug: seo.slug,
      } as any);

      toast({
        title: '✅ Regenerado',
        description: 'El SEO ha sido regenerado exitosamente',
      });

      await loadSEO();
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

  const entityTypes = [
    { value: 'event', label: 'Eventos' },
    { value: 'competition', label: 'Competiciones' },
    { value: 'post', label: 'Posts' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔍 Gestión de SEO</h1>
        <p className="text-muted-foreground">
          Administra el SEO de eventos, competiciones y posts
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listado de SEO</CardTitle>
              <CardDescription>Visualiza y edita el SEO generado para cada entidad</CardDescription>
            </div>
            <Select value={entityType} onValueChange={(value) => { setEntityType(value); setPage(1); }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {entityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : seoList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay SEO generado para este tipo de entidad
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meta Title</TableHead>
                    <TableHead>Meta Description</TableHead>
                    <TableHead>FAQ</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Regeneración</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seoList.map((seo) => (
                    <TableRow key={seo.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {seo.metaTitle || '-'}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {seo.metaDescription || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{seo.llmFaq?.length || 0} preguntas</Badge>
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
                      <TableCell className="text-sm text-muted-foreground">
                        {seo.lastRegenerated
                          ? format(new Date(seo.lastRegenerated), 'dd/MM/yyyy HH:mm')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(seo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRegenerate(seo)}
                            disabled={regenerating === seo.id}
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

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
