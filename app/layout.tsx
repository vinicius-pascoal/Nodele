import type { Metadata } from "next";
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
      <body className="flex min-h-full flex-col bg-[radial-gradient(1200px_600px_at_8%_-10%,#1e4764_0%,transparent_55%),radial-gradient(900px_500px_at_95%_2%,#133149_0%,transparent_50%),linear-gradient(160deg,#07121c_0%,#091827_50%,#05121c_100%)] font-[var(--font-display)] text-[#e8f1f7]">
        {children}
      </body>
    </html>
  );
}
