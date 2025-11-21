// components/PostForm.tsx - Form for creating/editing posts

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from './RichTextEditor';
import { postsService, eventsService, competitionsService, editionsService } from '@/lib/api/v2';
import {
  PostCategory,
  Language,
  POST_CATEGORY_LABELS,
  LANGUAGE_LABELS,
  CreatePostInput,
  UpdatePostInput,
  Post,
} from '@/types/v2';
import { Loader2, Save, Eye } from 'lucide-react';

interface PostFormProps {
  post?: Post;
  mode: 'create' | 'edit';
}

export function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');
  const [category, setCategory] = useState<PostCategory>(post?.category || PostCategory.GENERAL);
  const [language, setLanguage] = useState<Language>(post?.language || Language.ES);
  const [eventId, setEventId] = useState(post?.eventId || '');
  const [competitionId, setCompetitionId] = useState(post?.competitionId || '');
  const [editionId, setEditionId] = useState(post?.editionId || '');
  const [scheduledPublishAt, setScheduledPublishAt] = useState(
    post?.scheduledPublishAt ? new Date(post.scheduledPublishAt).toISOString().slice(0, 16) : ''
  );

  // Options for selects
  const [events, setEvents] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [editions, setEditions] = useState<any[]>([]);

  useEffect(() => {
    loadRelatedOptions();
  }, []);

  const loadRelatedOptions = async () => {
    try {
      // Load events, competitions, editions for selects
      const [eventsRes, competitionsRes, editionsRes] = await Promise.all([
        eventsService.getAll({ limit: 100, sortBy: 'name' }),
        competitionsService.getAll({ limit: 100, sortBy: 'name' }),
        editionsService.getAll({ limit: 100, sortBy: 'startDate', sortOrder: 'desc' }),
      ]);

      setEvents(eventsRes.data || []);
      setCompetitions(competitionsRes.data || []);
      setEditions(editionsRes.data || []);
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();

    if (!title || !content || !category || !language) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data: CreatePostInput | UpdatePostInput = {
        title,
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || undefined,
        category,
        language,
        eventId: eventId || undefined,
        competitionId: competitionId || undefined,
        editionId: editionId || undefined,
        scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt).toISOString() : undefined,
      };

      if (mode === 'create') {
        const created = await postsService.create(data as CreatePostInput);
        router.push(`/magazine/${category.toLowerCase()}/${created.slug}`);
      } else if (post) {
        const updated = await postsService.update(post.id, data as UpdatePostInput);
        router.push(`/magazine/${category.toLowerCase()}/${updated.slug}`);
      }
    } catch (err: any) {
      console.error('Error saving post:', err);
      setError(err.message || 'Error al guardar el artículo');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Información Básica</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Título del artículo"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resumen/Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Breve descripción del artículo"
            rows={3}
          />
        </div>

        {/* Category and Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              {Object.entries(POST_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma *
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold mb-4">Contenido *</h2>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      {/* Media */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Imagen Destacada</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de la Imagen Destacada
          </label>
          <input
            type="url"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {featuredImage && (
            <div className="mt-2">
              <img
                src={featuredImage}
                alt="Preview"
                className="max-w-xs rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '';
                  e.currentTarget.alt = 'Error al cargar imagen';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">SEO</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Si está vacío, se usará el título del artículo"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Si está vacío, se usará el excerpt"
            rows={2}
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 caracteres</p>
        </div>
      </div>

      {/* Related Content */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Contenido Relacionado (Opcional)</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evento Relacionado
          </label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Ninguno</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Competición Relacionada
          </label>
          <select
            value={competitionId}
            onChange={(e) => setCompetitionId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Ninguna</option>
            {competitions.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edición Relacionada
          </label>
          <select
            value={editionId}
            onChange={(e) => setEditionId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Ninguna</option>
            {editions.map((edition: any) => (
              <option key={edition.id} value={edition.id}>
                {edition.competition?.name} - {edition.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scheduled Publishing */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Publicación Programada (Opcional)</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha y hora de publicación
          </label>
          <input
            type="datetime-local"
            value={scheduledPublishAt}
            onChange={(e) => setScheduledPublishAt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si se establece, el artículo se publicará automáticamente en esta fecha (solo para ADMIN)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>

        <div className="flex items-center gap-4">
          {post && (
            <button
              type="button"
              onClick={() =>
                router.push(`/magazine/${category.toLowerCase()}/${post.slug}`)
              }
              className="px-6 py-2 text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <Eye className="h-4 w-4" />
              Vista Previa
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === 'create' ? 'Crear Artículo' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
