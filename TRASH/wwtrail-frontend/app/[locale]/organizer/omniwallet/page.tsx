'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { zancadasAdminService, ZancadasConfig, ZancadasStats } from '@/lib/api/zancadas-admin.service';
import { CheckCircle, XCircle, Loader2, Wallet, TrendingUp, Users, Zap } from 'lucide-react';

export default function OmniwalletConfigPage() {
  const [config, setConfig] = useState({
    subdomain: '',
    apiToken: '',
    webhookSecret: '',
    isEnabled: false,
  });
  const [originalConfig, setOriginalConfig] = useState<ZancadasConfig | null>(null);
  const [stats, setStats] = useState<ZancadasStats | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configData, statsData] = await Promise.all([
        zancadasAdminService.getConfig(),
        zancadasAdminService.getStats().catch(() => null),
      ]);

      if (configData) {
        setOriginalConfig(configData);
        setConfig((prev) => ({
          ...prev,
          subdomain: configData.subdomain || '',
          isEnabled: configData.isEnabled,
        }));
      }

      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast.error('Error al cargar la configuraci\u00f3n');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const result = await zancadasAdminService.testConnection();
      setConnectionStatus(result.connected ? 'success' : 'error');

      if (result.connected) {
        toast.success('Conexi\u00f3n exitosa con Omniwallet');
      } else {
        toast.error(`Error de conexi\u00f3n: ${result.message}`);
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Error al probar la conexi\u00f3n');
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await zancadasAdminService.updateConfig({
        subdomain: config.subdomain || undefined,
        apiToken: config.apiToken || undefined,
        webhookSecret: config.webhookSecret || undefined,
        isEnabled: config.isEnabled,
      });

      // Limpiar campos de token despues de guardar
      setConfig((prev) => ({
        ...prev,
        apiToken: '',
        webhookSecret: '',
      }));

      await loadData();
      toast.success('Configuraci\u00f3n guardada correctamente');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Error al guardar la configuraci\u00f3n');
    } finally {
      setSaving(false);
    }
  };

  const retrySyncs = async () => {
    setRetrying(true);
    try {
      const result = await zancadasAdminService.retrySyncs(50);
      toast.success(`Procesadas ${result.processed} transacciones, ${result.synced} sincronizadas`);
      await loadData();
    } catch (error) {
      toast.error('Error al reintentar sincronizaciones');
    } finally {
      setRetrying(false);
    }
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
          <Wallet className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Configuraci\u00f3n de Omniwallet</h1>
          <p className="text-muted-foreground">
            Configura la conexi\u00f3n con Omniwallet para el sistema de Zancadas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Puntos otorgados</p>
                  <p className="text-2xl font-bold">{stats.totalPointsAwarded.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transacciones</p>
                  <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios con puntos</p>
                  <p className="text-2xl font-bold">{stats.usersWithPoints.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Config */}
      <Card>
        <CardHeader>
          <CardTitle>Conexi\u00f3n con Omniwallet</CardTitle>
          <CardDescription>
            Configura los datos de conexi\u00f3n con tu cuenta de Omniwallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdominio</Label>
              <Input
                id="subdomain"
                placeholder="tu-cuenta"
                value={config.subdomain}
                onChange={(e) => setConfig((prev) => ({ ...prev, subdomain: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                El subdominio de tu cuenta (ej: si accedes por miempresa.omniwallet.net, escribe &quot;miempresa&quot;)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiToken">API Token</Label>
              <Input
                id="apiToken"
                type="password"
                placeholder={originalConfig?.hasToken ? '********** (configurado)' : 'Introduce tu API Token'}
                value={config.apiToken}
                onChange={(e) => setConfig((prev) => ({ ...prev, apiToken: e.target.value }))}
              />
              {originalConfig?.hasToken && (
                <p className="text-xs text-green-600">Token ya configurado. Deja vac\u00edo para mantener el actual.</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret (opcional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              placeholder={originalConfig?.hasWebhookSecret ? '********** (configurado)' : 'Introduce el Webhook Secret'}
              value={config.webhookSecret}
              onChange={(e) => setConfig((prev) => ({ ...prev, webhookSecret: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Necesario solo si quieres recibir webhooks de Omniwallet
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-3">
              <Switch
                id="enabled"
                checked={config.isEnabled}
                onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, isEnabled: checked }))}
              />
              <Label htmlFor="enabled" className="font-medium">
                Sistema de Zancadas activo
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={testConnection} disabled={connectionStatus === 'testing'}>
                {connectionStatus === 'testing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {connectionStatus === 'success' && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                {connectionStatus === 'error' && <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                Probar Conexi\u00f3n
              </Button>
              <Button onClick={saveConfig} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Management */}
      <Card>
        <CardHeader>
          <CardTitle>Sincronizaci\u00f3n</CardTitle>
          <CardDescription>
            Gestiona la sincronizaci\u00f3n de transacciones con Omniwallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reintentar sincronizaciones fallidas</p>
              <p className="text-sm text-muted-foreground">
                Procesa transacciones que no pudieron sincronizarse con Omniwallet
              </p>
            </div>
            <Button variant="outline" onClick={retrySyncs} disabled={retrying}>
              {retrying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats by Action */}
      {stats && stats.transactionsByAction.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transacciones por Acci\u00f3n</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.transactionsByAction.map((action) => (
                <div
                  key={action.actionCode}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{action.actionName}</p>
                    <p className="text-sm text-muted-foreground">{action.count} transacciones</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{action.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">puntos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
