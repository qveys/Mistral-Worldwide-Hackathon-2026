'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export function SettingsHeader() {
  const t = useTranslations('dashboard');
  return <DashboardPageHeader title={t('settingsPageTitle')} accent={t('settingsPageAccent')} />;
}
