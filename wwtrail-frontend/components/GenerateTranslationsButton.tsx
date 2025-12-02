'use client';

import { useState } from 'react';
import { Languages, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import translationsService, { type TranslatableEntityType } from '@/lib/api/v2/translations.service';
import { useAuth } from '@/contexts/AuthContext';

interface GenerateTranslationsButtonProps {
  entityType: TranslatableEntityType;
  entityId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

type TranslationStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Button to generate AI translations for an entity
 * Only visible for ORGANIZER and ADMIN users
 */
export function GenerateTranslationsButton({
  entityType,
  entityId,
  className = '',
  variant = 'outline',
  size = 'sm',
}: GenerateTranslationsButtonProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<TranslationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Only show for ORGANIZER or ADMIN users
  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return null;
  }

  const handleGenerateTranslations = async () => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      await translationsService.translate(entityType, entityId);
      setStatus('success');

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error: any) {
      console.error('Error generating translations:', error);
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        'Error al generar traducciones'
      );
      setStatus('error');

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 5000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generando...</span>
          </>
        );
      case 'success':
        return (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Traducciones generadas</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-600">Error</span>
          </>
        );
      default:
        return (
          <>
            <Languages className="h-4 w-4" />
            <span>Generar Traducciones</span>
          </>
        );
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleGenerateTranslations}
        disabled={status === 'loading'}
        className="flex items-center gap-2"
        title="Genera traducciones automáticas con IA para este contenido"
      >
        {getButtonContent()}
      </Button>
      {errorMessage && (
        <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
