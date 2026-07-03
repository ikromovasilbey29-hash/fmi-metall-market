"use client";

import { useLanguageStore } from "@/store/languageStore";
import type { Lang } from "@/lib/i18n";

interface Props {
  className?: string;
  compact?: boolean;
}

export default function LanguageSwitcher({ className = "", compact = false }: Props) {
  const { lang, setLang } = useLanguageStore();

  const langs: { value: Lang; label: string; flag: string }[] = [
    { value: "uz", label: "UZ", flag: "🇺🇿" },
    { value: "ru", label: "RU", flag: "🇷🇺" },
  ];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {langs.map((l) => (
        <button
          key={l.value}
          onClick={() => setLang(l.value)}
          title={l.value === "uz" ? "O'zbek tili" : "Русский язык"}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            lang === l.value
              ? "bg-accent-gold text-bg-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-card border border-transparent hover:border-border"
          }`}
        >
          <span>{l.flag}</span>
          {!compact && <span>{l.label}</span>}
        </button>
      ))}
    </div>
  );
}
