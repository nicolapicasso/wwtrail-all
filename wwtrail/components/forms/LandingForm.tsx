'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Landing, landingService, CreateLandingInput, UpdateLandingInput } from '@/lib/api/landing.service';
import { Language } from '@/types/v2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Upload, X, Plus, Loader2, Save } from 'lucide-react';
import { uploadFile } from '@/lib/api/files.service';
import { useToast } from '@/components/ui/use-toast';

interface LandingFormProps {
  landing?: Landing;
  onSuccess?: () => void;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'ES', label: 'Español' },
  { value: 'EN', label: 'English' },
  { value: 'IT', label: 'Italiano' },
  { value: 'CA', label: 'Català' },
  { value: 'FR', label: 'Français' },
  { value: 'DE', label: 'Deutsch' },
];

export default function LandingForm({ landing, onSuccess }: LandingFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form data
  const [title, setTitle] = useState(landing?.title || '');
  const [slug, setSlug] = useState(landing?.slug || '');
  const [language, setLanguage] = useState<Language>(landing?.language || 'ES');
  const [coverImage, setCoverImage] = useState(landing?.coverImage || '');
  const [gallery, setGallery] = useState<string[]>(landing?.gallery || []);
  const [content, setContent] = useState(landing?.content || '');
  const [metaTitle, setMetaTitle] = useState(landing?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(landing?.metaDescription || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!content.trim()) {
        throw new Error('El contenido es obligatorio');
      }

      const data: CreateLandingInput | UpdateLandingInput = {
        title,
        slug: slug || undefined,
        language,
        coverImage: coverImage || null,
        gallery,
        content,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      };

      if (landing) {
        await landingService.update(landing.id, data);
      } else {
        await landingService.create(data as CreateLandingInput);
      }

      toast({
        title: '✅ Guardado',
        description: `Landing ${landing ? 'actualizada' : 'creada'} correctamente`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/organizer/landings');
      }
    } catch (error: any) {
      console.error('Error saving landing:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar la landing',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, isGallery: boolean = false) => {
    try {
      setUploadingImage(true);
      const url = await uploadFile(file, 'file');

      if (isGallery) {
        setGallery([...gallery, url]);
      } else {
        setCoverImage(url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Error al subir la imagen',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la landing page"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="mi-landing-page (se genera automáticamente si se deja vacío)"
        />
        <p className="text-xs text-muted-foreground mt-1">
          URL final: /page/{slug || 'slug-generado'}
        </p>
      </div>

      {/* Language */}
      <div>
        <Label htmlFor="language">Idioma *</Label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={!!landing} // No se puede cambiar el idioma al editar
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Image */}
      <div>
        <Label>Imagen de Portada</Label>
        {coverImage ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mt-2">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 mt-2">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click para subir imagen de portada</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              disabled={uploadingImage}
            />
          </label>
        )}
      </div>

      {/* Content (WYSIWYG) */}
      <div>
        <Label>Contenido *</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Escribe el contenido de tu landing page..."
        />
      </div>

      {/* Gallery */}
      <div>
        <Label>Galería de Fotos</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {gallery.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
            <Plus className="h-8 w-8 text-gray-400 mb-1" />
            <span className="text-xs text-gray-600">Agregar</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
              disabled={uploadingImage}
            />
          </label>
        </div>
      </div>

      {/* SEO Meta Title */}
      <div>
        <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="Título para SEO (máx 60 caracteres)"
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {metaTitle.length}/60 caracteres
        </p>
      </div>

      {/* SEO Meta Description */}
      <div>
        <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
        <textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descripción para SEO (máx 155 caracteres)"
          maxLength={155}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {metaDescription.length}/155 caracteres
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || uploadingImage} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {landing ? 'Actualizar' : 'Crear'} Landing
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
