'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { footerService, Footer } from '@/lib/api/footer.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LANGUAGES = [
  { code: 'ES', label: '🇪🇸 Español' },
  { code: 'EN', label: '🇬🇧 English' },
  { code: 'IT', label: '🇮🇹 Italiano' },
  { code: 'CA', label: '🏴 Català' },
  { code: 'FR', label: '🇫🇷 Français' },
  { code: 'DE', label: '🇩🇪 Deutsch' },
];

const COLUMNS = [
  { key: 'left', label: 'Columna Izquierda (1/4)' },
  { key: 'center', label: 'Columna Central (2/4)' },
  { key: 'right', label: 'Columna Derecha (1/4)' },
];

export default function FooterAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [footer, setFooter] = useState<Footer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    try {
      setLoading(true);
      const data = await footerService.getFooter();
      setFooter(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar la configuración del footer',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!footer) return;

    try {
      setSaving(true);
      await footerService.updateFooter(footer);
      toast({
        title: '✅ Guardado',
        description: 'Configuración del footer actualizada correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateColumn = (column: string, language: string, value: string) => {
    if (!footer) return;
    const fieldName = `${column}Column${language}` as keyof Footer;
    setFooter({ ...footer, [fieldName]: value });
  };

  const getColumnValue = (column: string, language: string): string => {
    if (!footer) return '';
    const fieldName = `${column}Column${language}` as keyof Footer;
    return (footer[fieldName] as string) || '';
  };

  if (authLoading || loading) {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">⚙️ Configuración del Footer</h1>
        <p className="text-muted-foreground">
          Gestiona el contenido del footer en todos los idiomas. Usa HTML para personalizar el contenido.
        </p>
      </div>

      <Tabs defaultValue="ES" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code}>
              {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code} className="space-y-4">
            {COLUMNS.map((column) => (
              <Card key={column.key}>
                <CardHeader>
                  <CardTitle>{column.label}</CardTitle>
                  <CardDescription>
                    Contenido HTML para {lang.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`${column.key}-${lang.code}`}>
                      HTML Content
                    </Label>
                    <textarea
                      id={`${column.key}-${lang.code}`}
                      value={getColumnValue(column.key, lang.code)}
                      onChange={(e) =>
                        updateColumn(column.key, lang.code, e.target.value)
                      }
                      rows={12}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder={`<div>\n  <h3>Título</h3>\n  <p>Contenido...</p>\n  <a href="#">Enlace</a>\n</div>`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Puedes usar HTML: &lt;h3&gt;, &lt;p&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;img&gt;, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="min-w-[200px]"
        >
          {saving ? (
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
    </div>
  );
}
