'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  XCircle,
  Trash2,
  Calendar,
  AlertTriangle,
  Eye,
  Download,
  Briefcase,
  FileText,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import {
  adminService,
  NativeImportEntityType,
  NativeImportFile,
  NativeValidationResult,
  NativeImportResult,
  ConflictResolution,
  ConflictItem,
} from '@/lib/api/admin.service';

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
              ... y {result.errors.length - 5} errores mas
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// NATIVE IMPORT TAB COMPONENT
// ============================================

const ENTITY_OPTIONS: { value: NativeImportEntityType; label: string; icon: React.ElementType }[] = [
  { value: 'events', label: 'Eventos', icon: MapPin },
  { value: 'competitions', label: 'Competiciones', icon: Trophy },
  { value: 'editions', label: 'Ediciones', icon: Calendar },
  { value: 'organizers', label: 'Organizadores', icon: Briefcase },
  { value: 'specialSeries', label: 'Series Especiales', icon: Sparkles },
  { value: 'services', label: 'Servicios', icon: Building2 },
  { value: 'posts', label: 'Posts', icon: FileText },
];

function NativeImportTab({ onImportComplete }: { onImportComplete: () => void }) {
  const [entityType, setEntityType] = useState<NativeImportEntityType>('events');
  const [file, setFile] = useState<NativeImportFile | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<NativeValidationResult | null>(null);
  const [importResult, setImportResult] = useState<NativeImportResult | null>(null);
  const [conflictResolution, setConflictResolution] = useState<ConflictResolution>('skip');
  const [dryRun, setDryRun] = useState(true);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const text = await selectedFile.text();
      const data = JSON.parse(text);

      // Check if it's an export file with wrapper
      if (data.data && Array.isArray(data.data)) {
        setFile({
          exportedAt: data.exportedAt,
          entity: data.entity,
          version: data.version,
          count: data.count,
          data: data.data,
        });
        // Auto-detect entity type from file
        if (data.entity && ENTITY_OPTIONS.find(o => o.value === data.entity)) {
          setEntityType(data.entity as NativeImportEntityType);
        }
      } else if (Array.isArray(data)) {
        // Direct array
        setFile({ data });
      } else if (data.id && (data.name || data.title || data.slug)) {
        // Single object - wrap in array
        setFile({ data: [data] });
      } else {
        alert('Formato de archivo no reconocido. Debe ser un array, un objeto con propiedad "data", o un objeto con "id" y "name/title/slug".');
        return;
      }

      setFileName(selectedFile.name);
      setValidationResult(null);
      setImportResult(null);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Error al leer el archivo JSON');
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    setValidating(true);
    setValidationResult(null);

    try {
      const result = await adminService.validateNativeImport(entityType, file);
      setValidationResult(result);
    } catch (error: any) {
      console.error('Error validating:', error);
      alert(`Error en la validacion: ${error.message || 'Error desconocido'}`);
    } finally {
      setValidating(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const result = await adminService.importNative(entityType, file, {
        conflictResolution,
        dryRun,
      });
      setImportResult(result);

      if (!dryRun && result.success) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Error importing:', error);
      alert(`Error en la importacion: ${error.message || 'Error desconocido'}`);
    } finally {
      setImporting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileName(null);
    setValidationResult(null);
    setImportResult(null);
  };

  const entityIcon = ENTITY_OPTIONS.find(o => o.value === entityType)?.icon || FileJson;
  const EntityIcon = entityIcon;

  return (
    <div className="space-y-6">
      {/* Entity Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Tipo de Entidad
          </CardTitle>
          <CardDescription>
            Selecciona el tipo de datos que quieres importar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={entityType} onValueChange={(v) => setEntityType(v as NativeImportEntityType)}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_OPTIONS.map(option => {
                const OptionIcon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <OptionIcon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Archivo de Importacion
          </CardTitle>
          <CardDescription>
            Sube un archivo JSON exportado desde el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="native-import-file"
              />
              <label
                htmlFor="native-import-file"
                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700">Seleccionar archivo JSON</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Archivos exportados desde Exportacion de Datos
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <EntityIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">{fileName}</p>
                    <p className="text-sm text-green-700">
                      {file.data.length.toLocaleString()} registros
                      {file.exportedAt && (
                        <span className="ml-2">
                          (exportado: {new Date(file.exportedAt).toLocaleDateString()})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFile}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Validacion
            </CardTitle>
            <CardDescription>
              Valida el archivo y detecta posibles conflictos antes de importar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={handleValidate} disabled={validating}>
                {validating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Validar Archivo
                  </>
                )}
              </Button>
            </div>

            {/* Validation Results */}
            {validationResult && (
              <div className="mt-4 space-y-4">
                {/* Summary */}
                <div className={`p-4 rounded-lg ${validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {validationResult.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className={`font-medium ${validationResult.isValid ? 'text-green-900' : 'text-yellow-900'}`}>
                      {validationResult.isValid ? 'Archivo valido' : 'Archivo con conflictos'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span>{' '}
                      <span className="font-medium">{validationResult.totalItems}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Nuevos:</span>{' '}
                      <span className="font-medium">{validationResult.preview.toCreate}</span>
                    </div>
                    <div>
                      <span className="text-yellow-600">Conflictos:</span>{' '}
                      <span className="font-medium">{validationResult.conflicts.length}</span>
                    </div>
                  </div>
                </div>

                {/* Conflicts Detail */}
                {validationResult.conflicts.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Conflictos Detectados ({validationResult.conflicts.length})
                    </h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {validationResult.conflicts.slice(0, 10).map((conflict, i) => (
                        <div key={i} className="text-sm p-2 bg-yellow-50 rounded">
                          <span className="font-medium">
                            {conflict.item.name || conflict.item.title || conflict.item.slug || `Item ${conflict.index + 1}`}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({conflict.conflictType === 'id_exists' ? 'ID existe' :
                              conflict.conflictType === 'slug_exists' ? 'Slug existe' : 'ID y Slug existen'})
                          </span>
                        </div>
                      ))}
                      {validationResult.conflicts.length > 10 && (
                        <div className="text-sm text-gray-500">
                          ... y {validationResult.conflicts.length - 10} conflictos mas
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Errors */}
                {validationResult.errors.length > 0 && (
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium mb-2 text-red-800 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Errores ({validationResult.errors.length})
                    </h4>
                    <div className="max-h-32 overflow-y-auto">
                      {validationResult.errors.map((error, i) => (
                        <div key={i} className="text-sm text-red-700">{error}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {validationResult.warnings.length > 0 && (
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <h4 className="font-medium mb-2 text-orange-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Advertencias ({validationResult.warnings.length})
                    </h4>
                    <div className="max-h-32 overflow-y-auto">
                      {validationResult.warnings.map((warning, i) => (
                        <div key={i} className="text-sm text-orange-700">{warning}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Options & Execute */}
      {file && validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Ejecutar Importacion
            </CardTitle>
            <CardDescription>
              Configura las opciones de importacion y ejecuta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Conflict Resolution */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium w-48">Resolucion de Conflictos:</label>
              <Select value={conflictResolution} onValueChange={(v) => setConflictResolution(v as ConflictResolution)}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">
                    <div className="flex flex-col">
                      <span>Omitir</span>
                      <span className="text-xs text-gray-500">No importar registros con conflictos</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="update">
                    <div className="flex flex-col">
                      <span>Actualizar</span>
                      <span className="text-xs text-gray-500">Sobrescribir registros existentes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="create_new">
                    <div className="flex flex-col">
                      <span>Crear Nuevo</span>
                      <span className="text-xs text-gray-500">Crear con nuevo ID/slug</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dry Run Toggle */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium w-48">Modo de Prueba:</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dryRun"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="dryRun" className="text-sm text-gray-600">
                  Simular importacion sin guardar cambios
                </label>
              </div>
            </div>

            {/* Execute Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleImport}
                disabled={importing || validationResult.errors.length > 0}
                size="lg"
                className={dryRun ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {dryRun ? 'Simulando...' : 'Importando...'}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {dryRun ? 'Simular Importacion' : 'Ejecutar Importacion'}
                  </>
                )}
              </Button>
              {!dryRun && (
                <p className="text-xs text-orange-600 mt-2">
                  Los cambios se guardaran permanentemente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResult && (
        <Card className={importResult.dryRun ? 'border-blue-200 bg-blue-50/30' : 'border-green-200 bg-green-50/30'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              {importResult.dryRun ? 'Resultado de Simulacion' : 'Resultado de Importacion'}
            </CardTitle>
            {importResult.dryRun && (
              <CardDescription className="text-blue-600">
                Esto es solo una simulacion - no se han guardado cambios
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <p className="text-2xl font-bold">{importResult.summary.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{importResult.summary.created}</p>
                <p className="text-xs text-green-600">Creados</p>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{importResult.summary.updated}</p>
                <p className="text-xs text-blue-600">Actualizados</p>
              </div>
              <div className="text-center p-3 bg-yellow-100 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{importResult.summary.skipped}</p>
                <p className="text-xs text-yellow-600">Omitidos</p>
              </div>
              <div className="text-center p-3 bg-red-100 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{importResult.summary.errors}</p>
                <p className="text-xs text-red-600">Errores</p>
              </div>
            </div>

            {/* Detailed Results */}
            {importResult.results.length > 0 && (
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">ID/Slug</th>
                      <th className="px-3 py-2 text-left">Accion</th>
                      <th className="px-3 py-2 text-left">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.results.slice(0, 50).map((item, i) => (
                      <tr key={i} className={`border-t ${
                        item.action === 'created' ? 'bg-green-50' :
                        item.action === 'updated' ? 'bg-blue-50' :
                        item.action === 'skipped' ? 'bg-yellow-50' : 'bg-red-50'
                      }`}>
                        <td className="px-3 py-2">{item.index + 1}</td>
                        <td className="px-3 py-2 font-mono text-xs">{item.slug || item.id?.slice(0, 8)}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            item.action === 'created' ? 'bg-green-200 text-green-800' :
                            item.action === 'updated' ? 'bg-blue-200 text-blue-800' :
                            item.action === 'skipped' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                          }`}>
                            {item.action}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">{item.message || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importResult.results.length > 50 && (
                  <div className="text-center py-2 text-sm text-gray-500 border-t">
                    ... y {importResult.results.length - 50} resultados mas
                  </div>
                )}
              </div>
            )}

            {/* Action for after dry run */}
            {importResult.dryRun && importResult.success && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  La simulacion fue exitosa. Puedes ejecutar la importacion real.
                </p>
                <Button
                  onClick={() => {
                    setDryRun(false);
                    setImportResult(null);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ejecutar Importacion Real
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como Usar el Importador Nativo</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>
              <strong>Exportar datos:</strong> Ve a "Exportacion de Datos" y descarga el JSON de la entidad que quieres importar.
            </li>
            <li>
              <strong>Seleccionar tipo:</strong> Elige el tipo de entidad que corresponde al archivo.
            </li>
            <li>
              <strong>Subir archivo:</strong> Sube el archivo JSON exportado.
            </li>
            <li>
              <strong>Validar:</strong> Valida el archivo para detectar conflictos antes de importar.
            </li>
            <li>
              <strong>Configurar:</strong> Elige como resolver conflictos (omitir, actualizar, crear nuevo).
            </li>
            <li>
              <strong>Simular:</strong> Ejecuta primero en modo de prueba para ver que pasaria.
            </li>
            <li>
              <strong>Importar:</strong> Si todo esta correcto, ejecuta la importacion real.
            </li>
          </ol>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>Orden recomendado:</strong> Para importar datos relacionados, primero importa las entidades padre:
              Eventos → Competiciones → Ediciones
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ImportPage() {
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
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
      alert(`Error en la importacion: ${error.message || 'Error desconocido'}`);
    } finally {
      setImporting(false);
    }
  };

  const handleEnsureTerrainTypes = async () => {
    try {
      const result = await adminService.ensureTerrainTypes();
      alert(`Tipos de terreno: ${result.created} creados, ${result.skipped} ya existian`);
      await fetchStats();
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Error desconocido'}`);
    }
  };

  const handleDelete = async (type: 'competitions' | 'events' | 'series' | 'organizers' | 'editions' | 'all') => {
    const messages: Record<string, string> = {
      competitions: 'Eliminar TODAS las competiciones? Esto tambien eliminara ediciones relacionadas.',
      events: 'Eliminar TODOS los eventos? Esto tambien eliminara competiciones y ediciones.',
      series: 'Eliminar TODAS las series especiales?',
      organizers: 'Eliminar TODOS los organizadores?',
      editions: 'Eliminar TODAS las ediciones?',
      all: 'Eliminar TODOS los datos importados (organizadores, series, eventos, competiciones)?',
    };

    if (!confirm(messages[type])) return;

    setDeleting(type);
    try {
      let result;
      switch (type) {
        case 'competitions':
          result = await adminService.deleteAllCompetitions();
          alert(`${result.deleted} competiciones eliminadas`);
          break;
        case 'events':
          result = await adminService.deleteAllEvents();
          alert(`${result.deleted} eventos eliminados`);
          break;
        case 'series':
          result = await adminService.deleteAllSeries();
          alert(`${result.deleted} series eliminadas`);
          break;
        case 'organizers':
          result = await adminService.deleteAllOrganizers();
          alert(`${result.deleted} organizadores eliminados`);
          break;
        case 'editions':
          result = await adminService.deleteAllEditions();
          alert(`${result.deleted} ediciones eliminadas`);
          break;
        case 'all':
          result = await adminService.deleteAllImportedData();
          alert(`Eliminados: ${result.competitions} competiciones, ${result.events} eventos, ${result.series} series, ${result.organizers} organizadores`);
          break;
      }
      await fetchStats();
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setDeleting(null);
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
          <h1 className="text-2xl font-bold">Importacion de Datos</h1>
          <p className="text-gray-500">Importa datos desde diferentes fuentes</p>
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
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">No se pudieron cargar las estadisticas</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for different import methods */}
      <Tabs defaultValue="native" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="native" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Importador Nativo
          </TabsTrigger>
          <TabsTrigger value="wordpress" className="flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            Importador WordPress
          </TabsTrigger>
        </TabsList>

        {/* Native Import Tab */}
        <TabsContent value="native">
          <NativeImportTab onImportComplete={fetchStats} />
        </TabsContent>

        {/* WordPress Import Tab */}
        <TabsContent value="wordpress" className="space-y-6">
          {/* Terrain Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                Tipos de Terreno
              </CardTitle>
              <CardDescription>
                Asegura que los tipos de terreno necesarios para la importacion existan
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
                Archivos de Importacion
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
                          Iniciar Importacion
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
                  Resultados de la Importacion
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
              <CardTitle>Instrucciones de Importacion WordPress</CardTitle>
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
                  <strong>Iniciar importacion:</strong> Haz clic en "Iniciar Importacion" para
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
                  ID) seran omitidos automaticamente. La importacion es segura de ejecutar multiples
                  veces.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone - Collapsible Delete Section */}
      <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Zona de Peligro - Eliminar Datos</span>
              </div>
              <ChevronDown className="w-5 h-5 text-red-400" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="border-red-200 mt-4 bg-red-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Eliminar Datos Importados
                </CardTitle>
                <CardDescription>
                  Elimina datos importados para poder reimportar con correcciones. Esta accion no se puede deshacer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete('editions')}
                    disabled={deleting !== null}
                  >
                    {deleting === 'editions' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4 mr-2" />
                    )}
                    Ediciones
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete('competitions')}
                    disabled={deleting !== null}
                  >
                    {deleting === 'competitions' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trophy className="w-4 h-4 mr-2" />
                    )}
                    Competiciones
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete('events')}
                    disabled={deleting !== null}
                  >
                    {deleting === 'events' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 mr-2" />
                    )}
                    Eventos
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete('series')}
                    disabled={deleting !== null}
                  >
                    {deleting === 'series' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Award className="w-4 h-4 mr-2" />
                    )}
                    Series
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete('organizers')}
                    disabled={deleting !== null}
                  >
                    {deleting === 'organizers' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Building2 className="w-4 h-4 mr-2" />
                    )}
                    Organizadores
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete('all')}
                    disabled={deleting !== null}
                  >
                    {deleting === 'all' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Eliminar Todo
                  </Button>
                </div>
                <p className="text-xs text-red-600 mt-3">
                  Nota: Eliminar eventos tambien elimina sus competiciones. Eliminar competiciones tambien elimina sus ediciones.
                </p>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
