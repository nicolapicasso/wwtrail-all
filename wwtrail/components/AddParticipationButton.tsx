'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
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
  CheckCircle,
  XCircle,
  Trophy,
  Plus,
  Edit,
  Star,
  Clock,
  Medal,
  Loader2,
} from 'lucide-react';
import { userService, UserEditionInput } from '@/lib/api/user.service';

type ParticipationStatus = 'COMPLETED' | 'DNF';
type CategoryType = 'GENERAL' | 'MALE' | 'FEMALE' | 'CATEGORY' | null;

interface ParticipationFormData {
  status: ParticipationStatus;
  finishTime: string;
  position: string;
  categoryPosition: string;
  categoryType: CategoryType;
  categoryName: string;
  personalRating: number | null;
}

const initialFormData: ParticipationFormData = {
  status: 'COMPLETED',
  finishTime: '',
  position: '',
  categoryPosition: '',
  categoryType: null,
  categoryName: '',
  personalRating: null,
};

interface AddParticipationButtonProps {
  editionId: string;
  editionName: string;
  editionYear: number;
  onParticipationAdded?: () => void;
}

export function AddParticipationButton({
  editionId,
  editionName,
  editionYear,
  onParticipationAdded,
}: AddParticipationButtonProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('cmpLayout');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ParticipationFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user already has a participation
  const [existingParticipation, setExistingParticipation] = useState<any>(null);
  const [loadingParticipation, setLoadingParticipation] = useState(false);

  useEffect(() => {
    const checkExistingParticipation = async () => {
      if (!isAuthenticated || !user) return;

      setLoadingParticipation(true);
      try {
        const participation = await userService.getParticipation(editionId);
        setExistingParticipation(participation);
        // Pre-fill form with existing data
        if (participation) {
          setFormData({
            status: participation.status || 'COMPLETED',
            finishTime: participation.finishTime || '',
            position: participation.position?.toString() || '',
            categoryPosition: participation.categoryPosition?.toString() || '',
            categoryType: participation.categoryType || null,
            categoryName: participation.categoryName || '',
            personalRating: participation.personalRating || null,
          });
        }
      } catch (err: any) {
        // 404 means no participation exists, which is fine
        if (err.response?.status !== 404) {
          console.error('Error checking participation:', err);
        }
      } finally {
        setLoadingParticipation(false);
      }
    };

    checkExistingParticipation();
  }, [editionId, isAuthenticated, user]);

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login?redirect=/${locale}/editions/${editionId}`);
      return;
    }
    setIsDialogOpen(true);
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

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      const input: UserEditionInput = {
        status: formData.status,
        finishTime: formData.finishTime || null,
        position: formData.position ? parseInt(formData.position) : null,
        categoryPosition: formData.categoryPosition ? parseInt(formData.categoryPosition) : null,
        categoryType: formData.categoryType,
        categoryName: formData.categoryType === 'CATEGORY' ? formData.categoryName : null,
        personalRating: formData.personalRating,
      };

      await userService.upsertParticipation(editionId, input);
      setIsDialogOpen(false);
      setExistingParticipation(input);
      onParticipationAdded?.();
    } catch (err: any) {
      console.error('Error saving participation:', err);
      setError(err.response?.data?.message || t('participationSaveError'));
    } finally {
      setSaving(false);
    }
  };

  // Don't show while auth is loading
  if (authLoading) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        variant={existingParticipation ? 'outline' : 'default'}
        className={existingParticipation ? 'border-green-500 text-green-600 hover:bg-green-50' : ''}
        disabled={loadingParticipation}
      >
        {loadingParticipation ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : existingParticipation ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('participated')}
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            {t('markParticipation')}
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {existingParticipation ? t('editParticipation') : t('addParticipation')}
            </DialogTitle>
            <DialogDescription>
              {editionName} ({editionYear})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <Label>{t('statusLabel')}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.status === 'COMPLETED' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData((prev) => ({ ...prev, status: 'COMPLETED' }))}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('finisher')}
                </Button>
                <Button
                  type="button"
                  variant={formData.status === 'DNF' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFormData((prev) => ({ ...prev, status: 'DNF' }))}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {t('dnf')}
                </Button>
              </div>
            </div>

            {/* Results (only if COMPLETED) */}
            {formData.status === 'COMPLETED' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finishTime">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {t('timeLabel')}
                    </Label>
                    <Input
                      id="finishTime"
                      name="finishTime"
                      placeholder="HH:MM:SS"
                      value={formData.finishTime}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">
                      <Medal className="w-4 h-4 inline mr-1" />
                      {t('positionLabel')}
                    </Label>
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
                  <Label htmlFor="categoryType">{t('categoryLabel')}</Label>
                  <select
                    id="categoryType"
                    name="categoryType"
                    value={formData.categoryType || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t('noCategory')}</option>
                    <option value="MALE">{t('maleCategory')}</option>
                    <option value="FEMALE">{t('femaleCategory')}</option>
                    <option value="CATEGORY">{t('otherCategory')}</option>
                  </select>
                </div>

                {formData.categoryType === 'CATEGORY' && (
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">{t('categoryNameLabel')}</Label>
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
                    <Label htmlFor="categoryPosition">{t('categoryPositionLabel')}</Label>
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('saving')}
                </>
              ) : existingParticipation ? (
                t('saveChanges')
              ) : (
                t('addParticipation')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddParticipationButton;
