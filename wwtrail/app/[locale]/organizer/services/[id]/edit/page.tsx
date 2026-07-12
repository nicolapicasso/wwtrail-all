// app/organizer/services/[id]/edit/page.tsx - Edit service page

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { servicesService } from '@/lib/api/v2';
import { Service } from '@/types/v2';
import ServiceForm from '@/components/forms/ServiceForm';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GenerateTranslationsButton } from '@/components/GenerateTranslationsButton';

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('boCatalog');
  const { user, loading } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceId = params?.id as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user && serviceId) {
      fetchService();
    }
  }, [user, loading, serviceId, router]);

  const fetchService = async () => {
    try {
      const response = await servicesService.getById(serviceId);
      const fetchedService = response.data;

      // Verify ownership
      if (user && fetchedService.organizerId !== user.id && user.role !== 'ADMIN') {
        setError(t('noPermissionEditService'));
        return;
      }

      setService(fetchedService);
    } catch (err: any) {
      console.error('Error fetching service:', err);
      setError(err.response?.data?.message || t('errorLoadingService'));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error || t('serviceNotFound')}</p>
          <button
            onClick={() => router.push('/organizer/services')}
            className="text-blue-600 hover:underline"
          >
            {t('backToMyServices')}
          </button>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/organizer/services"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('backToMyServices')}
            </Link>
            <div className="flex items-center gap-2">
              <GenerateTranslationsButton
                entityType="service"
                entityId={serviceId}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/organizer/seo')}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {t('manageSeo')}
              </Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('editService')}</h1>
          <p className="mt-2 text-gray-600">
            {t('editServiceSubtitle')}
          </p>
        </div>

        <ServiceForm mode="edit" initialData={service} serviceId={serviceId} />
      </div>
    </div>
  );
}
