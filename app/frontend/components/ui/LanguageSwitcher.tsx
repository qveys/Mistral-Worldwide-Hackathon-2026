'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const locales = [
  { code: 'fr' as const, label: 'FR' },
  { code: 'en' as const, label: 'EN' },
] as const;

type LocaleCode = (typeof locales)[number]['code'];

export function LanguageSwitcher({
  className,
  variant = 'buttons',
}: {
  className?: string;
  variant?: 'buttons' | 'compact';
}) {
  const locale = useLocale() as LocaleCode;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: LocaleCode) => {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-0.5', className)}>
        {locales.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            className={cn(
              'px-2 py-1 text-xs font-bold rounded transition-colors',
              code === locale
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            )}
            aria-label={code === 'fr' ? 'Français' : 'English'}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLocale(code)}
          className={cn(
            'px-3 py-1.5 text-sm font-bold rounded-lg transition-colors',
            code === locale
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
          )}
          aria-label={code === 'fr' ? 'Français' : 'English'}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
