// app/directory/page.tsx - Dynamic import wrapper (no SSR)
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

export default async function DirectoryPage() {
  const t = await getTranslations('pgContent');

  const DirectoryMapClient = dynamic(() => import('./DirectoryMapClient'), {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingMap')}</p>
        </div>
      </div>
    ),
  });

  return <DirectoryMapClient />;
}
