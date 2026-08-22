export const LOCALES = ["en", "zh-Hans", "zh-Hant"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-Hans";

export function parseLocale(value: string | null | undefined): Locale | null {
  if (value === "en" || value === "zh-Hans" || value === "zh-Hant") return value;
  if (value === "zh") return "zh-Hans";
  return null;
}

export function localeFromNavigator(language: string | undefined): Locale {
  if (!language) return DEFAULT_LOCALE;
  const lang = language.toLowerCase();
  if (lang.startsWith("en")) return "en";
  if (lang.startsWith("zh")) {
    if (
      lang.includes("hant") ||
      lang.includes("-tw") ||
      lang.includes("-hk") ||
      lang.includes("-mo")
    ) {
      return "zh-Hant";
    }
    return "zh-Hans";
  }
  return DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
  if (locale === "en") return "en";
  if (locale === "zh-Hant") return "zh-TW";
  return "zh-CN";
}

export function dateLocaleTag(locale: Locale): string {
  if (locale === "en") return "en-US";
  if (locale === "zh-Hant") return "zh-TW";
  return "zh-CN";
}

export function nextLocale(locale: Locale): Locale {
  const index = LOCALES.indexOf(locale);
  return LOCALES[(index + 1) % LOCALES.length] ?? DEFAULT_LOCALE;
}
