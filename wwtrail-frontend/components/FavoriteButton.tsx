'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesService } from '@/lib/api/favorites.service';

interface FavoriteButtonProps {
  competitionId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function FavoriteButton({
  competitionId,
  className = '',
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if competition is favorited on mount
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        const result = await favoritesService.isFavorite(competitionId);
        setIsFavorite(result);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavorite();
  }, [competitionId, user]);

  const handleToggle = async () => {
    if (!user) {
      // Redirect to login or show message
      alert('Inicia sesión para guardar favoritos');
      return;
    }

    setIsLoading(true);
    try {
      const newState = await favoritesService.toggleFavorite(competitionId, isFavorite);
      setIsFavorite(newState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`${buttonSizeClasses[size]} rounded-full bg-gray-100 opacity-50 ${className}`}
      >
        <Heart className={`${sizeClasses[size]} text-gray-400`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${buttonSizeClasses[size]}
        rounded-full
        transition-all duration-200
        ${isFavorite
          ? 'bg-red-100 hover:bg-red-200'
          : 'bg-gray-100 hover:bg-gray-200'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <div className="flex items-center gap-1.5">
        <Heart
          className={`
            ${sizeClasses[size]}
            transition-colors duration-200
            ${isFavorite
              ? 'text-red-500 fill-red-500'
              : 'text-gray-500'
            }
          `}
        />
        {showLabel && (
          <span className={`text-sm font-medium ${isFavorite ? 'text-red-600' : 'text-gray-600'}`}>
            {isFavorite ? 'Guardado' : 'Guardar'}
          </span>
        )}
      </div>
    </button>
  );
}

export default FavoriteButton;
