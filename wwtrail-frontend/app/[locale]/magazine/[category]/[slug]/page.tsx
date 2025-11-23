'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Eye, Globe, Share2 } from 'lucide-react';
import { postsService } from '@/lib/api/v2';
import { Post, POST_CATEGORY_LABELS, LANGUAGE_LABELS } from '@/types/v2';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const category = params.category as string;
  const locale = params.locale as string; // ✅ Get current locale

  const [article, setArticle] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug, locale]); // ✅ Reload when locale changes

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const post = await postsService.getBySlug(slug);

      // ✅ Apply translations if available
      const translation = (post as any).translations?.find((t: any) => t.language === locale?.toUpperCase());
      if (translation) {
        post.title = translation.title || post.title;
        post.excerpt = translation.excerpt || post.excerpt;
        post.content = translation.content || post.content;
      }

      console.log('Article loaded:', {
        title: post.title,
        locale,
        hasTranslation: !!translation
      });
      setArticle(post);
    } catch (err: any) {
      console.error('Error loading article:', err);
      setError(err.message || 'Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ {error || 'Artículo no encontrado'}</h1>
          <Link href={`/magazine/${category}`}>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Volver a {category}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date(article.createdAt).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  // Author name
  const authorName = article.author
    ? article.author.firstName && article.author.lastName
      ? `${article.author.firstName} ${article.author.lastName}`
      : article.author.username
    : 'Anónimo';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Featured Image */}
      {article.featuredImage && !imageError && (
        <div className="relative w-full h-[400px] md:h-[500px] bg-black">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover opacity-90"
            priority
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/magazine/${category}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a {POST_CATEGORY_LABELS[article.category]}
          </Link>

          {/* Article Header */}
          <article className="bg-white rounded-lg border p-8 mb-8">
            {/* Category and Language Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
                {POST_CATEGORY_LABELS[article.category]}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium">
                <Globe className="h-3 w-3 mr-1" />
                {LANGUAGE_LABELS[article.language]}
              </span>
              {article.status === 'DRAFT' && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-xs font-semibold">
                  Borrador
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
              {article.viewCount > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.viewCount.toLocaleString()} vistas</span>
                </div>
              )}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.excerpt || '',
                      url: window.location.href,
                    });
                  }
                }}
                className="flex items-center gap-2 ml-auto text-green-600 hover:text-green-700"
              >
                <Share2 className="h-4 w-4" />
                <span>Compartir</span>
              </button>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Gallery */}
            {article.images && article.images.length > 0 && (
              <div className="mt-12 mb-8">
                <h3 className="text-2xl font-bold mb-6">Galería</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {article.images.map((image, index) => (
                    <div key={image.id} className="relative group overflow-hidden rounded-lg">
                      <Image
                        src={image.imageUrl}
                        alt={image.caption || `Imagen ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <p className="text-white text-sm">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Event/Competition/Edition */}
            {(article.event || article.competition || article.edition) && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold mb-3">Relacionado con:</h3>
                {article.event && (
                  <div className="mb-2">
                    <Link
                      href={`/events/${article.event.slug}`}
                      className="text-green-600 hover:text-green-700 hover:underline font-medium"
                    >
                      📍 {article.event.name} ({article.event.city}, {article.event.country})
                    </Link>
                  </div>
                )}
                {article.competition && (
                  <div className="mb-2">
                    <Link
                      href={`/competitions/${article.competition.slug}`}
                      className="text-green-600 hover:text-green-700 hover:underline font-medium"
                    >
                      🏃 {article.competition.name} - {article.competition.type}
                    </Link>
                  </div>
                )}
                {article.edition && (
                  <div className="mb-2">
                    <Link
                      href={`/editions/${article.edition.slug}`}
                      className="text-green-600 hover:text-green-700 hover:underline font-medium"
                    >
                      📅 Edición {article.edition.year} - {new Date(article.edition.startDate).toLocaleDateString('es-ES')}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-sm"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
