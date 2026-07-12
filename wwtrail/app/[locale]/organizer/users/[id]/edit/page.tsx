'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  User,
  Camera,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Lock,
  Shield,
  Loader2,
} from 'lucide-react';
import { adminService } from '@/lib/api/admin.service';
import { COUNTRIES } from '@/lib/utils/countries';
import FileUpload from '@/components/FileUpload';

import type { User as UserProfile } from '@/lib/api/admin.service';

export default function AdminEditUserPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const userId = params.id as string;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    bio: '',
    avatar: '',
    phone: '',
    country: '',
    city: '',
    gender: '',
    birthDate: '',
    isPublic: false,
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
  });

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await adminService.getUserById(userId);
        setUserProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          newPassword: '',
          bio: data.bio || '',
          avatar: data.avatar || '',
          phone: data.phone || '',
          country: data.country || '',
          city: data.city || '',
          gender: data.gender || '',
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
          isPublic: data.isPublic ?? false,
          instagramUrl: data.instagramUrl || '',
          facebookUrl: data.facebookUrl || '',
          twitterUrl: data.twitterUrl || '',
          youtubeUrl: data.youtubeUrl || '',
        });
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError('Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && currentUser && userId) {
      fetchUser();
    }
  }, [authLoading, currentUser, userId]);

  // Check admin access
  if (!authLoading && (!currentUser || currentUser.role !== 'ADMIN')) {
    router.push(`/${locale}/organizer`);
    return null;
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Usuario no encontrado</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(false);

    // Validación de contraseña (opcional): si se rellena, mínimo 6 caracteres
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setSaving(false);
      return;
    }

    try {
      const { newPassword, ...rest } = formData;
      const updateData: any = {
        ...rest,
        email: formData.email.trim() || undefined,
        birthDate: formData.birthDate || undefined,
        instagramUrl: formData.instagramUrl || undefined,
        facebookUrl: formData.facebookUrl || undefined,
        twitterUrl: formData.twitterUrl || undefined,
        youtubeUrl: formData.youtubeUrl || undefined,
      };
      // Solo enviar la contraseña si el admin la ha definido
      if (newPassword) {
        updateData.password = newPassword;
      }

      await adminService.updateUserById(userId, updateData);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/organizer/users`);
      }, 1500);
    } catch (err: any) {
      console.error('Error updating user:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al actualizar el usuario');
      }
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ORGANIZER':
        return 'bg-blue-100 text-blue-800';
      case 'ATHLETE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-white hover:text-white/80 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Editar Usuario</h1>
              <p className="text-lg opacity-90">
                {userProfile.email}
                <Badge className={`ml-2 ${getRoleBadgeColor(userProfile.role)}`}>
                  {userProfile.role}
                </Badge>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">Usuario actualizado correctamente</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Cuenta y acceso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Cuenta y acceso
              </CardTitle>
              <CardDescription>
                Como administrador puedes cambiar el email y establecer una nueva contraseña para este usuario.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email (editable) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                {/* Nueva contraseña (opcional) */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Nueva contraseña
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="text"
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para no cambiarla"
                  />
                  <p className="text-xs text-gray-500">
                    Mínimo 6 caracteres. Si lo dejas vacío, la contraseña actual no se modifica.
                  </p>
                </div>
              </div>

              {/* Datos de solo lectura */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <Label className="text-gray-500">Username</Label>
                  <p className="font-medium">@{userProfile.username}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Rol</Label>
                  <p><Badge className={getRoleBadgeColor(userProfile.role)}>{userProfile.role}</Badge></p>
                </div>
                <div>
                  <Label className="text-gray-500">Estado</Label>
                  <p>
                    <Badge variant={userProfile.isActive ? 'default' : 'secondary'}>
                      {userProfile.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {formData.isPublic ? (
                  <Globe className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-600" />
                )}
                Privacidad del Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublic" className="text-base font-medium">
                    Perfil público
                  </Label>
                  <p className="text-sm text-gray-500">
                    Si está activado, el perfil aparecerá en el listado de usuarios públicos
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={handleSwitchChange('isPublic')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Avatar & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar with FileUpload */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Foto de perfil
                </Label>
                <div className="flex items-start gap-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {formData.avatar ? (
                      <Image
                        src={formData.avatar}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <FileUpload
                      onUpload={(url) => {
                        setFormData((prev) => ({ ...prev, avatar: url }));
                      }}
                      currentUrl={formData.avatar}
                      accept="image/*"
                      buttonText="Subir foto"
                    />
                    {formData.avatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setFormData((prev) => ({ ...prev, avatar: '' }))}
                      >
                        Eliminar foto
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="García"
                  />
                </div>
              </div>

              {/* Gender & Birth Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="MALE">Hombre</option>
                    <option value="FEMALE">Mujer</option>
                    <option value="NON_BINARY">No binario</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Seleccionar país...</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Madrid"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Biografía</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">Descripción</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Información sobre el usuario..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.bio.length}/500 caracteres
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  Instagram
                </Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="https://instagram.com/usuario"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook
                </Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="https://facebook.com/usuario"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-sky-500" />
                  Twitter / X
                </Label>
                <Input
                  id="twitterUrl"
                  name="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={handleChange}
                  placeholder="https://twitter.com/usuario"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-600" />
                  YouTube
                </Label>
                <Input
                  id="youtubeUrl"
                  name="youtubeUrl"
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@canal"
                />
              </div>
            </CardContent>
          </Card>

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
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
