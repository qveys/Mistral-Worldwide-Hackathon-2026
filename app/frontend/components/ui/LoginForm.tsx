'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  initialEmail?: string;
  className?: string;
  isLoading?: boolean;
}

export function LoginForm({
  onSubmit,
  initialEmail = '',
  className,
  isLoading = false,
}: LoginFormProps) {
  const t = useTranslations('login');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('w-full max-w-sm space-y-4', className)}
      noValidate
    >
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
        autoComplete="current-password"
        placeholder={t('passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        aria-required
      />
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
