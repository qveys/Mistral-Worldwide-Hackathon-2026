'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

interface RegistrationFormProps {
  onSuccess: () => void;
  className?: string;
}

export function RegistrationForm({
  onSuccess,
  className,
}: RegistrationFormProps) {
  const t = useTranslations('register');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(t('errorEmailRequired'));
      return;
    }
    if (password !== passwordConfirm) {
      setError(t('errorPasswordsMismatch'));
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        onSuccess();
        return;
      }
      setError(data.error || 'Registration failed');
    } catch {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('w-full max-w-sm space-y-4', className)}
      noValidate
    >
      <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">
        {t('title')}
      </h2>
      <Input
        label={t('firstNameLabel')}
        type="text"
        autoComplete="given-name"
        placeholder={t('firstNamePlaceholder')}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <Input
        label={t('lastNameLabel')}
        type="text"
        autoComplete="family-name"
        placeholder={t('lastNamePlaceholder')}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Input
        label={t('emailLabel')}
        type="email"
        autoComplete="email"
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-required
      />
      <Input
        label={t('passwordLabel')}
        type="password"
        autoComplete="new-password"
        placeholder={t('passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        label={t('passwordConfirmLabel')}
        type="password"
        autoComplete="new-password"
        placeholder={t('passwordConfirmPlaceholder')}
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider italic" role="alert">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isLoading}
        isLoading={isLoading}
      >
        {t('submit')}
      </Button>
    </form>
  );
}
