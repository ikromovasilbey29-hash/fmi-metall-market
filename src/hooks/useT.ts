"use client";

import { useLanguageStore } from "@/store/languageStore";
import { getTranslations } from "@/lib/i18n";

/**
 * useT() — tarjima hook'i.
 * Ishlatish: const t = useT();  t.common.save
 */
export function useT() {
  const lang = useLanguageStore((s) => s.lang);
  return getTranslations(lang);
}

export default useT;
