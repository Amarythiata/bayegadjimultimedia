import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = "https://ansaroudinelinguere.com";
const SITE_NAME = "Ansaroudine Linguère";
const SITE_DESCRIPTION =
  "Directs vidéo et radio, actualités, médiathèque et articles du dahira Ansaroudine de Linguère — où que vous soyez dans le monde.";

export const metadata: Metadata = {
  // Indispensable pour que les images d'aperçu soient servies en URL absolue :
  // WhatsApp et Facebook rejettent les chemins relatifs.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    // Les pages de détail n'indiquent que leur propre titre ; le nom du site
    // est ajouté ici pour que l'aperçu partagé reste identifiable.
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <TopNav />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <SiteFooter />
        <BottomNav />
      </body>
    </html>
  );
}
