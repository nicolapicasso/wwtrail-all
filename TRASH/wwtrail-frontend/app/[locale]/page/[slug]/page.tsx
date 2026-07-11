import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { landingService } from '@/lib/api/landing.service';

interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const landing = await landingService.getBySlug(params.slug, params.locale.toUpperCase() as any);

    return {
      title: landing.metaTitle || landing.title,
      description: landing.metaDescription || landing.title,
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}

export default async function LandingPage({ params }: PageProps) {
  let landing;

  try {
    landing = await landingService.getBySlug(params.slug, params.locale.toUpperCase() as any);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      {landing.coverImage && (
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src={landing.coverImage}
            alt={landing.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
              {landing.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {!landing.coverImage && (
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
              {landing.title}
            </h1>
          )}

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none mb-12 prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-ul:text-gray-700 prose-ol:text-gray-700 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: landing.content }}
          />

          {/* Gallery */}
          {landing.gallery && landing.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Galería</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {landing.gallery.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${landing.title} - Imagen ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
