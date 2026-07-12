'use client';

import { useTranslations } from 'next-intl';
import { PostForm } from '@/components/PostForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPostPage() {
  const t = useTranslations('boCatalog');
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/organizer/posts"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToPosts')}
          </Link>
          <h1 className="text-4xl font-bold mb-2">{t('createNewPost')}</h1>
          <p className="text-muted-foreground">
            {t('createPostSubtitle')}
          </p>
        </div>

        {/* Form */}
        <PostForm mode="create" />
      </div>
    </div>
  );
}
