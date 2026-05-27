import type { Locale } from "../../../shared/locale";
import { manifestHref } from "../../../shared/manifest";
import { basePath } from "./base-path";
import { messages } from "./i18n/messages";

export function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;

  const description = messages[locale]["meta.description"];
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);

  const manifest = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (manifest) manifest.href = manifestHref(locale, basePath());
}
