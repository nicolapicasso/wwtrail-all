'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  Database,
  Building2,
  Award,
  MapPin,
  Trophy,
  Mountain,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileJson,
  Play,
  Loader2,
} from 'lucide-react';
import { adminService } from '@/lib/api/admin.service';

interface ImportStats {
  organizers: number;
  specialSeries: number;
  events: number;
  competitions: number;
  terrainTypes: number;
}

interface ImportResult {
  created: number;
  skipped: number;
  errors: Array<{ identifier: string; error: string }>;
}

interface FullImportResult {
  organizers?: ImportResult;
  series?: ImportResult;
  events?: ImportResult;
  competitions?: ImportResult;
  terrainTypes?: ImportResult;
}

interface ImportData {
  organizers: any[] | null;
  series: any[] | null;
  events: any[] | null;
  competitions: any[] | null;
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// File Upload Component
function FileUpload({
  label,
  fileName,
  count,
  onFileSelect,
  icon: Icon,
}: {
  label: string;
  fileName: string | null;
  count: number | null;
  onFileSelect: (data: any[]) => void;
  icon: React.ElementType;
}) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      onFileSelect(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Error al leer el archivo JSON');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="font-medium">{label}</span>
      </div>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        id={`file-${label}`}
      />
      <label
        htmlFor={`file-${label}`}
        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span className="text-sm">Seleccionar archivo</span>
      </label>
      {fileName && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <FileJson className="w-4 h-4" />
          <span>{count?.toLocaleString()} registros</span>
        </div>
      )}
    </div>
  );
}

// Result Card Component
function ResultCard({ title, result }: { title: string; result: ImportResult }) {
  const hasErrors = result.errors.length > 0;

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-green-600">
          <span className="font-bold">{result.created}</span> creados
        </div>
        <div className="text-yellow-600">
          <span className="font-bold">{result.skipped}</span> omitidos
        </div>
        <div className={hasErrors ? 'text-red-600' : 'text-gray-400'}>
          <span className="font-bold">{result.errors.length}</span> errores
        </div>
      </div>
      {hasErrors && (
        <div className="mt-2 max-h-32 overflow-y-auto">
          {result.errors.slice(0, 5).map((err, i) => (
            <div key={i} className="text-xs text-red-500 mt-1">
              {err.identifier}: {err.error}
            </div>
          ))}
          {result.errors.length > 5 && (
            <div className="text-xs text-gray-500 mt-1">
              ... y {result.errors.length - 5} errores más
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ImportPage() {
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<FullImportResult | null>(null);
  const [importData, setImportData] = useState<ImportData>({
    organizers: null,
    series: null,
    events: null,
    competitions: null,
  });

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getImportStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleImport = async () => {
    const dataToImport: any = {};

    if (importData.organizers) dataToImport.organizers = importData.organizers;
    if (importData.series) dataToImport.series = importData.series;
    if (importData.events) dataToImport.events = importData.events;
    if (importData.competitions) dataToImport.competitions = importData.competitions;

    if (Object.keys(dataToImport).length === 0) {
      alert('No hay datos para importar. Selecciona al menos un archivo.');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const result = await adminService.importFull(dataToImport);
      setImportResult(result);
      // Refresh stats after import
      await fetchStats();
    } catch (error: any) {
      console.error('Error importing:', error);
      alert(`Error en la importación: ${error.message || 'Error desconocido'}`);
    } finally {
      setImporting(false);
    }
  };

  const handleEnsureTerrainTypes = async () => {
    try {
      const result = await adminService.ensureTerrainTypes();
      alert(`Tipos de terreno: ${result.created} creados, ${result.skipped} ya existían`);
      await fetchStats();
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Error desconocido'}`);
    }
  };

  const totalToImport =
    (importData.organizers?.length || 0) +
    (importData.series?.length || 0) +
    (importData.events?.length || 0) +
    (importData.competitions?.length || 0);

  const totalImported = importResult
    ? (importResult.organizers?.created || 0) +
      (importResult.series?.created || 0) +
      (importResult.events?.created || 0) +
      (importResult.competitions?.created || 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Importación de Datos</h1>
          <p className="text-gray-500">Migración de datos desde WordPress</p>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Current Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Estado Actual de la Base de Datos
          </CardTitle>
          <CardDescription>Registros existentes en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard
                title="Organizadores"
                value={stats.organizers}
                icon={Building2}
                color="blue"
              />
              <StatCard
                title="Series"
                value={stats.specialSeries}
                icon={Award}
                color="purple"
              />
              <StatCard title="Eventos" value={stats.events} icon={MapPin} color="green" />
              <StatCard
                title="Competiciones"
                value={stats.competitions}
                icon={Trophy}
                color="yellow"
              />
              <StatCard
                title="Tipos Terreno"
                value={stats.terrainTypes}
                icon={Mountain}
                color="orange"
              />
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>No se pudieron cargar las estadísticas</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Terrain Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="w-5 h-5" />
            Tipos de Terreno
          </CardTitle>
          <CardDescription>
            Asegura que los tipos de terreno necesarios para la importación existan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleEnsureTerrainTypes} variant="outline">
            <Mountain className="w-4 h-4 mr-2" />
            Crear Tipos de Terreno
          </Button>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Archivos de Importación
          </CardTitle>
          <CardDescription>
            Selecciona los archivos JSON exportados desde WordPress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FileUpload
              label="Organizadores"
              fileName={importData.organizers ? 'organizers.json' : null}
              count={importData.organizers?.length || null}
              onFileSelect={(data) => setImportData((prev) => ({ ...prev, organizers: data }))}
              icon={Building2}
            />
            <FileUpload
              label="Series"
              fileName={importData.series ? 'series.json' : null}
              count={importData.series?.length || null}
              onFileSelect={(data) => setImportData((prev) => ({ ...prev, series: data }))}
              icon={Award}
            />
            <FileUpload
              label="Eventos"
              fileName={importData.events ? 'events.json' : null}
              count={importData.events?.length || null}
              onFileSelect={(data) => setImportData((prev) => ({ ...prev, events: data }))}
              icon={MapPin}
            />
            <FileUpload
              label="Competiciones"
              fileName={importData.competitions ? 'competitions.json' : null}
              count={importData.competitions?.length || null}
              onFileSelect={(data) =>
                setImportData((prev) => ({ ...prev, competitions: data }))
              }
              icon={Trophy}
            />
          </div>

          {/* Summary */}
          {totalToImport > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    {totalToImport.toLocaleString()} registros listos para importar
                  </p>
                  <p className="text-sm text-blue-700">
                    {importData.organizers?.length || 0} organizadores,{' '}
                    {importData.series?.length || 0} series, {importData.events?.length || 0}{' '}
                    eventos, {importData.competitions?.length || 0} competiciones
                  </p>
                </div>
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Importación
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Resultados de la Importación
            </CardTitle>
            <CardDescription>
              {totalImported.toLocaleString()} registros importados correctamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {importResult.terrainTypes && (
                <ResultCard title="Tipos de Terreno" result={importResult.terrainTypes} />
              )}
              {importResult.organizers && (
                <ResultCard title="Organizadores" result={importResult.organizers} />
              )}
              {importResult.series && <ResultCard title="Series" result={importResult.series} />}
              {importResult.events && <ResultCard title="Eventos" result={importResult.events} />}
              {importResult.competitions && (
                <ResultCard title="Competiciones" result={importResult.competitions} />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Importación</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>
              <strong>Crear tipos de terreno:</strong> Primero, haz clic en "Crear Tipos de
              Terreno" para asegurar que existen todos los tipos necesarios.
            </li>
            <li>
              <strong>Seleccionar archivos:</strong> Sube los archivos JSON en el orden correcto
              (organizadores, series, eventos, competiciones).
            </li>
            <li>
              <strong>Iniciar importación:</strong> Haz clic en "Iniciar Importación" para
              procesar todos los archivos.
            </li>
            <li>
              <strong>Revisar resultados:</strong> Verifica los resultados y revisa cualquier
              error reportado.
            </li>
          </ol>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              <strong>Nota:</strong> Los registros que ya existen en la base de datos (por slug o
              ID) serán omitidos automáticamente. La importación es segura de ejecutar múltiples
              veces.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
