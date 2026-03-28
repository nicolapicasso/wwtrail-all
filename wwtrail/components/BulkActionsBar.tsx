'use client';

import { Trash2, CheckCircle, FileText, XCircle, X } from 'lucide-react';
import { EventStatus } from '@/lib/types/event';

interface BulkActionsBarProps {
  selectedCount: number;
  onChangeStatus: (status: EventStatus) => void;
  onDelete: () => void;
  onClearSelection: () => void;
  isLoading?: boolean;
}

export default function BulkActionsBar({
  selectedCount,
  onChangeStatus,
  onDelete,
  onClearSelection,
  isLoading = false,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 px-4 py-3 flex items-center gap-4">
        {/* Counter */}
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
          <span className="text-sm">{selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}</span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Publicar */}
          <button
            onClick={() => onChangeStatus('PUBLISHED')}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 
                     hover:bg-green-50 rounded-md transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
            title="Publicar eventos"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Publicar</span>
          </button>

          {/* Borrador */}
          <button
            onClick={() => onChangeStatus('DRAFT')}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-yellow-700 
                     hover:bg-yellow-50 rounded-md transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
            title="Cambiar a borrador"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Borrador</span>
          </button>

          {/* Cancelar */}
          <button
            onClick={() => onChangeStatus('CANCELLED')}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
                     hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
            title="Cancelar eventos"
          >
            <XCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Eliminar */}
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 
                     hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
            title="Eliminar eventos"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300" />

        {/* Clear Selection */}
        <button
          onClick={onClearSelection}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                   rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Limpiar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
