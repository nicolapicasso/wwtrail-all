'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  Database,
  Building2,
  Award,
  MapPin,
  Trophy,
  Calendar,
  RefreshCw,
  FileJson,
  Loader2,
  Users,
  FileText,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { adminService } from '@/lib/api/admin.service';
import { useTranslations } from 'next-intl';

interface ExportStats {
  events: number;
  competitions: number;
  editions: number;
  organizers: number;
  specialSeries: number;
  services: number;
  posts: number;
  users: number;
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  onExport,
  exporting,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'indigo' | 'gray';
  onExport: () => void;
  exporting: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={exporting || value === 0}
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExportPage() {
  const t = useTranslations('boMisc');
  const [stats, setStats] = useState<ExportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getExportStats();
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

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExportEntity = async (entityType: 'events' | 'competitions' | 'editions' | 'organizers' | 'series' | 'services' | 'posts' | 'users') => {
    setExporting(entityType);
    try {
      const blob = await adminService.exportEntity(entityType);
      const date = new Date().toISOString().split('T')[0];
      downloadBlob(blob, `wwtrail_${entityType}_${date}.json`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert(t('exportErrorExporting'));
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = async () => {
    setExporting('all');
    try {
      const blob = await adminService.exportAll();
      const date = new Date().toISOString().split('T')[0];
      downloadBlob(blob, `wwtrail_backup_${date}.json`);
    } catch (error) {
      console.error('Error exporting:', error);
      alert(t('exportErrorExporting'));
    } finally {
      setExporting(null);
    }
  };

  const totalRecords = stats
    ? stats.events +
      stats.competitions +
      stats.editions +
      stats.organizers +
      stats.specialSeries +
      stats.services +
      stats.posts +
      stats.users
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('exportTitle')}</h1>
          <p className="text-gray-500">{t('exportSubtitle')}</p>
        </div>
        <Button variant="outline" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('exportRefresh')}
        </Button>
      </div>

      {/* Full Backup Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            {t('exportFullBackup')}
          </CardTitle>
          <CardDescription>
            {t('exportFullBackupDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-blue-900">
                {t('exportTotalRecords', { count: totalRecords.toLocaleString() })}
              </p>
              <p className="text-sm text-blue-700">
                {t('exportFullBackupIncludes')}
              </p>
            </div>
            <Button
              onClick={handleExportAll}
              disabled={exporting !== null || loading}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {exporting === 'all' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('exportExporting')}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {t('exportDownloadFullBackup')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            {t('exportByEntity')}
          </CardTitle>
          <CardDescription>
            {t('exportByEntityDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title={t('exportEventos')}
                value={stats.events}
                icon={MapPin}
                color="green"
                onExport={() => handleExportEntity('events')}
                exporting={exporting === 'events'}
              />
              <StatCard
                title={t('exportCompeticiones')}
                value={stats.competitions}
                icon={Trophy}
                color="yellow"
                onExport={() => handleExportEntity('competitions')}
                exporting={exporting === 'competitions'}
              />
              <StatCard
                title={t('exportEdiciones')}
                value={stats.editions}
                icon={Calendar}
                color="orange"
                onExport={() => handleExportEntity('editions')}
                exporting={exporting === 'editions'}
              />
              <StatCard
                title={t('exportOrganizadores')}
                value={stats.organizers}
                icon={Briefcase}
                color="blue"
                onExport={() => handleExportEntity('organizers')}
                exporting={exporting === 'organizers'}
              />
              <StatCard
                title={t('exportSeriesEspeciales')}
                value={stats.specialSeries}
                icon={Sparkles}
                color="purple"
                onExport={() => handleExportEntity('series')}
                exporting={exporting === 'series'}
              />
              <StatCard
                title={t('exportServicios')}
                value={stats.services}
                icon={Building2}
                color="pink"
                onExport={() => handleExportEntity('services')}
                exporting={exporting === 'services'}
              />
              <StatCard
                title={t('exportPosts')}
                value={stats.posts}
                icon={FileText}
                color="indigo"
                onExport={() => handleExportEntity('posts')}
                exporting={exporting === 'posts'}
              />
              <StatCard
                title={t('exportUsuarios')}
                value={stats.users}
                icon={Users}
                color="gray"
                onExport={() => handleExportEntity('users')}
                exporting={exporting === 'users'}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {t('exportErrorStats')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('exportInfoTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>{t('exportInfoFormatTitle')}</strong> {t('exportInfoFormatDesc')}
            </li>
            <li>
              <strong>{t('exportInfoRelationsTitle')}</strong> {t('exportInfoRelationsDesc')}
            </li>
            <li>
              <strong>{t('exportInfoCoordsTitle')}</strong> {t('exportInfoCoordsDesc')}
            </li>
            <li>
              <strong>{t('exportInfoUsersTitle')}</strong> {t('exportInfoUsersDesc')}
            </li>
            <li>
              <strong>{t('exportInfoUsageTitle')}</strong> {t('exportInfoUsageDesc')}
            </li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              {t.rich('exportTip', { strong: (chunks) => <strong>{chunks}</strong> })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
