'use client';

import { useTranslations } from 'next-intl';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export function ActivityHeader() {
  const t = useTranslations('nav');
  const tDoc = useTranslations('doc');
  return <DashboardPageHeader title={t('activity')} accent={tDoc('activityStream')} />;
}
