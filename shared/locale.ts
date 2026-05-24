export const LOCALES = ["zh", "en"] as const;

export type Locale = (typeof LOCALES)[number];
