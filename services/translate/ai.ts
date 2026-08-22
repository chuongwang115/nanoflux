import { chatCompletion, getAiConfig } from "../ai/client";
import type { TranslateTargetLang } from "../../translate";
import { isTitleInTargetLang } from "./detect";

const TARGET_LANG_LABEL: Record<TranslateTargetLang, string> = {
  en: "English",
  "zh-Hans": "Simplified Chinese",
  "zh-Hant": "Traditional Chinese",
};

function unwrapTitle(text: string): string {
  let value = text.trim();
  if (!value) return "";

  const fenced = value.match(/^```(?:\w+)?\s*([\s\S]*?)\s*```$/);
  if (fenced?.[1]) {
    value = fenced[1].trim();
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith("“") && value.endsWith("”"))
  ) {
    value = value.slice(1, -1).trim();
  }

  const firstLine = value.split(/\r?\n/, 1)[0]?.trim() ?? "";
  return firstLine;
}

/** Fail-open: keep the original title when LLM is unavailable or empty. */
export async function applyAiTitleTranslate(
  title: string,
  targetLang: TranslateTargetLang,
  prompt: string,
): Promise<string> {
  const original = title.trim();
  if (!original) return title;

  if (isTitleInTargetLang(original, targetLang)) {
    return title;
  }

  if (!getAiConfig()) {
    console.warn(
      "[ai-translate] enabled but LLM_BASE_URL/LLM_API_KEY/LLM_MODEL_NAME missing; skipping",
    );
    return title;
  }

  const target = TARGET_LANG_LABEL[targetLang];
  const extra = prompt.trim();
  const system =
    "You are a news title translator. Translate the title into " +
    `${target}. Reply with the translated title only — no quotes, labels, or explanation.` +
    (extra ? " Follow the extra instructions when they do not conflict with this." : "");

  const userMessage = extra
    ? ["Instructions:", extra, "", "Title:", original].join("\n")
    : original;

  try {
    const text = await chatCompletion(system, userMessage);
    const translated = unwrapTitle(text);
    return translated || title;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ai-translate] ${message}`);
    return title;
  }
}
