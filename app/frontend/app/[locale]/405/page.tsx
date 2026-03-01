import { getTranslations } from 'next-intl/server';
import { ErrorLayout } from '@/components/ui/ErrorLayout';

export default async function MethodNotAllowed() {
  const t = await getTranslations('errors');
  return (
    <ErrorLayout
      code="405"
      icon="405"
      title={t('methodNotAllowedTitle')}
      message={t('methodNotAllowedMessage')}
    />
  );
}
