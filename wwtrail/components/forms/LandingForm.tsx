'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  { value: Language.ES, label: 'Español' },
  { value: Language.EN, label: 'English' },
  { value: Language.IT, label: 'Italiano' },
  { value: Language.CA, label: 'Català' },
  { value: Language.FR, label: 'Français' },
  { value: Language.DE, label: 'Deutsch' },
];

export default function LandingForm({ landing, onSuccess }: LandingFormProps) {
  const router = useRouter();
  const t = useTranslations('boForms');
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form data
  const [title, setTitle] = useState(landing?.title || '');
  const [slug, setSlug] = useState(landing?.slug || '');
  const [language, setLanguage] = useState<Language>((landing?.language as Language) || Language.ES);
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
        throw new Error(t('titleRequired'));
      }
      if (!content.trim()) {
        throw new Error(t('contentRequired'));
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
        title: t('savedToastTitle'),
        description: landing ? t('landingUpdatedSuccess') : t('landingCreatedSuccess'),
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/organizer/landings');
      }
    } catch (error: any) {
      console.error('Error saving landing:', error);
      toast({
        title: t('errorTitle'),
        description: error.message || t('landingSaveError'),
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
        title: t('errorTitle'),
        description: t('imageUploadError'),
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
        <Label htmlFor="title">{t('titleLabel')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('landingTitlePlaceholder')}
          required
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug">{t('slugUrlLabel')}</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder={t('landingSlugPlaceholder')}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t('finalUrl', { slug: slug || t('generatedSlug') })}
        </p>
      </div>

      {/* Language */}
      <div>
        <Label htmlFor="language">{t('languageLabel')}</Label>
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
        <Label>{t('coverImage')}</Label>
        {coverImage ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mt-2">
            <img src={coverImage} alt={t('coverImage')} className="w-full h-full object-cover" />
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
            <span className="text-sm text-gray-600">{t('clickToUploadCover')}</span>
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
        <Label>{t('contentLabel')}</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder={t('landingContentPlaceholder')}
        />
      </div>

      {/* Gallery */}
      <div>
        <Label>{t('photoGallery')}</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {gallery.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img src={img} alt={t('galleryImageAlt', { index: index + 1 })} className="w-full h-full object-cover" />
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
            <span className="text-xs text-gray-600">{t('add')}</span>
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
        <Label htmlFor="metaTitle">{t('metaTitleLabel')}</Label>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder={t('metaTitlePlaceholder')}
          maxLength={60}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t('charCount', { current: metaTitle.length, max: 60 })}
        </p>
      </div>

      {/* SEO Meta Description */}
      <div>
        <Label htmlFor="metaDescription">{t('metaDescriptionLabel')}</Label>
        <textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('metaDescriptionPlaceholder')}
          maxLength={155}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t('charCount', { current: metaDescription.length, max: 155 })}
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
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={loading || uploadingImage} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('saving')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {landing ? t('updateLanding') : t('createLanding')}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
