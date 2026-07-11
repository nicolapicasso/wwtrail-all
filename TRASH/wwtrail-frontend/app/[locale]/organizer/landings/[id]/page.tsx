'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { landingService, Landing } from '@/lib/api/landing.service';
import LandingForm from '@/components/forms/LandingForm';
import { ArrowLeft, Loader2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Language } from '@/types/v2';

const ALL_LANGUAGES: Language[] = ['ES', 'EN', 'IT', 'CA', 'FR', 'DE'];

export default function EditLandingPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [landing, setLanding] = useState<Landing | null>(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    loadLanding();
  }, [params.id]);

  const loadLanding = async () => {
    try {
      setLoading(true);
      const data = await landingService.getById(params.id);
      setLanding(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cargar la landing',
        variant: 'destructive',
      });
      router.push('/organizer/landings');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTranslate = async () => {
    if (!landing) return;

    // Get existing translations
    const existingLanguages = landing.translations?.map((t) => t.language) || [];
    const missingLanguages = ALL_LANGUAGES.filter(
      (lang) => lang !== landing.language && !existingLanguages.includes(lang)
    );

    if (missingLanguages.length === 0) {
      toast({
        title: 'Info',
        description: 'Ya existen traducciones para todos los idiomas',
      });
      return;
    }

    if (!confirm(`¿Traducir automáticamente a ${missingLanguages.join(', ')}?`)) {
      return;
    }

    try {
      setTranslating(true);
      await landingService.translate(landing.id, missingLanguages, false);
      toast({
        title: '✅ Traducido',
        description: `Landing traducida a ${missingLanguages.length} idioma(s)`,
      });
      loadLanding(); // Reload to show translations
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al traducir',
        variant: 'destructive',
      });
    } finally {
      setTranslating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'ADMIN' || !landing) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">✏️ Editar Landing</h1>
            <p className="text-muted-foreground mt-1">{landing.title}</p>
          </div>
          <Button
            onClick={handleAutoTranslate}
            disabled={translating}
            variant="outline"
          >
            {translating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traduciendo...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Auto-traducir
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6">
          <LandingForm
            landing={landing}
            onSuccess={() => router.push('/organizer/landings')}
          />
        </div>

        {/* Translations Status */}
        {landing.translations && landing.translations.length > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">
              Traducciones disponibles:
            </h3>
            <div className="flex flex-wrap gap-2">
              {landing.translations.map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {t.language}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
