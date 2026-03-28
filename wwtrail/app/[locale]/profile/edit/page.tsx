'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
} from 'lucide-react';
import { userService, OwnProfile, UpdateProfileData } from '@/lib/api/user.service';
import { COUNTRIES } from '@/lib/utils/countries';
import FileUpload from '@/components/FileUpload';

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  const [profile, setProfile] = useState<OwnProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    avatar: '',
    phone: '',
    country: '',
    city: '',
    gender: null,
    birthDate: null,
    isPublic: false,
    instagramUrl: null,
    facebookUrl: null,
    twitterUrl: null,
    youtubeUrl: null,
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getOwnProfile();
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          username: data.username || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
          phone: data.phone || '',
          country: data.country || '',
          city: data.city || '',
          gender: data.gender,
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : null,
          isPublic: data.isPublic,
          instagramUrl: data.instagramUrl,
          facebookUrl: data.facebookUrl,
          twitterUrl: data.twitterUrl,
          youtubeUrl: data.youtubeUrl,
        });
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchProfile();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push(`/${locale}/auth/login`);
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
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

    try {
      // Prepare data for API
      const updateData: UpdateProfileData = {
        ...formData,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
      };

      await userService.updateProfile(updateData);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/profile`);
      }, 1500);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al actualizar el perfil');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-white hover:text-white/80 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-4xl font-bold mb-2">Editar Perfil</h1>
          <p className="text-lg opacity-90">Actualiza tu informaci&oacute;n personal</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">Perfil actualizado correctamente</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

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
              <CardDescription>
                Controla qui&eacute;n puede ver tu perfil y participaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublic" className="text-base font-medium">
                    Perfil p&uacute;blico
                  </Label>
                  <p className="text-sm text-gray-500">
                    Si est&aacute; activado, tu perfil aparecer&aacute; en el listado de usuarios
                    y tus participaciones ser&aacute;n visibles en las ediciones
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
              <CardTitle>Informaci&oacute;n B&aacute;sica</CardTitle>
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
                    <p className="text-xs text-gray-500 mt-2">
                      Recomendado: imagen cuadrada de al menos 200x200 píxeles
                    </p>
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

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario *</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleChange}
                  required
                  placeholder="tu_usuario"
                />
                <p className="text-xs text-gray-500">
                  Tu nombre de usuario es &uacute;nico y visible p&uacute;blicamente
                </p>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    placeholder="Juan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    placeholder="Garc&iacute;a"
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
                    value={formData.gender || ''}
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
                    value={formData.birthDate || ''}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Tel&eacute;fono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicaci&oacute;n</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Pa&iacute;s</Label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Seleccionar pa&iacute;s...</option>
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
                    value={formData.city || ''}
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
              <CardTitle>Sobre m&iacute;</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">Biograf&iacute;a</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Cu&eacute;ntanos sobre ti, tu experiencia en trail running..."
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 text-right">
                  {(formData.bio || '').length}/500 caracteres
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>
                A&ntilde;ade tus perfiles de redes sociales (opcional)
              </CardDescription>
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
                  value={formData.instagramUrl || ''}
                  onChange={handleChange}
                  placeholder="https://instagram.com/tu_usuario"
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
                  value={formData.facebookUrl || ''}
                  onChange={handleChange}
                  placeholder="https://facebook.com/tu_usuario"
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
                  value={formData.twitterUrl || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/tu_usuario"
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
                  value={formData.youtubeUrl || ''}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@tu_canal"
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
                <>Guardando...</>
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
