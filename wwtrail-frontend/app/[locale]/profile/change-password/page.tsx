'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock } from 'lucide-react';

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('La nueva contraseña debe ser diferente de la actual');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // TODO: Implement actual API call to change password
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-4xl font-bold mb-2">Cambiar Contraseña</h1>
          <p className="text-lg opacity-90">
            Actualiza tu contraseña de forma segura
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">✅ Contraseña actualizada correctamente</p>
                  <p className="text-sm text-green-600 mt-1">Redirigiendo...</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">❌ {error}</p>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual *</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  placeholder="Tu contraseña actual"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña *</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repite la nueva contraseña"
                />
              </div>

              {/* Password Requirements */}
              <div className="bg-muted rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">Requisitos de contraseña:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li className={formData.newPassword.length >= 6 ? 'text-green-600' : ''}>
                    • Mínimo 6 caracteres
                  </li>
                  <li className={formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : ''}>
                    • Las contraseñas deben coincidir
                  </li>
                  <li className={formData.currentPassword && formData.newPassword && formData.currentPassword !== formData.newPassword ? 'text-green-600' : ''}>
                    • Debe ser diferente de la actual
                  </li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Tip */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Consejo de seguridad:</strong> Usa una contraseña única que no uses en otros sitios. 
            Considera usar un gestor de contraseñas.
          </p>
        </div>
      </div>
    </div>
  );
}
