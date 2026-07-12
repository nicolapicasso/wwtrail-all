'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ChangePasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations('pgAccount');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (formData.newPassword.length < 6) {
      setError(t('errorPasswordMinLength'));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('errorPasswordsDontMatch'));
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError(t('errorPasswordSameAsCurrent'));
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // TODO: Implement actual API call to change password
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.message || t('errorChangingPassword'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <h1 className="text-4xl font-bold mb-2">{t('changePassword')}</h1>
          <p className="text-lg opacity-90">
            {t('changePasswordSubtitle')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              {t('security')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">✅ {t('passwordUpdatedSuccess')}</p>
                  <p className="text-sm text-green-600 mt-1">{t('redirecting')}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">❌ {error}</p>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t('currentPassword')} *</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  placeholder={t('currentPasswordPlaceholder')}
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('newPassword')} *</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder={t('minSixChars')}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  {t('passwordMinLengthHint')}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmNewPassword')} *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder={t('repeatNewPassword')}
                />
              </div>

              {/* Password Requirements */}
              <div className="bg-muted rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">{t('passwordRequirements')}</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li className={formData.newPassword.length >= 6 ? 'text-green-600' : ''}>
                    • {t('reqMinSixChars')}
                  </li>
                  <li className={formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : ''}>
                    • {t('reqPasswordsMatch')}
                  </li>
                  <li className={formData.currentPassword && formData.newPassword && formData.currentPassword !== formData.newPassword ? 'text-green-600' : ''}>
                    • {t('reqDifferentFromCurrent')}
                  </li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={saving}
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? t('updating') : t('updatePassword')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Tip */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>{t('securityTipLabel')}</strong> {t('securityTipText')}
          </p>
        </div>
      </div>
    </div>
  );
}
