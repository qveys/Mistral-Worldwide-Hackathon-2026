import { ErrorLayout } from '@/components/ui/ErrorLayout';
import { getTranslations } from 'next-intl/server';

export default async function MethodNotAllowed() {
    const t = await getTranslations('errors');
    const tCommon = await getTranslations('common');
    return (
        <ErrorLayout
            code="405"
            icon="405"
            title={t('methodNotAllowedTitle')}
            message={t('methodNotAllowedMessage')}
            labels={{
                back: tCommon('back'),
                returnHome: tCommon('returnHome'),
                systemInterrupt: t('systemInterrupt', { code: '405' }),
            }}
        />
    );
}
