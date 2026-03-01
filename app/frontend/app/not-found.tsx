import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default async function RootNotFound() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'errors' });
  return (
    <ErrorLayout
      code="404"
      icon="404"
      title={t('notFoundTitle')}
      message={t('notFoundMessage')}
    />
  );
}
