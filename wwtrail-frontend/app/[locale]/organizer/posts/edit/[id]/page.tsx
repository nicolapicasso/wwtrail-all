'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostForm } from '@/components/PostForm';
import { postsService } from '@/lib/api/v2';
import { Post } from '@/types/v2';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsService.getById(id);
      setPost(data);
    } catch (err: any) {
      console.error('Error loading post:', err);
      setError(err.message || 'Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-muted-foreground">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ {error || 'Artículo no encontrado'}</h1>
          <Link href="/organizer/posts">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Volver a Mis Artículos
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/organizer/posts"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mis Artículos
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/organizer/seo')}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Gestionar SEO
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Editar Artículo</h1>
          <p className="text-muted-foreground">
            Edita el artículo &quot;{post.title}&quot;
          </p>
        </div>

        {/* Form */}
        <PostForm post={post} mode="edit" />
      </div>
    </div>
  );
}
