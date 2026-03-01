'use client';

import { ErrorLayout } from '@/components/ui/ErrorLayout';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string };
    reset?: () => void;
}) {
    const t = useTranslations('errors');
    const tCommon = useTranslations('common');
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <ErrorLayout
            code="500"
            icon="500"
            title={t('errorTitle')}
            message={t('errorMessage')}
            labels={{
                back: tCommon('back'),
                returnHome: tCommon('returnHome'),
                systemInterrupt: t('systemInterrupt', { code: '500' }),
            }}
        />
    );
}
