import { ErrorLayout } from '@/components/ui/ErrorLayout';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
    const tErrors = await getTranslations('errors');
    const tCommon = await getTranslations('common');
    return (
        <ErrorLayout
            code="404"
            icon="404"
            title={tErrors('notFoundTitle')}
            message={tErrors('notFoundMessage')}
            labels={{
                back: tCommon('back'),
                returnHome: tCommon('returnHome'),
                systemInterrupt: tErrors('systemInterrupt', { code: '404' }),
            }}
        />
    );
}
