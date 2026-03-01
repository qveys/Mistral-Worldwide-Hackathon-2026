import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

const futuraround = localFont({
  src: "../public/fonts/fonnts.com-futuraround-medium.otf",
  variable: "--font-futuraround",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "EchoMaps", template: "%s | EchoMaps" },
  description:
    "Transformez vos flux de pensée désordonnés en roadmaps stratégiques structurées grâce à l'IA.",
  openGraph: {
    title: "EchoMaps",
    description: "De Chaos à Clarté : Roadmaps instantanées via IA.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale =
    headersList.get("x-next-intl-locale") ?? routing.defaultLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${futuraround.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
