import type { Locale } from "./locale";

const manifestIcons = [
  {
    src: "/icons/icon.svg",
    sizes: "any",
    type: "image/svg+xml",
    purpose: "any",
  },
  {
    src: "/icons/icon.svg",
    sizes: "any",
    type: "image/svg+xml",
    purpose: "maskable",
  },
  {
    src: "/icons/icon-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
] as const;

export const PWA_META_DESCRIPTION: Record<Locale, string> = {
  zh: "轻量 RSS 阅读器",
  en: "Lightweight RSS reader",
};

export function buildWebManifest(locale: Locale) {
  return {
    name: "NanoFlux",
    short_name: "NanoFlux",
    description: PWA_META_DESCRIPTION[locale],
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#171717",
    lang: locale === "zh" ? "zh-CN" : "en",
    icons: manifestIcons,
  };
}

export function manifestHref(locale: Locale) {
  return `/manifest.webmanifest?locale=${locale}`;
}
