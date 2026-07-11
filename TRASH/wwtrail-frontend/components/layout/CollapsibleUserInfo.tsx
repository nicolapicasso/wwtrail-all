'use client';

import { useState } from 'react';
import { LogOut, ChevronUp, ChevronDown } from 'lucide-react';

interface CollapsibleUserInfoProps {
  username?: string;
  email?: string;
  isAdmin?: boolean;
  onLogout: () => void;
}

/**
 * Collapsible user info box for backoffice sidebars
 * - Collapsed by default: shows only email and expand button
 * - Expanded: shows username, email, role badge (if admin), and logout button
 */
export function CollapsibleUserInfo({
  username,
  email,
  isAdmin,
  onLogout,
}: CollapsibleUserInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) {
    // Expanded view
    return (
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="mb-3 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900">{username}</p>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Contraer"
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <p className="text-xs text-gray-500">{email}</p>
          {isAdmin && (
            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
              Administrador
            </span>
          )}
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Collapsed view - just email and expand button
  return (
    <div className="flex-shrink-0 border-t border-gray-200 p-4">
      <div className="rounded-lg bg-gray-50 p-2 flex items-center justify-between gap-2">
        <p className="text-xs text-gray-600 truncate flex-1">{email}</p>
        <button
          onClick={() => setIsExpanded(true)}
          className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
          title="Expandir"
        >
          <ChevronUp className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
