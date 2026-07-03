import uz from "./uz";
import ru from "./ru";

export type Lang = "uz" | "ru";

export const translations = { uz, ru } as const;

export function getTranslations(lang: Lang) {
  return translations[lang] ?? translations.uz;
}

export { uz, ru };
export type { Translations } from "./uz";
