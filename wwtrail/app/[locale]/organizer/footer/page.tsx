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
import { useTranslations } from 'next-intl';

const LANGUAGES = [
  { code: 'ES', label: '🇪🇸 Español' },
  { code: 'EN', label: '🇬🇧 English' },
  { code: 'IT', label: '🇮🇹 Italiano' },
  { code: 'CA', label: '🏴 Català' },
  { code: 'FR', label: '🇫🇷 Français' },
  { code: 'DE', label: '🇩🇪 Deutsch' },
];

export default function FooterAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('boMisc');

  const COLUMNS = [
    { key: 'left', label: t('footerColumnLeft') },
    { key: 'center', label: t('footerColumnCenter') },
    { key: 'right', label: t('footerColumnRight') },
  ];

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
        title: t('footerError'),
        description: error.message || t('footerErrorLoading'),
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
        title: t('footerSavedTitle'),
        description: t('footerSavedSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('footerError'),
        description: error.message || t('footerErrorSaving'),
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
        <h1 className="text-3xl font-bold mb-2">⚙️ {t('footerTitle')}</h1>
        <p className="text-muted-foreground">
          {t('footerSubtitle')}
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
                    {t('footerHtmlContentFor', { lang: lang.label })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor={`${column.key}-${lang.code}`}>
                      {t('footerHtmlContent')}
                    </Label>
                    <textarea
                      id={`${column.key}-${lang.code}`}
                      value={getColumnValue(column.key, lang.code)}
                      onChange={(e) =>
                        updateColumn(column.key, lang.code, e.target.value)
                      }
                      rows={12}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder={t('footerHtmlPlaceholder')}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('footerHtmlHint')}
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
              {t('guardando')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('footerGuardarConfiguracion')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
