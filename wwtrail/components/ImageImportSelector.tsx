'use client';

import React, { useState } from 'react';
import { ImageIcon, Download, Check, X, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/api/files.service';

export interface SuggestedImage {
  url: string;
  alt?: string;
  type: 'logo' | 'cover' | 'gallery' | 'unknown';
}

type ImageRole = 'logo' | 'cover' | 'gallery' | 'skip';

interface ImageAssignment {
  image: SuggestedImage;
  role: ImageRole;
  importing: boolean;
  imported: boolean;
  importedUrl?: string;
  error?: string;
}

interface Props {
  images: SuggestedImage[];
  onImport: (result: { logoUrl?: string; coverImage?: string; gallery: string[] }) => void;
  onClose: () => void;
}

const ROLE_LABELS: Record<ImageRole, string> = {
  logo: 'Logo',
  cover: 'Portada',
  gallery: 'Galería',
  skip: 'Omitir',
};

const ROLE_COLORS: Record<ImageRole, string> = {
  logo: 'bg-blue-100 text-blue-800 border-blue-300',
  cover: 'bg-purple-100 text-purple-800 border-purple-300',
  gallery: 'bg-green-100 text-green-800 border-green-300',
  skip: 'bg-gray-100 text-gray-500 border-gray-300',
};

export function ImageImportSelector({ images, onImport, onClose }: Props) {
  const [assignments, setAssignments] = useState<ImageAssignment[]>(
    images.map(img => ({
      image: img,
      role: img.type === 'unknown' ? 'gallery' : (img.type as ImageRole),
      importing: false,
      imported: false,
    }))
  );
  const [isImporting, setIsImporting] = useState(false);

  const updateRole = (index: number, role: ImageRole) => {
    setAssignments(prev => {
      const next = [...prev];
      // If setting logo or cover, clear previous assignment of same role
      if (role === 'logo' || role === 'cover') {
        next.forEach((a, i) => {
          if (i !== index && a.role === role) a.role = 'gallery';
        });
      }
      next[index] = { ...next[index], role };
      return next;
    });
  };

  const handleImportAll = async () => {
    setIsImporting(true);
    const toImport = assignments.filter(a => a.role !== 'skip');

    let logoUrl: string | undefined;
    let coverImage: string | undefined;
    const gallery: string[] = [];

    for (let i = 0; i < assignments.length; i++) {
      const a = assignments[i];
      if (a.role === 'skip') continue;

      setAssignments(prev => {
        const next = [...prev];
        next[i] = { ...next[i], importing: true };
        return next;
      });

      try {
        // Fetch image from URL and upload to our storage
        const response = await fetch('/api/files/import-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: a.image.url, fieldName: a.role }),
        });

        const json = await response.json();
        const uploadedUrl = json.data?.url || json.url;

        if (!uploadedUrl) throw new Error('No URL returned');

        setAssignments(prev => {
          const next = [...prev];
          next[i] = { ...next[i], importing: false, imported: true, importedUrl: uploadedUrl };
          return next;
        });

        switch (a.role) {
          case 'logo': logoUrl = uploadedUrl; break;
          case 'cover': coverImage = uploadedUrl; break;
          case 'gallery': gallery.push(uploadedUrl); break;
        }
      } catch (err: any) {
        setAssignments(prev => {
          const next = [...prev];
          next[i] = { ...next[i], importing: false, error: err.message || 'Error' };
          return next;
        });
      }
    }

    onImport({ logoUrl, coverImage, gallery });
    setIsImporting(false);
  };

  const selectedCount = assignments.filter(a => a.role !== 'skip').length;

  return (
    <div className="rounded-lg bg-amber-50 p-6 shadow-sm border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-amber-900">
            Imágenes encontradas ({images.length})
          </h2>
        </div>
        <button type="button" onClick={onClose} className="text-amber-600 hover:text-amber-800">
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm text-amber-700 mb-4">
        Selecciona el rol de cada imagen. Solo puede haber un logo y una portada. Las demás se añadirán a la galería.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {assignments.map((a, idx) => (
          <div
            key={idx}
            className={`relative rounded-lg border-2 overflow-hidden transition-all ${
              a.role === 'skip' ? 'opacity-40 border-gray-200' : 'border-amber-300'
            } ${a.imported ? 'ring-2 ring-green-400' : ''}`}
          >
            {/* Image preview */}
            <div className="aspect-video bg-white overflow-hidden">
              <img
                src={a.image.url}
                alt={a.image.alt || `Imagen ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><rect fill="%23f3f4f6" width="100" height="60"/><text x="50" y="35" text-anchor="middle" fill="%239ca3af" font-size="10">Error</text></svg>';
                }}
              />
            </div>

            {/* Status overlay */}
            {a.importing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
            {a.imported && (
              <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
            {a.error && (
              <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1" title={a.error}>
                <X className="h-3 w-3" />
              </div>
            )}

            {/* Role selector */}
            <div className="p-2 bg-white">
              <div className="flex flex-wrap gap-1">
                {(['logo', 'cover', 'gallery', 'skip'] as ImageRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => updateRole(idx, role)}
                    disabled={isImporting}
                    className={`text-xs px-2 py-1 rounded border transition-all ${
                      a.role === role
                        ? ROLE_COLORS[role] + ' font-semibold'
                        : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {ROLE_LABELS[role]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Import button */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-amber-700">
          {selectedCount} imagen{selectedCount !== 1 ? 'es' : ''} seleccionada{selectedCount !== 1 ? 's' : ''}
          {assignments.some(a => a.role === 'logo') && ' · 1 logo'}
          {assignments.some(a => a.role === 'cover') && ' · 1 portada'}
          {assignments.filter(a => a.role === 'gallery').length > 0 &&
            ` · ${assignments.filter(a => a.role === 'gallery').length} galería`}
        </p>
        <button
          type="button"
          onClick={handleImportAll}
          disabled={isImporting || selectedCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {isImporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isImporting ? 'Importando...' : `Importar ${selectedCount} imagen${selectedCount !== 1 ? 'es' : ''}`}
        </button>
      </div>
    </div>
  );
}
