import { getTranslations } from 'next-intl/server';
import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default async function Unauthorized() {
  const t = await getTranslations('errors');
  return (
    <ErrorLayout
      code="401"
      icon="401"
      title={t('unauthorizedTitle')}
      message={t('unauthorizedMessage')}
    />
  );
}
