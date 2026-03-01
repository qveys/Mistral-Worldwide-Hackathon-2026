import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import "./globals.css";

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
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
