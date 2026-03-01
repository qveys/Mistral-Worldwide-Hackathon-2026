import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import './globals.css';

const futuraround = localFont({
    src: '../public/fonts/fonnts.com-futuraround-medium.otf',
    variable: '--font-futuraround',
    display: 'swap',
    fallback: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
});

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: { default: 'EchoMaps', template: '%s | EchoMaps' },
    description:
        "Transformez vos flux de pensée désordonnés en roadmaps stratégiques structurées grâce à l'IA.",
    icons: {
        icon: '/logo.png',
        apple: '/logo.png',
    },
    openGraph: {
        title: 'EchoMaps',
        description: 'De Chaos à Clarté : Roadmaps instantanées via IA.',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = await headers();
    const locale = headersList.get('x-next-intl-locale') ?? routing.defaultLocale;

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            className={`${futuraround.variable} ${geistSans.variable} ${geistMono.variable}`}
        >
            <body className="font-sans antialiased">
                <ThemeProvider>
                    <AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
