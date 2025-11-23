'use client';

import { useState, useEffect } from 'react';
import { seoService, type SEOConfig } from '@/lib/api/seo.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Settings, FileText, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function SEOConfigPage() {
  const [configs, setConfigs] = useState<SEOConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await seoService.listConfigs();
      setConfigs(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar configuraciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config: SEOConfig) => {
    try {
      setSaving(config.entityType);
      await seoService.upsertConfig({
        entityType: config.entityType,
        metaTitleTemplate: config.metaTitleTemplate,
        metaDescriptionTemplate: config.metaDescriptionTemplate,
        qaPrompt: config.qaPrompt,
        availableVariables: config.availableVariables,
        autoGenerate: config.autoGenerate,
        generateOnCreate: config.generateOnCreate,
        generateOnUpdate: config.generateOnUpdate,
      });

      toast({
        title: '✅ Guardado',
        description: `Configuración de ${config.entityType} actualizada correctamente`,
      });

      await loadConfigs();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const updateConfig = (entityType: string, field: string, value: any) => {
    setConfigs((prev) =>
      prev.map((c) => (c.entityType === entityType ? { ...c, [field]: value } : c))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const entityTypes = [
    { value: 'event', label: 'Eventos', icon: '🏃' },
    { value: 'competition', label: 'Competiciones', icon: '🏔️' },
    { value: 'post', label: 'Posts', icon: '📝' },
    { value: 'home', label: 'Página Principal', icon: '🏠' },
    { value: 'events-list', label: 'Listado Eventos', icon: '📋' },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">⚙️ Configuración SEO</h1>
        <p className="text-muted-foreground">
          Configura templates, prompts y opciones de auto-generación para cada tipo de contenido
        </p>
      </div>

      <Tabs defaultValue="event" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {entityTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.icon} {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {entityTypes.map((type) => {
          const config = configs.find((c) => c.entityType === type.value);
          if (!config) return null;

          return (
            <TabsContent key={type.value} value={type.value} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración General
                  </CardTitle>
                  <CardDescription>
                    Controla cómo y cuándo se genera SEO automáticamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={`auto-${type.value}`}>Auto-generar SEO</Label>
                      <p className="text-sm text-muted-foreground">
                        Activar generación automática de SEO
                      </p>
                    </div>
                    <Switch
                      id={`auto-${type.value}`}
                      checked={config.autoGenerate}
                      onCheckedChange={(checked) =>
                        updateConfig(type.value, 'autoGenerate', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={`onCreate-${type.value}`}>Generar al crear</Label>
                      <p className="text-sm text-muted-foreground">
                        Generar SEO automáticamente al crear nueva entidad
                      </p>
                    </div>
                    <Switch
                      id={`onCreate-${type.value}`}
                      checked={config.generateOnCreate}
                      onCheckedChange={(checked) =>
                        updateConfig(type.value, 'generateOnCreate', checked)
                      }
                      disabled={!config.autoGenerate}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={`onUpdate-${type.value}`}>Generar al actualizar</Label>
                      <p className="text-sm text-muted-foreground">
                        Regenerar SEO automáticamente al actualizar entidad
                      </p>
                    </div>
                    <Switch
                      id={`onUpdate-${type.value}`}
                      checked={config.generateOnUpdate}
                      onCheckedChange={(checked) =>
                        updateConfig(type.value, 'generateOnUpdate', checked)
                      }
                      disabled={!config.autoGenerate}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Templates de Meta Tags
                  </CardTitle>
                  <CardDescription>
                    Usa variables como {'{name}'}, {'{location}'}, {'{distance}'}, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${type.value}`}>Meta Title Template</Label>
                    <Input
                      id={`title-${type.value}`}
                      value={config.metaTitleTemplate || ''}
                      onChange={(e) =>
                        updateConfig(type.value, 'metaTitleTemplate', e.target.value)
                      }
                      placeholder="{name} - Trail Running | WWTrail"
                    />
                    <p className="text-xs text-muted-foreground">
                      Máximo recomendado: 60 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`desc-${type.value}`}>Meta Description Template</Label>
                    <Textarea
                      id={`desc-${type.value}`}
                      value={config.metaDescriptionTemplate || ''}
                      onChange={(e) =>
                        updateConfig(type.value, 'metaDescriptionTemplate', e.target.value)
                      }
                      placeholder="{description} en {location}"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Máximo recomendado: 155 caracteres
                    </p>
                  </div>

                  <div>
                    <Label className="mb-2">Variables disponibles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {config.availableVariables?.map((variable: string) => (
                        <Badge key={variable} variant="secondary">
                          {`{${variable}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Prompt para Q&A (IA)
                  </CardTitle>
                  <CardDescription>
                    Personaliza el prompt que se envía a GPT-4o-mini para generar las preguntas y
                    respuestas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`prompt-${type.value}`}>Prompt Template</Label>
                    <Textarea
                      id={`prompt-${type.value}`}
                      value={config.qaPrompt || ''}
                      onChange={(e) => updateConfig(type.value, 'qaPrompt', e.target.value)}
                      placeholder="Genera 5 preguntas sobre {name}..."
                      rows={15}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      El sistema generará exactamente 5 preguntas y respuestas optimizadas para
                      LLMs
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave(config)}
                  disabled={saving === type.value}
                  size="lg"
                >
                  {saving === type.value ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Configuración
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
