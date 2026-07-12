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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('boMisc');

  const [bulkGenerating, setBulkGenerating] = useState<string | null>(null);
  const [bulkResult, setBulkResult] = useState<any>(null);

  const handleBulkGenerate = async (entityType: string) => {
    try {
      setBulkGenerating(entityType);
      setBulkResult(null);
      const response = await fetch('/api/v2/seo/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType }),
      });
      const json = await response.json();
      const result = json.data || json;
      setBulkResult(result);
      toast({
        title: t('seoGenerationCompleted'),
        description: t('seoSeosGeneratedFor', { count: result.generated || 0, entityType }),
      });
      loadAllSEO();
    } catch (error: any) {
      toast({
        title: t('seoError'),
        description: error.message || t('seoErrorGenerating'),
        variant: 'destructive',
      });
    } finally {
      setBulkGenerating(null);
    }
  };

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
        title: t('seoError'),
        description: error.message || t('seoErrorLoading'),
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
          slug: seo.slug ?? null,
          entityName: seo.metaTitle?.split('|')[0]?.trim() || seo.slug || seo.entityId || t('seoNoName'),
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
        title: t('seoSavedTitle'),
        description: t('seoUpdatedSuccess'),
      });

      setEditingSEO(null);
      await loadAllSEO();
    } catch (error: any) {
      toast({
        title: t('seoError'),
        description: error.message || t('seoErrorSaving'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('seoConfirmDelete'))) return;

    try {
      await seoService.deleteSEO(id);
      toast({
        title: t('seoDeletedTitle'),
        description: t('seoDeletedSuccess'),
      });
      await loadAllSEO();
    } catch (error: any) {
      toast({
        title: t('seoError'),
        description: error.message || t('seoErrorDeleting'),
        variant: 'destructive',
      });
    }
  };

  const handleRegenerate = async (seo: SEO) => {
    if (!confirm(t('seoConfirmRegenerate')))
      return;

    try {
      setRegenerating(seo.id);

      toast({
        title: t('seoRegeneratingTitle'),
        description: t('seoRegeneratingDesc'),
      });

      await seoService.regenerateSEO({
        entityType: seo.entityType,
        entityId: seo.entityId,
        slug: seo.slug,
      } as any);

      toast({
        title: t('seoRegeneratedTitle'),
        description: t('seoRegeneratedSuccess'),
      });

      await loadAllSEO();
      setRegenerating(null);
    } catch (error: any) {
      toast({
        title: t('seoError'),
        description: error.message || t('seoErrorRegenerating'),
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
        return t('seoEventos');
      case 'competition':
        return t('seoCompeticiones');
      case 'post':
        return t('seoPosts');
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('seoTitle')}</h1>
          <p className="text-muted-foreground">
            {t('seoSubtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          {['event', 'competition'].map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              disabled={bulkGenerating !== null}
              onClick={() => handleBulkGenerate(type)}
            >
              {bulkGenerating === type ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              {t('seoGenerateEntity', { entity: type === 'event' ? t('seoEventos') : t('seoCompeticiones') })}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('seoSearchPlaceholder')}
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
          <CardHeader>
            <CardTitle>{t('seoNoSeoYet')}</CardTitle>
            <CardDescription>
              {t('seoNoSeoDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { type: 'event', label: t('seoEventos'), icon: <Award className="h-5 w-5" /> },
                { type: 'competition', label: t('seoCompeticiones'), icon: <Flag className="h-5 w-5" /> },
                { type: 'service', label: t('seoServicios'), icon: <Globe className="h-5 w-5" /> },
                { type: 'specialSeries', label: t('seoSeriesEspeciales'), icon: <FileText className="h-5 w-5" /> },
              ].map(({ type, label, icon }) => (
                <Button
                  key={type}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  disabled={bulkGenerating !== null}
                  onClick={() => handleBulkGenerate(type)}
                >
                  {bulkGenerating === type ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : icon}
                  <span>{t('seoGenerateSeoOf', { label })}</span>
                </Button>
              ))}
            </div>
            {bulkResult && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <p className="font-medium text-green-800">
                  {t('seoBulkResult', { generated: bulkResult.generated, errors: bulkResult.errors, total: bulkResult.total })}
                </p>
              </div>
            )}
            {bulkGenerating && (
              <p className="mt-4 text-sm text-muted-foreground text-center">
                {t('seoGeneratingLong')}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="event" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              {t('seoEventos')}
              <Badge variant="secondary" className="ml-1">{groupedByType.event.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              {t('seoCompeticiones')}
              <Badge variant="secondary" className="ml-1">{groupedByType.competition.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('seoPosts')}
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
                        {t('seoNoSeoForEntity', { entity: getEntityLabel(entityType).toLowerCase() })}
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
                              {t('seoLanguagesCount', { count: group.languages.length })}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">{t('seoIdioma')}</TableHead>
                                <TableHead>{t('seoMetaTitle')}</TableHead>
                                <TableHead>{t('seoFaq')}</TableHead>
                                <TableHead>{t('seoEstado')}</TableHead>
                                <TableHead className="text-right">{t('seoAcciones')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.languages.map((seo) => (
                                <TableRow key={seo.id}>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {getLanguageLabel((seo as any).language)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-medium max-w-xs truncate">
                                    {seo.metaTitle || '-'}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{t('seoQuestionsCount', { count: seo.llmFaq?.length || 0 })}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {seo.autoGenerated ? (
                                      <Badge variant="outline">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {t('seoAuto')}
                                      </Badge>
                                    ) : (
                                      <Badge>
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        {t('seoManual')}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(seo)}
                                        title={t('editar')}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRegenerate(seo)}
                                        disabled={regenerating === seo.id}
                                        title={t('seoRegenerateWithAi')}
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
                                        title={t('eliminar')}
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
            <DialogTitle>{t('seoEditSeo')}</DialogTitle>
            <DialogDescription>
              {t('seoEditSeoDesc')}
            </DialogDescription>
          </DialogHeader>

          {editingSEO && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">{t('seoMetaTitle')}</Label>
                <Input
                  id="meta-title"
                  value={editingSEO.metaTitle || ''}
                  onChange={(e) =>
                    setEditingSEO({ ...editingSEO, metaTitle: e.target.value })
                  }
                  placeholder={t('seoTitlePlaceholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('seoCharsOf60', { count: editingSEO.metaTitle?.length || 0 })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">{t('seoMetaDescription')}</Label>
                <Textarea
                  id="meta-description"
                  value={editingSEO.metaDescription || ''}
                  onChange={(e) =>
                    setEditingSEO({ ...editingSEO, metaDescription: e.target.value })
                  }
                  placeholder={t('seoDescPlaceholder')}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {t('seoCharsOf155', { count: editingSEO.metaDescription?.length || 0 })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t('seoFaqLabel')}</Label>
                  <Button variant="outline" size="sm" onClick={addFAQItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t('seoAnadir')}
                  </Button>
                </div>

                {editingSEO.llmFaq?.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label className="text-xs">{t('seoQuestionN', { n: index + 1 })}</Label>
                            <Input
                              value={item.question}
                              onChange={(e) =>
                                updateFAQItem(index, 'question', e.target.value)
                              }
                              placeholder={t('seoQuestionPlaceholder')}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t('seoAnswerN', { n: index + 1 })}</Label>
                            <Textarea
                              value={item.answer}
                              onChange={(e) =>
                                updateFAQItem(index, 'answer', e.target.value)
                              }
                              placeholder={t('seoAnswerPlaceholder')}
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
                    {t('seoNoQuestions')}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSEO(null)}>
              {t('cancelar')}
            </Button>
            <Button onClick={handleSave}>{t('seoGuardarCambios')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
