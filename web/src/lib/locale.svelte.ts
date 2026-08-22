import {
  DEFAULT_LOCALE,
  htmlLang,
  localeFromNavigator,
  nextLocale,
  parseLocale,
} from "../../../shared/locale";
import { messages, type Locale, type MessageKey } from "./i18n/messages";
import { applyDocumentLocale } from "./locale";

const STORAGE_KEY = "nanoflux-locale";

function readStored(): Locale | null {
  try {
    return parseLocale(localStorage.getItem(STORAGE_KEY));
  } catch {
    /* ignore */
  }
  return null;
}

function browserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  return localeFromNavigator(navigator.language);
}

export const localeState = $state<{ locale: Locale }>({ locale: DEFAULT_LOCALE });

function applyLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = htmlLang(locale);
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
  setLocale(nextLocale(localeState.locale));
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
