'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus,
  Trash2,
  Loader2,
  Users,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import eventManagersService, {
  EventManager,
  AvailableOrganizer,
} from '@/lib/api/v2/eventManagers.service';

interface EventManagersPanelProps {
  eventId: string;
  eventName?: string;
}

export function EventManagersPanel({ eventId, eventName }: EventManagersPanelProps) {
  const { user } = useAuth();
  const [managers, setManagers] = useState<EventManager[]>([]);
  const [availableOrganizers, setAvailableOrganizers] = useState<AvailableOrganizer[]>([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Only show for ADMIN
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  // Load managers and available organizers
  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [managersData, organizersData] = await Promise.all([
        eventManagersService.getEventManagers(eventId),
        eventManagersService.getAvailableOrganizers(eventId),
      ]);
      setManagers(managersData);
      setAvailableOrganizers(organizersData);
    } catch (err: any) {
      console.error('Error loading managers:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddManager = async () => {
    if (!selectedOrganizer) return;

    try {
      setAdding(true);
      setError(null);
      setSuccess(null);
      await eventManagersService.addManager(eventId, selectedOrganizer);
      setSuccess('Organizador asignado correctamente');
      setSelectedOrganizer('');
      await loadData();
    } catch (err: any) {
      console.error('Error adding manager:', err);
      setError(err.response?.data?.message || err.message || 'Error al asignar organizador');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveManager = async (userId: string) => {
    try {
      setRemovingId(userId);
      setError(null);
      setSuccess(null);
      await eventManagersService.removeManager(eventId, userId);
      setSuccess('Organizador eliminado correctamente');
      await loadData();
    } catch (err: any) {
      console.error('Error removing manager:', err);
      setError(err.response?.data?.message || err.message || 'Error al eliminar organizador');
    } finally {
      setRemovingId(null);
    }
  };

  const getUserDisplayName = (user: EventManager['user'] | AvailableOrganizer) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.username;
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando organizadores...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Gestores del Evento</CardTitle>
        </div>
        <CardDescription>
          Asigna usuarios organizadores para que puedan gestionar este evento, sus competiciones y ediciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Add Manager Form */}
        <div className="flex gap-2 mb-6">
          <Select value={selectedOrganizer} onValueChange={setSelectedOrganizer}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar organizador..." />
            </SelectTrigger>
            <SelectContent>
              {availableOrganizers.length === 0 ? (
                <SelectItem value="none" disabled>
                  No hay organizadores disponibles
                </SelectItem>
              ) : (
                availableOrganizers.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {getUserDisplayName(org)} ({org.email})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddManager}
            disabled={!selectedOrganizer || adding}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" />
                Asignar
              </>
            )}
          </Button>
        </div>

        {/* Managers List */}
        {managers.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No hay organizadores asignados a este evento</p>
            <p className="text-sm">Solo el creador del evento puede editarlo</p>
          </div>
        ) : (
          <div className="space-y-2">
            {managers.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {(manager.user.firstName?.[0] || manager.user.username[0]).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {getUserDisplayName(manager.user)}
                    </div>
                    <div className="text-sm text-gray-500">{manager.user.email}</div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {manager.user.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveManager(manager.userId)}
                  disabled={removingId === manager.userId}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {removingId === manager.userId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Los organizadores asignados pueden editar este evento, crear/editar competiciones y ediciones.
        </div>
      </CardContent>
    </Card>
  );
}
