"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, getHtmlLang, getTranslations, type Locale, type Translations } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
};

const STORAGE_KEY = "nodele-locale";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const storedLocale = window.localStorage.getItem(STORAGE_KEY);

  if (storedLocale === "pt" || storedLocale === "en" || storedLocale === "es") {
    return storedLocale;
  }

  return defaultLocale;
}

export function LanguageProvider({
  children,
  initialLocale = defaultLocale,
}: Readonly<{
  children: React.ReactNode;
  initialLocale?: Locale;
}>) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return initialLocale;
    }

    return readInitialLocale();
  });

  useEffect(() => {
    document.documentElement.lang = getHtmlLang(locale);
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: getTranslations(locale),
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }

  return context;
}
