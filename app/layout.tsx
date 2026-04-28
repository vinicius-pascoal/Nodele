import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Fira_Code } from "next/font/google";
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
  title: "Nodele",
  description: "Descubra os nós ocultos da árvore binária.",
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
      lang="pt-BR"
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col font-(--font-display) text-[#e8f1f7]">
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-[#3a6280]/45 bg-[#0a1a28]/70 px-4 py-4 text-center text-[0.9rem] text-[#c8deef] sm:px-6">
          Desenvolvido por: <a
            href="https://github.com/vinicius-pascoal"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#81f5c2] underline decoration-[#81f5c2]/60 underline-offset-3 transition hover:text-[#a8f8d5]"
          >
            vinicius pascoal
          </a>
        </footer>
      </body>
    </html>
  );
}
