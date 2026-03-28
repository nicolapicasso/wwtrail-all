'use client';

import { Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminEditButtonProps {
  editUrl: string;
  label?: string;
  className?: string;
}

/**
 * Botón de edición que solo aparece para administradores
 * Abre la página de edición en una nueva pestaña
 */
export function AdminEditButton({
  editUrl,
  label = 'Editar',
  className = ''
}: AdminEditButtonProps) {
  const { user } = useAuth();

  // Solo mostrar si el usuario es admin
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm ${className}`}
      title={`${label} (abre en nueva pestaña)`}
    >
      <Edit className="h-4 w-4" />
      {label}
    </a>
  );
}

/**
 * Versión flotante del botón de edición (posición fija en la esquina)
 */
export function AdminEditButtonFloating({
  editUrl,
  label = 'Editar',
}: AdminEditButtonProps) {
  const { user } = useAuth();

  // Solo mostrar si el usuario es admin
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
      title={`${label} (abre en nueva pestaña)`}
    >
      <Edit className="h-5 w-5" />
      {label}
    </a>
  );
}
