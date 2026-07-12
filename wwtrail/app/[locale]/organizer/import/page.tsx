'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SearchableEntitySelect from '@/components/SearchableEntitySelect';
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
import { terrainTypesService, specialSeriesService } from '@/lib/api/catalogs.service';
import type { TerrainType, SpecialSeries } from '@/types/catalog';

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
  const t = useTranslations('boMisc');
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      onFileSelect(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert(t('importErrorReadJson'));
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
        <span className="text-sm">{t('importSelectFile')}</span>
      </label>
      {fileName && (
        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
          <FileJson className="w-4 h-4" />
          <span>{t('importRecordsCount', { count: count ?? 0 })}</span>
        </div>
      )}
    </div>
  );
}

// Result Card Component
function ResultCard({ title, result }: { title: string; result: ImportResult }) {
  const t = useTranslations('boMisc');
  const hasErrors = result.errors.length > 0;

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-green-600">
          <span className="font-bold">{result.created}</span> {t('importResultCreated')}
        </div>
        <div className="text-yellow-600">
          <span className="font-bold">{result.skipped}</span> {t('importResultSkipped')}
        </div>
        <div className={hasErrors ? 'text-red-600' : 'text-gray-400'}>
          <span className="font-bold">{result.errors.length}</span> {t('importResultErrors')}
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
              {t('importMoreErrors', { count: result.errors.length - 5 })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// MASTER DATA REFERENCE COMPONENT
// ============================================

function MasterDataReference() {
  const t = useTranslations('boMisc');
  const [terrainTypes, setTerrainTypes] = useState<TerrainType[]>([]);
  const [specialSeries, setSpecialSeries] = useState<SpecialSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTerrainTypes, setShowTerrainTypes] = useState(false);
  const [showSpecialSeries, setShowSpecialSeries] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tt, ss] = await Promise.all([
        terrainTypesService.getAll(),
        specialSeriesService.getAll(),
      ]);
      // Defensive unwrap: guard against apiSuccess wrapper
      setTerrainTypes(Array.isArray(tt) ? tt : Array.isArray((tt as any)?.data) ? (tt as any).data : []);
      setSpecialSeries(Array.isArray(ss) ? ss : Array.isArray((ss as any)?.data) ? (ss as any).data : []);
    } catch (error) {
      console.error('Error loading master data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const downloadJson = (data: any[], filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    a.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  // Format data for import (only id, name, slug)
  const formatForImport = (items: any[]) =>
    items.map(({ id, name, slug }) => ({ id, name, slug }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          {t('importMasterDataTitle')}
        </CardTitle>
        <CardDescription>
          {t('importMasterDataDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Terrain Types */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowTerrainTypes(!showTerrainTypes)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">{t('importTerrainTypesTitle')}</span>
                  <span className="text-sm text-gray-500">({terrainTypes.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showTerrainTypes ? 'rotate-180' : ''}`} />
              </button>
              {showTerrainTypes && (
                <div className="p-3 border-t">
                  <div className="flex justify-end mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadJson(formatForImport(terrainTypes), 'terrain_types.json')}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {t('importDownloadJson')}
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">{t('importColId')}</th>
                          <th className="px-2 py-1 text-left">{t('importColName')}</th>
                          <th className="px-2 py-1 text-left">{t('importColSlug')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {terrainTypes.map((tt) => (
                          <tr key={tt.id} className="border-t">
                            <td className="px-2 py-1 font-mono text-xs">{tt.id.slice(0, 8)}...</td>
                            <td className="px-2 py-1">{tt.name}</td>
                            <td className="px-2 py-1 font-mono text-xs text-gray-600">{tt.slug}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                    <strong>{t('importUsageJson')}</strong> <code className="bg-blue-100 px-1 rounded">{`"terrainType": { "id": "...", "name": "Alta montaña", "slug": "alta-montana" }`}</code>
                  </div>
                </div>
              )}
            </div>

            {/* Special Series */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowSpecialSeries(!showSpecialSeries)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">{t('importSpecialSeriesTitle')}</span>
                  <span className="text-sm text-gray-500">({specialSeries.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showSpecialSeries ? 'rotate-180' : ''}`} />
              </button>
              {showSpecialSeries && (
                <div className="p-3 border-t">
                  <div className="flex justify-end mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadJson(formatForImport(specialSeries), 'special_series.json')}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {t('importDownloadJson')}
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">{t('importColId')}</th>
                          <th className="px-2 py-1 text-left">{t('importColName')}</th>
                          <th className="px-2 py-1 text-left">{t('importColSlug')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specialSeries.map((ss) => (
                          <tr key={ss.id} className="border-t">
                            <td className="px-2 py-1 font-mono text-xs">{ss.id.slice(0, 8)}...</td>
                            <td className="px-2 py-1">{ss.name}</td>
                            <td className="px-2 py-1 font-mono text-xs text-gray-600">{ss.slug}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-800">
                    <strong>{t('importUsageJson')}</strong> <code className="bg-purple-100 px-1 rounded">{`"specialSeries": [{ "id": "...", "name": "UTMB World Series", "slug": "utmb-world-series" }]`}</code>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// NATIVE IMPORT TAB COMPONENT
// ============================================

const ENTITY_OPTIONS: { value: NativeImportEntityType; label: string; icon: React.ElementType }[] = [
  { value: 'events', label: 'importEntityEvents', icon: MapPin },
  { value: 'competitions', label: 'importEntityCompetitions', icon: Trophy },
  { value: 'editions', label: 'importEntityEditions', icon: Calendar },
  { value: 'organizers', label: 'importEntityOrganizers', icon: Briefcase },
  { value: 'specialSeries', label: 'importEntitySpecialSeries', icon: Sparkles },
  { value: 'services', label: 'importEntityServices', icon: Building2 },
  { value: 'posts', label: 'importEntityPosts', icon: FileText },
];

// Example JSON structures for each entity type
const EXAMPLE_JSON: Record<NativeImportEntityType, object> = {
  events: {
    id: "cuid_example_event_123",
    slug: "ultra-trail-barcelona",
    name: "Ultra Trail Barcelona",
    description: "Descripcion del evento...",
    shortDescription: "Descripcion corta",
    country: "ES",
    region: "Catalunya",
    city: "Barcelona",
    latitude: 41.3851,
    longitude: 2.1734,
    website: "https://example.com",
    email: "info@example.com",
    phone: "+34 600 000 000",
    featured: false,
    status: "PUBLISHED",
    organizer: {
      id: "organizer_id",
      name: "Nombre Organizador",
      slug: "nombre-organizador"
    },
    competitions: [
      { id: "comp_id", name: "Competicion", slug: "competicion" }
    ]
  },
  competitions: {
    id: "cuid_example_comp_123",
    slug: "ultra-trail-100k",
    name: "Ultra Trail 100K",
    description: "Descripcion de la competicion...",
    shortDescription: "Descripcion corta",
    distance: 100,
    elevation: 5000,
    itra: 5,
    utmbIndex: "INDEX_100K",  // Valores: INDEX_20K, INDEX_50K, INDEX_100K, INDEX_100M
    featured: false,
    status: "PUBLISHED",
    event: {
      id: "event_id",
      name: "Nombre Evento",
      slug: "nombre-evento"
    },
    specialSeries: [
      { id: "series_id", name: "UTMB World Series Events", slug: "utmb-world-series-events" }
    ],
    terrainType: {
      id: "terrain_id",
      name: "Montana",
      slug: "montana"
    },
    editions: [
      { id: "edition_id", year: 2024, slug: "2024" }
    ]
  },
  editions: {
    id: "cuid_example_edition_123",
    slug: "2024",
    year: 2024,
    date: "2024-06-15T08:00:00.000Z",
    registrationStart: "2024-01-15T00:00:00.000Z",
    registrationEnd: "2024-05-31T23:59:59.000Z",
    price: 150,
    currency: "EUR",
    maxParticipants: 500,
    latitude: 41.3851,
    longitude: 2.1734,
    status: "PUBLISHED",
    competition: {
      id: "competition_id",
      name: "Ultra Trail 100K",
      slug: "ultra-trail-100k",
      event: {
        id: "event_id",
        name: "Ultra Trail Barcelona",
        slug: "ultra-trail-barcelona"
      }
    }
  },
  organizers: {
    id: "cuid_example_org_123",
    slug: "trail-running-events",
    name: "Trail Running Events",
    description: "Organizador de eventos de trail...",
    website: "https://trailrunningevents.com",
    email: "info@trailrunningevents.com",
    phone: "+34 600 000 000",
    logo: "https://example.com/logo.png",
    country: "ES",
    region: "Catalunya",
    city: "Barcelona",
    events: [
      { id: "event_id", name: "Evento 1", slug: "evento-1" }
    ]
  },
  specialSeries: {
    id: "cuid_example_series_123",
    slug: "utmb-world-series",
    name: "UTMB World Series",
    description: "Circuito mundial de ultra trail...",
    logo: "https://example.com/utmb-logo.png",
    website: "https://utmb.world",
    competitions: [
      { id: "comp_id", name: "Competicion", slug: "competicion" }
    ]
  },
  services: {
    id: "cuid_example_service_123",
    slug: "fisioterapia-deportiva",
    name: "Fisioterapia Deportiva BCN",
    description: "Servicios de fisioterapia para corredores...",
    website: "https://fisio-bcn.com",
    email: "info@fisio-bcn.com",
    phone: "+34 600 000 000",
    latitude: 41.3851,
    longitude: 2.1734,
    address: "Calle Ejemplo 123",
    city: "Barcelona",
    country: "ES",
    category: {
      id: "category_id",
      name: "Fisioterapia",
      slug: "fisioterapia"
    }
  },
  posts: {
    id: "cuid_example_post_123",
    slug: "guia-entrenamiento-ultra",
    title: "Guia de Entrenamiento para Ultra Trail",
    content: "Contenido del articulo...",
    excerpt: "Extracto breve del articulo",
    featuredImage: "https://example.com/image.jpg",
    status: "PUBLISHED",
    publishedAt: "2024-01-15T10:00:00.000Z",
    author: {
      id: "user_id",
      email: "autor@example.com",
      username: "autor"
    },
    tags: [
      { id: "tag_id", name: "Entrenamiento", slug: "entrenamiento" }
    ],
    event: {
      id: "event_id",
      name: "Evento Relacionado",
      slug: "evento-relacionado"
    }
  }
};

// Component to show example JSON and allow download
function ExampleJsonSection({ entityType }: { entityType: NativeImportEntityType }) {
  const t = useTranslations('boMisc');
  const [showExample, setShowExample] = useState(false);
  const example = EXAMPLE_JSON[entityType];
  const exampleArray = [example]; // Export format is an array

  const downloadExample = () => {
    const blob = new Blob([JSON.stringify(exampleArray, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ejemplo_${entityType}.json`;
    a.style.display = 'none';
    // Click without appending to DOM to avoid React hydration issues
    a.click();
    // Clean up blob URL after a short delay
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <FileJson className="w-4 h-4 text-blue-600" />
          {t('importExpectedJsonFormat')}
        </h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExample(!showExample)}
          >
            <Eye className="w-3 h-3 mr-1" />
            {showExample ? t('importHide') : t('importViewExample')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadExample}
          >
            <Download className="w-3 h-3 mr-1" />
            {t('importDownload')}
          </Button>
        </div>
      </div>

      {showExample && (
        <div className="mt-3">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-80 overflow-y-auto">
            {JSON.stringify(exampleArray, null, 2)}
          </pre>
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <p><strong>{t('importNote')}</strong> {t('importFileMustBeArray')}</p>
            {entityType === 'competitions' && (
              <>
                <p><strong>utmbIndex:</strong> {t('importUtmbIndexNote')}</p>
                <p><strong>specialSeries:</strong> {t('importSpecialSeriesNote')}</p>
              </>
            )}
            {entityType === 'events' && (
              <p><strong>organizer:</strong> {t('importOrganizerNote')}</p>
            )}
            {entityType === 'editions' && (
              <p><strong>competition:</strong> {t('importCompetitionNote')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NativeImportTab({ onImportComplete }: { onImportComplete: () => void }) {
  const t = useTranslations('boMisc');
  const [entityType, setEntityType] = useState<NativeImportEntityType>('events');
  const [file, setFile] = useState<NativeImportFile | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<NativeValidationResult | null>(null);
  const [importResult, setImportResult] = useState<NativeImportResult | null>(null);
  const [conflictResolution, setConflictResolution] = useState<ConflictResolution>('skip');
  const [dryRun, setDryRun] = useState(true);

  // Parent entity selector
  const [parentId, setParentId] = useState<string>('');
  const [parentEntities, setParentEntities] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loadingParents, setLoadingParents] = useState(false);

  // Cascade selectors for editions: Event -> Competition
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventsList, setEventsList] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Load events list for editions cascade
  useEffect(() => {
    const loadEventsList = async () => {
      if (entityType === 'editions') {
        setLoadingEvents(true);
        try {
          const events = await adminService.getEventsForSelector();
          setEventsList(events);
        } catch (error) {
          console.error('Error loading events for cascade:', error);
          setEventsList([]);
        } finally {
          setLoadingEvents(false);
        }
      } else {
        setEventsList([]);
        setSelectedEventId('');
      }
    };
    loadEventsList();
  }, [entityType]);

  // Load parent entities when entity type or selected event changes
  useEffect(() => {
    const loadParentEntities = async () => {
      if (entityType === 'competitions') {
        setLoadingParents(true);
        try {
          const events = await adminService.getEventsForSelector();
          setParentEntities(events);
        } catch (error) {
          console.error('Error loading events:', error);
          setParentEntities([]);
        } finally {
          setLoadingParents(false);
        }
      } else if (entityType === 'editions') {
        // For editions, only load competitions when an event is selected
        if (selectedEventId) {
          setLoadingParents(true);
          try {
            const competitions = await adminService.getCompetitionsForSelector(selectedEventId);
            setParentEntities(competitions);
          } catch (error) {
            console.error('Error loading competitions:', error);
            setParentEntities([]);
          } finally {
            setLoadingParents(false);
          }
        } else {
          setParentEntities([]);
        }
        // Reset parent selection when event changes
        setParentId('');
      } else {
        setParentEntities([]);
        setParentId('');
      }
    };
    loadParentEntities();
  }, [entityType, selectedEventId]);

  // Check if parent selector should be shown
  const needsParentSelector = entityType === 'competitions' || entityType === 'editions';
  const parentLabel = entityType === 'competitions' ? t('importEvento') : t('importCompeticion');

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
        alert(t('importUnrecognizedFormat'));
        return;
      }

      setFileName(selectedFile.name);
      setValidationResult(null);
      setImportResult(null);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert(t('importErrorReadJson'));
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
      alert(t('importValidationError', { error: error.message || t('importUnknownError') }));
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
        parentId: parentId || undefined,
      });
      setImportResult(result);

      if (!dryRun && result.success) {
        onImportComplete();
      }
    } catch (error: any) {
      console.error('Error importing:', error);
      alert(t('importImportError', { error: error.message || t('importUnknownError') }));
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
      {/* Master Data Reference */}
      <MasterDataReference />

      {/* Entity Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {t('importEntityTypeTitle')}
          </CardTitle>
          <CardDescription>
            {t('importEntityTypeDesc')}
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
                      {t(option.label)}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Parent Entity Selector - shown for competitions */}
          {entityType === 'competitions' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                {t('importParentEventLabel')}
              </label>
              <p className="text-xs text-blue-700 mb-3">
                {t('importParentEventHelp')}
              </p>
              <SearchableEntitySelect
                value={parentId}
                onChange={setParentId}
                options={parentEntities}
                placeholder={t('importSelectEvent')}
                emptyOptionLabel={t('importEmptyUseJsonRef')}
                loading={loadingParents}
              />
              {parentId && (
                <p className="mt-2 text-xs text-green-700">
                  {t('importAllCompsToEvent')}
                </p>
              )}
            </div>
          )}

          {/* Cascade Selectors for Editions - Event -> Competition */}
          {entityType === 'editions' && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  {t('importStep1SelectEvent')}
                </label>
                <p className="text-xs text-blue-700 mb-3">
                  {t('importFilterCompsHelp')}
                </p>
                <SearchableEntitySelect
                  value={selectedEventId}
                  onChange={setSelectedEventId}
                  options={eventsList}
                  placeholder={t('importSelectEvent')}
                  emptyOptionLabel={t('importEmptyNoSelection')}
                  loading={loadingEvents}
                />
              </div>

              {selectedEventId && (
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    {t('importStep2SelectComp')}
                  </label>
                  <p className="text-xs text-blue-700 mb-3">
                    {t('importSelectCompHelp')}
                  </p>
                  <SearchableEntitySelect
                    value={parentId}
                    onChange={setParentId}
                    options={parentEntities}
                    placeholder={t('importSelectComp')}
                    emptyOptionLabel={t('importEmptyUseJsonRef')}
                    loading={loadingParents}
                  />
                  {parentId && (
                    <p className="mt-2 text-xs text-green-700">
                      {t('importAllEditionsToComp')}
                    </p>
                  )}
                </div>
              )}

              {!selectedEventId && (
                <p className="text-xs text-amber-700">
                  {t('importNoEventJsonHelp')}
                </p>
              )}
            </div>
          )}

          {/* Example JSON Section - show for selected entity */}
          <div className="mt-4">
            <ExampleJsonSection entityType={entityType} />
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {t('importFileTitle')}
          </CardTitle>
          <CardDescription>
            {t('importFileDesc')}
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
                  <span className="text-sm font-medium text-gray-700">{t('importSelectJsonFile')}</span>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('importFilesFromExport')}
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
                      {t('importRecordsCount', { count: file.data.length })}
                      {file.exportedAt && (
                        <span className="ml-2">
                          {t('importExportedOn', { date: new Date(file.exportedAt).toLocaleDateString() })}
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
              {t('importValidationTitle')}
            </CardTitle>
            <CardDescription>
              {t('importValidationDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={handleValidate} disabled={validating}>
                {validating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('importValidating')}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    {t('importValidateFile')}
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
                      {validationResult.isValid ? t('importFileValid') : t('importFileWithConflicts')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">{t('importTotalLabel')}</span>{' '}
                      <span className="font-medium">{validationResult.totalItems}</span>
                    </div>
                    <div>
                      <span className="text-green-600">{t('importNewLabel')}</span>{' '}
                      <span className="font-medium">{validationResult.preview.toCreate}</span>
                    </div>
                    <div>
                      <span className="text-yellow-600">{t('importConflictsLabel')}</span>{' '}
                      <span className="font-medium">{validationResult.conflicts?.length ?? 0}</span>
                    </div>
                  </div>
                </div>

                {/* Conflicts Detail */}
                {validationResult.conflicts && validationResult.conflicts.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      {t('importConflictsDetected', { count: validationResult.conflicts.length })}
                    </h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {validationResult.conflicts.slice(0, 10).map((conflict, i) => (
                        <div key={i} className="text-sm p-2 bg-yellow-50 rounded">
                          <span className="font-medium">
                            {conflict.name || conflict.slug || t('importItemN', { number: conflict.index + 1 })}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({conflict.conflictType === 'id_exists' ? t('importIdExists') :
                              conflict.conflictType === 'slug_exists' ? t('importSlugExists') : t('importIdAndSlugExist')})
                          </span>
                        </div>
                      ))}
                      {validationResult.conflicts.length > 10 && (
                        <div className="text-sm text-gray-500">
                          {t('importMoreConflicts', { count: validationResult.conflicts.length - 10 })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Errors */}
                {validationResult.errors && validationResult.errors.length > 0 && (
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-medium mb-2 text-red-800 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      {t('importErrorsCount', { count: validationResult.errors.length })}
                    </h4>
                    <div className="max-h-32 overflow-y-auto">
                      {validationResult.errors.map((error, i) => (
                        <div key={i} className="text-sm text-red-700">{error}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {validationResult.warnings && validationResult.warnings.length > 0 && (
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <h4 className="font-medium mb-2 text-orange-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {t('importWarningsCount', { count: validationResult.warnings.length })}
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
              {t('importExecuteImportTitle')}
            </CardTitle>
            <CardDescription>
              {t('importExecuteDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Conflict Resolution */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium w-48">{t('importConflictResolutionLabel')}</label>
              <Select value={conflictResolution} onValueChange={(v) => setConflictResolution(v as ConflictResolution)}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">
                    <div className="flex flex-col">
                      <span>{t('importOptSkip')}</span>
                      <span className="text-xs text-gray-500">{t('importOptSkipDesc')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="update">
                    <div className="flex flex-col">
                      <span>{t('importOptUpdate')}</span>
                      <span className="text-xs text-gray-500">{t('importOptUpdateDesc')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="create_new">
                    <div className="flex flex-col">
                      <span>{t('importOptCreateNew')}</span>
                      <span className="text-xs text-gray-500">{t('importOptCreateNewDesc')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dry Run Toggle */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium w-48">{t('importTestModeLabel')}</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dryRun"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="dryRun" className="text-sm text-gray-600">
                  {t('importTestModeCheckbox')}
                </label>
              </div>
            </div>

            {/* Execute Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleImport}
                disabled={importing || (validationResult.errors?.length ?? 0) > 0}
                size="lg"
                className={dryRun ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {dryRun ? t('importSimulating') : t('importImporting')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {dryRun ? t('importSimulateImport') : t('importExecuteImport')}
                  </>
                )}
              </Button>
              {!dryRun && (
                <p className="text-xs text-orange-600 mt-2">
                  {t('importChangesPermanent')}
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
              {importResult.dryRun ? t('importSimulationResult') : t('importImportResult')}
            </CardTitle>
            {importResult.dryRun && (
              <CardDescription className="text-blue-600">
                {t('importSimulationNoChanges')}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <p className="text-2xl font-bold">{importResult.summary?.total ?? 0}</p>
                <p className="text-xs text-gray-500">{t('importTotal')}</p>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{importResult.summary?.created ?? 0}</p>
                <p className="text-xs text-green-600">{t('importCreatedCap')}</p>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{importResult.summary?.updated ?? 0}</p>
                <p className="text-xs text-blue-600">{t('importUpdated')}</p>
              </div>
              <div className="text-center p-3 bg-yellow-100 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{importResult.summary?.skipped ?? 0}</p>
                <p className="text-xs text-yellow-600">{t('importSkippedCap')}</p>
              </div>
              <div className="text-center p-3 bg-red-100 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{importResult.summary?.errors ?? 0}</p>
                <p className="text-xs text-red-600">{t('importErrorsCap')}</p>
              </div>
            </div>

            {/* Detailed Results */}
            {importResult.results && importResult.results.length > 0 && (
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">{t('importColIdSlug')}</th>
                      <th className="px-3 py-2 text-left">{t('importColAction')}</th>
                      <th className="px-3 py-2 text-left">{t('importColMessage')}</th>
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
                    {t('importMoreResults', { count: importResult.results.length - 50 })}
                  </div>
                )}
              </div>
            )}

            {/* Action for after dry run */}
            {importResult.dryRun && importResult.success && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t('importSimulationSuccess')}
                </p>
                <Button
                  onClick={() => {
                    setDryRun(false);
                    setImportResult(null);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('importExecuteRealImport')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('importHowToUseNative')}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>
              <strong>{t('importInstr1Bold')}</strong> {t('importInstr1Text')}
            </li>
            <li>
              <strong>{t('importInstr2Bold')}</strong> {t('importInstr2Text')}
            </li>
            <li>
              <strong>{t('importInstr3Bold')}</strong> {t('importInstr3Text')}
            </li>
            <li>
              <strong>{t('importInstr4Bold')}</strong> {t('importInstr4Text')}
            </li>
            <li>
              <strong>{t('importInstr5Bold')}</strong> {t('importInstr5Text')}
            </li>
            <li>
              <strong>{t('importInstr6Bold')}</strong> {t('importInstr6Text')}
            </li>
            <li>
              <strong>{t('importInstr7Bold')}</strong> {t('importInstr7Text')}
            </li>
          </ol>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              <strong>{t('importRecommendedOrderBold')}</strong> {t('importRecommendedOrderText')}
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
  const t = useTranslations('boMisc');
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<FullImportResult | null>(null);
  const [showDangerZone, setShowDangerZone] = useState(false);
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
      alert(t('importNoDataToImport'));
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
      alert(t('importImportError', { error: error.message || t('importUnknownError') }));
    } finally {
      setImporting(false);
    }
  };

  const handleEnsureTerrainTypes = async () => {
    try {
      const result = await adminService.ensureTerrainTypes();
      alert(t('importTerrainResult', { created: result.created, skipped: result.skipped }));
      await fetchStats();
    } catch (error: any) {
      console.error('Error:', error);
      alert(t('importGenericError', { error: error.message || t('importUnknownError') }));
    }
  };

  const handleDelete = async (type: 'competitions' | 'events' | 'series' | 'organizers' | 'editions' | 'all') => {
    const messages: Record<string, string> = {
      competitions: t('importDeleteCompetitionsConfirm'),
      events: t('importDeleteEventsConfirm'),
      series: t('importDeleteSeriesConfirm'),
      organizers: t('importDeleteOrganizersConfirm'),
      editions: t('importDeleteEditionsConfirm'),
      all: t('importDeleteAllConfirm'),
    };

    if (!confirm(messages[type])) return;

    setDeleting(type);
    try {
      let result;
      switch (type) {
        case 'competitions':
          result = await adminService.deleteAllCompetitions();
          alert(t('importDeletedCompetitions', { count: result.deleted }));
          break;
        case 'events':
          result = await adminService.deleteAllEvents();
          alert(t('importDeletedEvents', { count: result.deleted }));
          break;
        case 'series':
          result = await adminService.deleteAllSeries();
          alert(t('importDeletedSeries', { count: result.deleted }));
          break;
        case 'organizers':
          result = await adminService.deleteAllOrganizers();
          alert(t('importDeletedOrganizers', { count: result.deleted }));
          break;
        case 'editions':
          result = await adminService.deleteAllEditions();
          alert(t('importDeletedEditions', { count: result.deleted }));
          break;
        case 'all':
          result = await adminService.deleteAllImportedData();
          alert(t('importDeletedAll', { competitions: result.competitions, events: result.events, series: result.series, organizers: result.organizers }));
          break;
      }
      await fetchStats();
    } catch (error: any) {
      console.error('Error:', error);
      alert(t('importGenericError', { error: error.message || t('importUnknownError') }));
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
          <h1 className="text-2xl font-bold">{t('importPageTitle')}</h1>
          <p className="text-gray-500">{t('importPageSubtitle')}</p>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('importRefresh')}
        </Button>
      </div>

      {/* Current Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {t('importDbStatusTitle')}
          </CardTitle>
          <CardDescription>{t('importDbStatusDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard
                title={t('importStatOrganizers')}
                value={stats.organizers}
                icon={Building2}
                color="blue"
              />
              <StatCard
                title={t('importStatSeries')}
                value={stats.specialSeries}
                icon={Award}
                color="purple"
              />
              <StatCard title={t('importStatEvents')} value={stats.events} icon={MapPin} color="green" />
              <StatCard
                title={t('importStatCompetitions')}
                value={stats.competitions}
                icon={Trophy}
                color="yellow"
              />
              <StatCard
                title={t('importStatTerrainTypes')}
                value={stats.terrainTypes}
                icon={Mountain}
                color="orange"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium">{t('importErrorLabel')}</p>
                <p className="text-sm">{t('importStatsLoadError')}</p>
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
            {t('importNativeTab')}
          </TabsTrigger>
          <TabsTrigger value="wordpress" className="flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            {t('importWordpressTab')}
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
                {t('importTerrainTypesTitle')}
              </CardTitle>
              <CardDescription>
                {t('importEnsureTerrainDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleEnsureTerrainTypes} variant="outline">
                <Mountain className="w-4 h-4 mr-2" />
                {t('importCreateTerrainTypes')}
              </Button>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {t('importFilesTitle')}
              </CardTitle>
              <CardDescription>
                {t('importFilesWpDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FileUpload
                  label={t('importStatOrganizers')}
                  fileName={importData.organizers ? 'organizers.json' : null}
                  count={importData.organizers?.length || null}
                  onFileSelect={(data) => setImportData((prev) => ({ ...prev, organizers: data }))}
                  icon={Building2}
                />
                <FileUpload
                  label={t('importStatSeries')}
                  fileName={importData.series ? 'series.json' : null}
                  count={importData.series?.length || null}
                  onFileSelect={(data) => setImportData((prev) => ({ ...prev, series: data }))}
                  icon={Award}
                />
                <FileUpload
                  label={t('importStatEvents')}
                  fileName={importData.events ? 'events.json' : null}
                  count={importData.events?.length || null}
                  onFileSelect={(data) => setImportData((prev) => ({ ...prev, events: data }))}
                  icon={MapPin}
                />
                <FileUpload
                  label={t('importStatCompetitions')}
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
                        {t('importRecordsReady', { count: totalToImport })}
                      </p>
                      <p className="text-sm text-blue-700">
                        {t('importRecordsBreakdown', {
                          organizers: importData.organizers?.length || 0,
                          series: importData.series?.length || 0,
                          events: importData.events?.length || 0,
                          competitions: importData.competitions?.length || 0,
                        })}
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
                          {t('importImporting')}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          {t('importStartImport')}
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
                  {t('importResultsTitle')}
                </CardTitle>
                <CardDescription>
                  {t('importRecordsImported', { count: totalImported })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {importResult.terrainTypes && (
                    <ResultCard title={t('importTerrainTypesTitle')} result={importResult.terrainTypes} />
                  )}
                  {importResult.organizers && (
                    <ResultCard title={t('importStatOrganizers')} result={importResult.organizers} />
                  )}
                  {importResult.series && <ResultCard title={t('importStatSeries')} result={importResult.series} />}
                  {importResult.events && <ResultCard title={t('importStatEvents')} result={importResult.events} />}
                  {importResult.competitions && (
                    <ResultCard title={t('importStatCompetitions')} result={importResult.competitions} />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('importWpInstructionsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  <strong>{t('importWpInstr1Bold')}</strong> {t('importWpInstr1Text')}
                </li>
                <li>
                  <strong>{t('importWpInstr2Bold')}</strong> {t('importWpInstr2Text')}
                </li>
                <li>
                  <strong>{t('importWpInstr3Bold')}</strong> {t('importWpInstr3Text')}
                </li>
                <li>
                  <strong>{t('importWpInstr4Bold')}</strong> {t('importWpInstr4Text')}
                </li>
              </ol>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>{t('importWpNoteBold')}</strong> {t('importWpNoteText')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone - Collapsible Delete Section */}
      <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-4 hover:bg-red-50 border border-red-200 rounded-lg"
          onClick={() => setShowDangerZone(!showDangerZone)}
        >
          <div className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">{t('importDangerZone')}</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-red-400 transition-transform ${showDangerZone ? 'rotate-180' : ''}`} />
        </Button>

        {showDangerZone && (
          <Card className="border-red-200 mt-4 bg-red-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                {t('importDeleteImportedTitle')}
              </CardTitle>
              <CardDescription>
                {t('importDeleteImportedDesc')}
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
                  {t('importEditionsLabel')}
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
                  {t('importStatCompetitions')}
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
                  {t('importStatEvents')}
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
                  {t('importStatSeries')}
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
                  {t('importStatOrganizers')}
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
                  {t('importDeleteAll')}
                </Button>
              </div>
              <p className="text-xs text-red-600 mt-3">
                {t('importDangerNote')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
