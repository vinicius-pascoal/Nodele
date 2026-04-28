import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Fira_Code } from "next/font/google";
import { AppFooter } from "@/components/AppFooter";
import { LanguageProvider } from "@/components/LanguageProvider";
import { defaultLocale, getHtmlLang, getTranslations } from "@/lib/i18n";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const monoFont = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: getTranslations(defaultLocale).meta.title,
  description: getTranslations(defaultLocale).meta.description,
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={getHtmlLang(defaultLocale)}
      suppressHydrationWarning
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col font-(--font-display) text-[#e8f1f7]">
        <LanguageProvider initialLocale={defaultLocale}>
          <main className="flex-1">{children}</main>
          <AppFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
