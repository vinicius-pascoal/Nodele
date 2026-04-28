"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#3a6280]/45 bg-[#0a1a28]/70 px-4 py-4 text-center text-[0.9rem] text-[#c8deef] sm:px-6">
      {t.footer.developedBy}{" "}
      <a
        href="https://github.com/vinicius-pascoal"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#81f5c2] underline decoration-[#81f5c2]/60 underline-offset-3 transition hover:text-[#a8f8d5]"
      >
        vinicius pascoal
      </a>
    </footer>
  );
}
