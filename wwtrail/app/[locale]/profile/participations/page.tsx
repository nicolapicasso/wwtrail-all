'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Plus,
  Trophy,
  Flag,
  Calendar,
  MapPin,
  Clock,
  Medal,
  Trash2,
  Edit,
  Search,
  CheckCircle,
  XCircle,
  Mountain,
  Ruler,
  Star,
} from 'lucide-react';
import {
  userService,
  UserParticipation,
  EditionSearchResult,
  UserEditionInput,
} from '@/lib/api/user.service';

type ParticipationStatus = 'COMPLETED' | 'DNF';
type CategoryType = 'GENERAL' | 'MALE' | 'FEMALE' | 'CATEGORY' | null;

interface ParticipationFormData {
  status: ParticipationStatus;
  finishTime: string;
  position: string;
  categoryPosition: string;
  categoryType: CategoryType;
  categoryName: string;
  bibNumber: string;
  notes: string;
  personalRating: number | null;
}

const initialFormData: ParticipationFormData = {
  status: 'COMPLETED',
  finishTime: '',
  position: '',
  categoryPosition: '',
  categoryType: null,
  categoryName: '',
  bibNumber: '',
  notes: '',
  personalRating: null,
};

export default function ParticipationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('pgAccount');

  const [participations, setParticipations] = useState<UserParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Edition search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<EditionSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<EditionSearchResult | null>(null);

  // Form data
  const [formData, setFormData] = useState<ParticipationFormData>(initialFormData);
  const [editingParticipation, setEditingParticipation] = useState<UserParticipation | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch participations
  const fetchParticipations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getOwnParticipations();
      setParticipations(data);
    } catch (err: any) {
      console.error('Error fetching participations:', err);
      setError(t('errorLoadingParticipations'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchParticipations();
    }
  }, [authLoading, user, fetchParticipations]);

  // Search editions with debounce
  useEffect(() => {
    const searchEditions = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { editions } = await userService.searchEditions(searchQuery, 1, 10);
        setSearchResults(editions);
      } catch (err) {
        console.error('Error searching editions:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchEditions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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

  const handleOpenAddDialog = () => {
    setFormData(initialFormData);
    setSelectedEdition(null);
    setSearchQuery('');
    setSearchResults([]);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (participation: UserParticipation) => {
    setEditingParticipation(participation);
    setFormData({
      status: participation.status as ParticipationStatus,
      finishTime: participation.finishTime || '',
      position: participation.position?.toString() || '',
      categoryPosition: participation.categoryPosition?.toString() || '',
      categoryType: participation.categoryType as CategoryType,
      categoryName: participation.categoryName || '',
      bibNumber: '',
      notes: '',
      personalRating: null,
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (participation: UserParticipation) => {
    setEditingParticipation(participation);
    setIsDeleteDialogOpen(true);
  };

  const handleSelectEdition = (edition: EditionSearchResult) => {
    setSelectedEdition(edition);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      personalRating: prev.personalRating === rating ? null : rating,
    }));
  };

  const handleSubmitAdd = async () => {
    if (!selectedEdition) return;

    setSaving(true);
    try {
      const input: UserEditionInput = {
        status: formData.status,
        finishTime: formData.finishTime || null,
        position: formData.position ? parseInt(formData.position) : null,
        categoryPosition: formData.categoryPosition ? parseInt(formData.categoryPosition) : null,
        categoryType: formData.categoryType,
        categoryName: formData.categoryType === 'CATEGORY' ? formData.categoryName : null,
        bibNumber: formData.bibNumber || null,
        notes: formData.notes || null,
        personalRating: formData.personalRating,
      };

      await userService.upsertParticipation(selectedEdition.id, input);
      await fetchParticipations();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error('Error adding participation:', err);
      setError(err.response?.data?.message || t('errorAddingParticipation'));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingParticipation) return;

    setSaving(true);
    try {
      const input: UserEditionInput = {
        status: formData.status,
        finishTime: formData.finishTime || null,
        position: formData.position ? parseInt(formData.position) : null,
        categoryPosition: formData.categoryPosition ? parseInt(formData.categoryPosition) : null,
        categoryType: formData.categoryType,
        categoryName: formData.categoryType === 'CATEGORY' ? formData.categoryName : null,
        bibNumber: formData.bibNumber || null,
        notes: formData.notes || null,
        personalRating: formData.personalRating,
      };

      await userService.upsertParticipation(editingParticipation.editionId, input);
      await fetchParticipations();
      setIsEditDialogOpen(false);
      setEditingParticipation(null);
    } catch (err: any) {
      console.error('Error updating participation:', err);
      setError(err.response?.data?.message || t('errorUpdatingParticipation'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingParticipation) return;

    setSaving(true);
    try {
      await userService.deleteParticipation(editingParticipation.editionId);
      await fetchParticipations();
      setIsDeleteDialogOpen(false);
      setEditingParticipation(null);
    } catch (err: any) {
      console.error('Error deleting participation:', err);
      setError(err.response?.data?.message || t('errorDeletingParticipation'));
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '-';
    return time;
  };

  const getCategoryLabel = (type: string | null, name: string | null) => {
    if (!type) return '-';
    switch (type) {
      case 'GENERAL':
        return t('categoryGeneral');
      case 'MALE':
        return t('categoryMale');
      case 'FEMALE':
        return t('categoryFemale');
      case 'CATEGORY':
        return name || t('category');
      default:
        return type;
    }
  };

  // Group participations by year
  const groupedParticipations = participations.reduce(
    (acc, p) => {
      const year = p.edition.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(p);
      return acc;
    },
    {} as Record<number, UserParticipation[]>
  );

  const sortedYears = Object.keys(groupedParticipations)
    .map(Number)
    .sort((a, b) => b - a);

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
            {t('back')}
          </Button>
          <h1 className="text-4xl font-bold mb-2">{t('myParticipations')}</h1>
          <p className="text-lg opacity-90">
            {t('participationsSubtitle')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 text-sm underline mt-1"
            >
              {t('close')}
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Flag className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{participations.length}</p>
                <p className="text-sm text-gray-500">{t('totalRaces')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">
                  {participations.filter((p) => p.status === 'COMPLETED').length}
                </p>
                <p className="text-sm text-gray-500">{t('finisher')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">
                  {participations.filter((p) => p.status === 'DNF').length}
                </p>
                <p className="text-sm text-gray-500">{t('statDNF')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-black" />
                <p className="text-2xl font-bold">{sortedYears.length}</p>
                <p className="text-sm text-gray-500">{t('seasons')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button onClick={handleOpenAddDialog} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {t('addParticipation')}
          </Button>
        </div>

        {/* Participations List */}
        {participations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('noParticipationsRegistered')}
              </h3>
              <p className="text-gray-500 mb-4">
                {t('addRacesHint')}
              </p>
              <Button onClick={handleOpenAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                {t('addFirstParticipation')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <div key={year}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  {year}
                  <span className="text-sm font-normal text-gray-500">
                    ({t('racesCountParen', { count: groupedParticipations[year].length })})
                  </span>
                </h2>
                <div className="space-y-4">
                  {groupedParticipations[year].map((participation) => (
                    <Card
                      key={participation.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  participation.status === 'COMPLETED'
                                    ? 'bg-green-100'
                                    : 'bg-orange-100'
                                }`}
                              >
                                {participation.status === 'COMPLETED' ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-orange-600" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {participation.edition.competition.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {participation.edition.competition.event.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                  <MapPin className="w-4 h-4" />
                                  {participation.edition.competition.event.country}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Results */}
                          {participation.status === 'COMPLETED' && (
                            <div className="flex flex-wrap gap-4 text-sm">
                              {participation.finishTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">
                                    {formatTime(participation.finishTime)}
                                  </span>
                                </div>
                              )}
                              {participation.position && (
                                <div className="flex items-center gap-1">
                                  <Medal className="w-4 h-4 text-yellow-500" />
                                  <span className="font-medium">
                                    #{participation.position}
                                  </span>
                                </div>
                              )}
                              {participation.categoryPosition && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <span>
                                    {getCategoryLabel(
                                      participation.categoryType,
                                      participation.categoryName
                                    )}
                                    : #{participation.categoryPosition}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditDialog(participation)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleOpenDeleteDialog(participation)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Participation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('addParticipation')}</DialogTitle>
            <DialogDescription>
              {t('addParticipationDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Edition Search */}
            {!selectedEdition ? (
              <div className="space-y-2">
                <Label>{t('searchRace')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('raceNamePlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {isSearching && (
                  <p className="text-sm text-gray-500">{t('searching')}</p>
                )}

                {searchResults.length > 0 && (
                  <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                    {searchResults.map((edition) => (
                      <button
                        key={edition.id}
                        onClick={() => handleSelectEdition(edition)}
                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <p className="font-medium">{edition.displayName}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {edition.eventCity}, {edition.eventCountry}
                          </span>
                          {edition.distance && (
                            <span className="flex items-center gap-1">
                              <Ruler className="w-3 h-3" />
                              {edition.distance} km
                            </span>
                          )}
                          {edition.elevation && (
                            <span className="flex items-center gap-1">
                              <Mountain className="w-3 h-3" />
                              {edition.elevation} m+
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                  <p className="text-sm text-gray-500">
                    {t('noResultsFound')}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{selectedEdition.displayName}</p>
                    <p className="text-sm text-gray-600">
                      {selectedEdition.eventCity}, {selectedEdition.eventCountry}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEdition(null)}
                  >
                    {t('change')}
                  </Button>
                </div>
              </div>
            )}

            {selectedEdition && (
              <>
                {/* Status */}
                <div className="space-y-2">
                  <Label>{t('status')}</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.status === 'COMPLETED' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: 'COMPLETED' }))
                      }
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('finisher')}
                    </Button>
                    <Button
                      type="button"
                      variant={formData.status === 'DNF' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: 'DNF' }))
                      }
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {t('statDNF')}
                    </Button>
                  </div>
                </div>

                {/* Results (only if COMPLETED) */}
                {formData.status === 'COMPLETED' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="finishTime">{t('time')}</Label>
                        <Input
                          id="finishTime"
                          name="finishTime"
                          placeholder="HH:MM:SS"
                          value={formData.finishTime}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">{t('overallPosition')}</Label>
                        <Input
                          id="position"
                          name="position"
                          type="number"
                          min="1"
                          placeholder="1"
                          value={formData.position}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryType">{t('category')}</Label>
                      <select
                        id="categoryType"
                        name="categoryType"
                        value={formData.categoryType || ''}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">{t('noCategory')}</option>
                        <option value="MALE">{t('categoryMale')}</option>
                        <option value="FEMALE">{t('categoryFemale')}</option>
                        <option value="CATEGORY">{t('otherCategory')}</option>
                      </select>
                    </div>

                    {formData.categoryType === 'CATEGORY' && (
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">{t('categoryName')}</Label>
                        <Input
                          id="categoryName"
                          name="categoryName"
                          placeholder={t('categoryNamePlaceholder')}
                          value={formData.categoryName}
                          onChange={handleFormChange}
                        />
                      </div>
                    )}

                    {formData.categoryType && (
                      <div className="space-y-2">
                        <Label htmlFor="categoryPosition">{t('categoryPosition')}</Label>
                        <Input
                          id="categoryPosition"
                          name="categoryPosition"
                          type="number"
                          min="1"
                          placeholder="1"
                          value={formData.categoryPosition}
                          onChange={handleFormChange}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Personal rating */}
                <div className="space-y-2">
                  <Label>{t('personalRating')}</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingChange(rating)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            formData.personalRating && rating <= formData.personalRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('notesOptional')}</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder={t('notesPlaceholder')}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={saving}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSubmitAdd}
              disabled={!selectedEdition || saving}
            >
              {saving ? t('saving') : t('addParticipation')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Participation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('editParticipation')}</DialogTitle>
            <DialogDescription>
              {editingParticipation && (
                <>
                  {editingParticipation.edition.competition.name} (
                  {editingParticipation.edition.year})
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status */}
            <div className="space-y-2">
              <Label>{t('status')}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.status === 'COMPLETED' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: 'COMPLETED' }))
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('finisher')}
                </Button>
                <Button
                  type="button"
                  variant={formData.status === 'DNF' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: 'DNF' }))
                  }
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {t('statDNF')}
                </Button>
              </div>
            </div>

            {/* Results (only if COMPLETED) */}
            {formData.status === 'COMPLETED' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-finishTime">{t('time')}</Label>
                    <Input
                      id="edit-finishTime"
                      name="finishTime"
                      placeholder="HH:MM:SS"
                      value={formData.finishTime}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-position">{t('overallPosition')}</Label>
                    <Input
                      id="edit-position"
                      name="position"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.position}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-categoryType">{t('category')}</Label>
                  <select
                    id="edit-categoryType"
                    name="categoryType"
                    value={formData.categoryType || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t('noCategory')}</option>
                    <option value="MALE">{t('categoryMale')}</option>
                    <option value="FEMALE">{t('categoryFemale')}</option>
                    <option value="CATEGORY">{t('otherCategory')}</option>
                  </select>
                </div>

                {formData.categoryType === 'CATEGORY' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-categoryName">{t('categoryName')}</Label>
                    <Input
                      id="edit-categoryName"
                      name="categoryName"
                      placeholder={t('categoryNamePlaceholder')}
                      value={formData.categoryName}
                      onChange={handleFormChange}
                    />
                  </div>
                )}

                {formData.categoryType && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-categoryPosition">{t('categoryPosition')}</Label>
                    <Input
                      id="edit-categoryPosition"
                      name="categoryPosition"
                      type="number"
                      min="1"
                      placeholder="1"
                      value={formData.categoryPosition}
                      onChange={handleFormChange}
                    />
                  </div>
                )}
              </>
            )}

            {/* Personal rating */}
            <div className="space-y-2">
              <Label>{t('personalRating')}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        formData.personalRating && rating <= formData.personalRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="edit-notes">{t('notesOptional')}</Label>
              <textarea
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows={3}
                placeholder={t('notesPlaceholder')}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={saving}
            >
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmitEdit} disabled={saving}>
              {saving ? t('saving') : t('saveChangesShort')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteParticipation')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirm')}
              {editingParticipation && (
                <span className="block mt-2 font-medium text-gray-700">
                  {editingParticipation.edition.competition.name} (
                  {editingParticipation.edition.year})
                </span>
              )}
              {t('deleteCannotUndo')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? t('deleting') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
