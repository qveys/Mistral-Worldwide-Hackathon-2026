'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export function TimelineHeader() {
  const t = useTranslations('dashboard');
  return <DashboardPageHeader title={t('timelinePageTitle')} accent={t('timelinePageAccent')} />;
}
