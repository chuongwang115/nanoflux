import type { Locale } from "./locale";
import { withBase } from "./base-path";

function manifestIcons(base: string) {
  return [
  {
    src: withBase("/icons/icon.svg", base),
    sizes: "any",
    type: "image/svg+xml",
    purpose: "any",
  },
  {
    src: withBase("/icons/icon.svg", base),
    sizes: "any",
    type: "image/svg+xml",
    purpose: "maskable",
  },
  {
    src: withBase("/icons/icon-192.png", base),
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: withBase("/icons/icon-512.png", base),
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
  {
    src: withBase("/icons/icon-512.png", base),
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
] as const;
}

export const PWA_META_DESCRIPTION: Record<Locale, string> = {
  zh: "轻量 RSS 阅读器",
  en: "Lightweight RSS reader",
};

export function buildWebManifest(locale: Locale, base = "") {
  const start = withBase("/", base);
  return {
    name: "NanoFlux",
    short_name: "NanoFlux",
    description: PWA_META_DESCRIPTION[locale],
    start_url: start,
    scope: start,
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#171717",
    lang: locale === "zh" ? "zh-CN" : "en",
    icons: manifestIcons(base),
  };
}

export function manifestHref(locale: Locale, base = "") {
  return `${withBase("/manifest.webmanifest", base)}?locale=${locale}`;
}
