import { messages, type Locale, type MessageKey } from "./i18n/messages";
import { applyDocumentLocale } from "./locale";

const STORAGE_KEY = "nanoflux-locale";

function readStored(): Locale | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "zh" || v === "en") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function browserLocale(): Locale {
  if (typeof navigator === "undefined") return "zh";
  const lang = navigator.language.toLowerCase();
  return lang.startsWith("zh") ? "zh" : "en";
}

export const localeState = $state<{ locale: Locale }>({ locale: "zh" });

export function applyLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  applyDocumentLocale(locale);
}

export function initLocale() {
  localeState.locale = readStored() ?? browserLocale();
  applyLocale(localeState.locale);
}

export function setLocale(locale: Locale) {
  localeState.locale = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  applyLocale(locale);
}

export function toggleLocale() {
  setLocale(localeState.locale === "zh" ? "en" : "zh");
}

export function t(key: MessageKey): string {
  return messages[localeState.locale][key];
}

export function tf(key: MessageKey, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    t(key),
  );
}
