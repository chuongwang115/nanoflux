import type { TranslateTargetLang } from "../../translate";

/** Frequent simplified-only vs traditional-only chars (news titles). Shared Han is ignored. */
const SIMPLIFIED_ONLY =
  /[国们个来对为会这过还说经与从无开关长门问间体点实现发电业产学车机东书话语么后里样种进没让该应当头发风马龙广历义术权气条务号爱乐视听医钱银钟铁党军区县乡厂场离儿孙报处]/gu;
const TRADITIONAL_ONLY =
  /[國們個來對為會這過還說經與從無關長門問間體點實現發電業產學車機東書語話麼後裡樣種進沒讓該應當頭髮風馬龍廣歷義術權氣條務號愛樂視聽醫錢銀鐘鐵黨軍區縣鄉廠場離兒孫報處]/gu;

function count(text: string, re: RegExp): number {
  return text.match(re)?.length ?? 0;
}

function chineseVariant(
  title: string,
): "zh-Hans" | "zh-Hant" | null {
  const simplified = count(title, SIMPLIFIED_ONLY);
  const traditional = count(title, TRADITIONAL_ONLY);
  if (simplified > traditional) return "zh-Hans";
  if (traditional > simplified) return "zh-Hant";
  return null;
}

/**
 * True when the title is already in the translation target language
 * (English vs Simplified/Traditional Chinese). Mixed CJK+Latin titles
 * count as Chinese if they contain Han characters.
 */
export function isTitleInTargetLang(
  title: string,
  targetLang: TranslateTargetLang,
): boolean {
  const text = title.trim();
  if (!text) return true;

  const han = count(text, /\p{Script=Han}/gu);
  const latin = count(text, /\p{Script=Latin}/gu);
  const kana = count(text, /\p{Script=Hiragana}|\p{Script=Katakana}/gu);
  const hangul = count(text, /\p{Script=Hangul}/gu);

  if (kana > 0 || hangul > 0) return false;

  if (targetLang === "en") {
    return han === 0 && latin > 0;
  }

  if (han === 0) return false;

  const variant = chineseVariant(text);
  if (!variant) return true;
  return variant === targetLang;
}
