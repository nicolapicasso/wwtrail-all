// app/organizer/organizers/new/page.tsx
// Página para crear nuevo organizador

'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import OrganizerForm from '@/components/forms/OrganizerForm';

export default function NewOrganizerPage() {
  const router = useRouter();
  const t = useTranslations('boCatalog');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('back')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('createNewOrganizer')}</h1>
          <p className="mt-2 text-gray-600">
            {t('createOrganizerSubtitle')}
          </p>
        </div>

        {/* Form */}
        <OrganizerForm mode="create" />
      </div>
    </div>
  );
}
