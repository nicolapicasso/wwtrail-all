'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { zancadasAdminService, ZancadasAction } from '@/lib/api/zancadas-admin.service';
import { Loader2, Footprints, Save, UserPlus, LogIn, Star, Trophy } from 'lucide-react';

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  REGISTER: UserPlus,
  LOGIN: LogIn,
  RATING: Star,
  PARTICIPATION: Trophy,
};

const ACTION_LABELS: Record<string, string> = {
  REGISTER: 'Registro de usuario',
  LOGIN: 'Inicio de sesión diario',
  RATING: 'Crear valoración',
  PARTICIPATION: 'Participar en edición',
};

const PARTICIPATION_STATUSES = [
  { value: 'INTERESTED', label: 'Interesado' },
  { value: 'REGISTERED', label: 'Inscrito' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'COMPLETED', label: 'Completado' },
  { value: 'DNS', label: 'No presentado (DNS)' },
  { value: 'DNF', label: 'No finalizado (DNF)' },
  { value: 'DSQ', label: 'Descalificado (DSQ)' },
];

export default function OmniwalletActionsPage() {
  const [actions, setActions] = useState<ZancadasAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editedActions, setEditedActions] = useState<Record<string, Partial<ZancadasAction>>>({});

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      setLoading(true);
      const data = await zancadasAdminService.getActions();
      setActions(data);
      // Initialize edited state
      const edited: Record<string, Partial<ZancadasAction>> = {};
      data.forEach((action) => {
        edited[action.id] = {
          points: action.points,
          maxPerDay: action.maxPerDay,
          maxPerUser: action.maxPerUser,
          isEnabled: action.isEnabled,
          triggerStatuses: action.triggerStatuses,
        };
      });
      setEditedActions(edited);
    } catch (error) {
      console.error('Error loading actions:', error);
      toast.error('Error al cargar las acciones');
    } finally {
      setLoading(false);
    }
  };

  const updateLocalAction = (actionId: string, field: string, value: unknown) => {
    setEditedActions((prev) => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        [field]: value,
      },
    }));
  };

  const saveAction = async (action: ZancadasAction) => {
    const edited = editedActions[action.id];
    if (!edited) return;

    setSavingId(action.id);
    try {
      await zancadasAdminService.updateAction(action.id, {
        points: edited.points,
        maxPerDay: edited.maxPerDay,
        maxPerUser: edited.maxPerUser,
        isEnabled: edited.isEnabled,
        triggerStatuses: edited.triggerStatuses,
      });
      toast.success(`Acción "${ACTION_LABELS[action.code] || action.code}" actualizada`);
      await loadActions();
    } catch (error) {
      console.error('Error saving action:', error);
      toast.error('Error al guardar la acción');
    } finally {
      setSavingId(null);
    }
  };

  const hasChanges = (action: ZancadasAction): boolean => {
    const edited = editedActions[action.id];
    if (!edited) return false;

    return (
      edited.points !== action.points ||
      edited.maxPerDay !== action.maxPerDay ||
      edited.maxPerUser !== action.maxPerUser ||
      edited.isEnabled !== action.isEnabled ||
      JSON.stringify(edited.triggerStatuses) !== JSON.stringify(action.triggerStatuses)
    );
  };

  const toggleTriggerStatus = (actionId: string, status: string) => {
    const current = editedActions[actionId]?.triggerStatuses || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    updateLocalAction(actionId, 'triggerStatuses', updated);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary-100 rounded-lg">
          <Footprints className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Acciones y Puntos</h1>
          <p className="text-muted-foreground">
            Configura las acciones que otorgan Zancadas a los usuarios
          </p>
        </div>
      </div>

      {/* Actions List */}
      <div className="grid gap-6">
        {actions.map((action) => {
          const Icon = ACTION_ICONS[action.code] || Footprints;
          const edited = editedActions[action.id] || {};
          const changed = hasChanges(action);

          return (
            <Card key={action.id} className={changed ? 'ring-2 ring-primary-200' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${edited.isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${edited.isEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {ACTION_LABELS[action.code] || action.code}
                      </CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={edited.isEnabled}
                        onCheckedChange={(checked) => updateLocalAction(action.id, 'isEnabled', checked)}
                      />
                      <Label className="text-sm">
                        {edited.isEnabled ? 'Activo' : 'Inactivo'}
                      </Label>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveAction(action)}
                      disabled={!changed || savingId === action.id}
                    >
                      {savingId === action.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Guardar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`points-${action.id}`}>Puntos por acción</Label>
                    <Input
                      id={`points-${action.id}`}
                      type="number"
                      min={0}
                      value={edited.points || 0}
                      onChange={(e) => updateLocalAction(action.id, 'points', parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Zancadas otorgadas cada vez
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`maxPerDay-${action.id}`}>Máximo por día</Label>
                    <Input
                      id={`maxPerDay-${action.id}`}
                      type="number"
                      min={0}
                      placeholder="Sin límite"
                      value={edited.maxPerDay ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateLocalAction(action.id, 'maxPerDay', val ? parseInt(val) : null);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Deja vacío para sin límite
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`maxPerUser-${action.id}`}>Máximo por usuario</Label>
                    <Input
                      id={`maxPerUser-${action.id}`}
                      type="number"
                      min={0}
                      placeholder="Sin límite"
                      value={edited.maxPerUser ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateLocalAction(action.id, 'maxPerUser', val ? parseInt(val) : null);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Límite total por usuario
                    </p>
                  </div>
                </div>

                {/* Trigger Statuses for PARTICIPATION */}
                {action.code === 'PARTICIPATION' && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Estados que otorgan puntos</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecciona en qué estados de participación se otorgan los puntos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PARTICIPATION_STATUSES.map((status) => {
                        const isSelected = (edited.triggerStatuses || []).includes(status.value);
                        return (
                          <Badge
                            key={status.value}
                            variant={isSelected ? 'default' : 'outline'}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-primary-500 hover:bg-primary-600'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => toggleTriggerStatus(action.id, status.value)}
                          >
                            {status.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {actions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Footprints className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground">
              No hay acciones configuradas. Las acciones se crearán automáticamente al ejecutar la migración.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
