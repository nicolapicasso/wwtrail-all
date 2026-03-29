// app/directory/page.tsx - Dynamic import wrapper (no SSR)
import dynamic from 'next/dynamic';

const DirectoryMapClient = dynamic(() => import('./DirectoryMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function DirectoryPage() {
  return <DirectoryMapClient />;
}
