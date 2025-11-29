'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  Users,
  Globe,
  Save,
  RefreshCw,
  User,
  MapPin,
} from 'lucide-react';
import { adminService, AdminUser } from '@/lib/api/admin.service';
import FileUpload from '@/components/FileUpload';
import { COUNTRIES } from '@/lib/utils/countries';

interface InsiderConfig {
  id: string;
  badgeUrl?: string;
  introTextES?: string;
  introTextEN?: string;
  introTextIT?: string;
  introTextCA?: string;
  introTextFR?: string;
  introTextDE?: string;
}

interface InsiderStats {
  total: number;
  byCountry: Record<string, number>;
  byGender: Record<string, number>;
}

export default function InsidersAdminPage() {
  const [insiders, setInsiders] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<InsiderStats | null>(null);
  const [config, setConfig] = useState<InsiderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state for config
  const [formConfig, setFormConfig] = useState({
    badgeUrl: '',
    introTextES: '',
    introTextEN: '',
    introTextIT: '',
    introTextCA: '',
    introTextFR: '',
    introTextDE: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [insidersData, configData] = await Promise.all([
        adminService.getInsiders(),
        adminService.getInsiderConfig(),
      ]);

      setInsiders(insidersData.insiders);
      setStats(insidersData.stats);
      setConfig(configData);
      setFormConfig({
        badgeUrl: configData.badgeUrl || '',
        introTextES: configData.introTextES || '',
        introTextEN: configData.introTextEN || '',
        introTextIT: configData.introTextIT || '',
        introTextCA: configData.introTextCA || '',
        introTextFR: configData.introTextFR || '',
        introTextDE: configData.introTextDE || '',
      });
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await adminService.updateInsiderConfig(formConfig);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving config:', err);
      setError(err.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const getCountryName = (code: string) => {
    if (code === 'unknown') return 'Sin país';
    const country = COUNTRIES.find((c) => c.code === code);
    return country?.name || code;
  };

  const getGenderLabel = (gender: string) => {
    const labels: Record<string, string> = {
      MALE: 'Hombres',
      FEMALE: 'Mujeres',
      NON_BINARY: 'No binario',
      unknown: 'Sin especificar',
    };
    return labels[gender] || gender;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            WWTrail Insiders
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona los corresponsales especiales de WWTrail
          </p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">Configuración guardada correctamente</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
                <p className="text-sm text-gray-600">Total Insiders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Object.keys(stats?.byCountry || {}).filter((k) => k !== 'unknown').length}
                </p>
                <p className="text-sm text-gray-600">Países</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.byGender?.MALE || 0}</p>
                <p className="text-sm text-gray-600">Hombres</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 rounded-full">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.byGender?.FEMALE || 0}</p>
                <p className="text-sm text-gray-600">Mujeres</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Insiders</CardTitle>
              <CardDescription>
                Configura el distintivo y los textos introductorios para la página de Insiders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badge Upload */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Distintivo (Badge)
                </Label>
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {formConfig.badgeUrl ? (
                      <Image
                        src={formConfig.badgeUrl}
                        alt="Badge"
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    ) : (
                      <Star className="w-12 h-12 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <FileUpload
                      onUploadComplete={(url) => setFormConfig({ ...formConfig, badgeUrl: url })}
                      folder="insiders"
                      accept="image/*"
                      buttonText="Subir distintivo"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Recomendado: imagen PNG con fondo transparente, 100x100px
                    </p>
                  </div>
                </div>
              </div>

              {/* Intro Texts by Language */}
              <div className="space-y-4">
                <Label>Textos introductorios por idioma</Label>
                <Tabs defaultValue="ES" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="ES">ES</TabsTrigger>
                    <TabsTrigger value="EN">EN</TabsTrigger>
                    <TabsTrigger value="IT">IT</TabsTrigger>
                    <TabsTrigger value="CA">CA</TabsTrigger>
                    <TabsTrigger value="FR">FR</TabsTrigger>
                    <TabsTrigger value="DE">DE</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ES" className="mt-4">
                    <textarea
                      value={formConfig.introTextES}
                      onChange={(e) => setFormConfig({ ...formConfig, introTextES: e.target.value })}
                      className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Texto introductorio en español..."
                    />
                  </TabsContent>
                  <TabsContent value="EN" className="mt-4">
                    <textarea
                      value={formConfig.introTextEN}
                      onChange={(e) => setFormConfig({ ...formConfig, introTextEN: e.target.value })}
                      className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Intro text in English..."
                    />
                  </TabsContent>
                  <TabsContent value="IT" className="mt-4">
                    <textarea
                      value={formConfig.introTextIT}
                      onChange={(e) => setFormConfig({ ...formConfig, introTextIT: e.target.value })}
                      className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Testo introduttivo in italiano..."
                    />
                  </TabsContent>
                  <TabsContent value="CA" className="mt-4">
                    <textarea
                      value={formConfig.introTextCA}
                      onChange={(e) => setFormConfig({ ...formConfig, introTextCA: e.target.value })}
                      className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Text introductori en català..."
                    />
                  </TabsContent>
                  <TabsContent value="FR" className="mt-4">
                    <textarea
                      value={formConfig.introTextFR}
                      onChange={(e) => setFormConfig({ ...formConfig, introTextFR: e.target.value })}
                      className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Texte d'introduction en français..."
                    />
                  </TabsContent>
                  <TabsContent value="DE" className="mt-4">
                    <textarea
                      value={formConfig.introTextDE}
                      onChange={(e) => setFormConfig({ ...formConfig, introTextDE: e.target.value })}
                      className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Einleitungstext auf Deutsch..."
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <Button onClick={handleSaveConfig} disabled={saving} className="w-full">
                {saving ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Configuración
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Insiders List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lista de Insiders
              </CardTitle>
              <CardDescription>
                {insiders.length} insider{insiders.length !== 1 ? 's' : ''} activo{insiders.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {insiders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay Insiders aún</p>
                  <p className="text-sm mt-1">
                    Marca usuarios como Insider desde la gestión de usuarios
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {insiders.map((insider) => (
                    <div
                      key={insider.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {insider.avatar ? (
                          <Image
                            src={insider.avatar}
                            alt={insider.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        {/* Insider badge overlay */}
                        {formConfig.badgeUrl && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5">
                            <Image
                              src={formConfig.badgeUrl}
                              alt="Insider"
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{insider.fullName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          {insider.country && (
                            <>
                              <MapPin className="w-3 h-3" />
                              {getCountryName(insider.country)}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats by Country */}
              {stats && Object.keys(stats.byCountry).length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-3">Por país</p>
                  <div className="space-y-2">
                    {Object.entries(stats.byCountry)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([code, count]) => (
                        <div key={code} className="flex justify-between text-sm">
                          <span className="text-gray-600">{getCountryName(code)}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
