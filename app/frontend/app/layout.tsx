import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "EchoMaps — Transformez vos idees en roadmap",
  description: "Dictez vos idees, l'IA structure votre roadmap projet. Brainstorm vocal, templates, gamification.",
  keywords: ["roadmap", "projet", "IA", "brainstorm", "vocal"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
