import { getTranslations } from 'next-intl/server';
import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default async function NotFound() {
  const t = await getTranslations('errors');
  return (
    <ErrorLayout
      code="404"
      icon="404"
      title={t('notFoundTitle')}
      message={t('notFoundMessage')}
    />
  );
}
