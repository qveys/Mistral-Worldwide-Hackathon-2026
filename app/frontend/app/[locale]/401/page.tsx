import { ErrorLayout } from '@/components/ui/ErrorLayout';
import { getTranslations } from 'next-intl/server';

export default async function Unauthorized() {
    const t = await getTranslations('errors');
    const tCommon = await getTranslations('common');
    return (
        <ErrorLayout
            code="401"
            icon="401"
            title={t('unauthorizedTitle')}
            message={t('unauthorizedMessage')}
            labels={{
                back: tCommon('back'),
                returnHome: tCommon('returnHome'),
                systemInterrupt: t('systemInterrupt', { code: '401' }),
            }}
        />
    );
}
