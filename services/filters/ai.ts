import { chatCompletion, getAiConfig } from "../ai/client";

const MAX_CONTENT_CHARS = 3000;

type AiFilterResult = {
  passed: boolean;
  keywords: string | null;
  reason: string | null;
};

function parseAiVerdict(
  text: string,
): { pass: boolean; reason: string | null } | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        pass?: boolean;
        reason?: string;
      };
      if (typeof parsed.pass === "boolean") {
        return {
          pass: parsed.pass,
          reason: parsed.reason?.trim() || null,
        };
      }
    } catch {
      // fall through to keyword matching
    }
  }

  const normalized = text.trim().toLowerCase();
  if (/^(yes|true|pass|relevant|是|通过)/.test(normalized)) {
    return { pass: true, reason: null };
  }
  if (/^(no|false|reject|irrelevant|否|不通过|无关)/.test(normalized)) {
    return { pass: false, reason: text.trim() };
  }

  return null;
}

function withoutAi(whitelistReason: string | null): AiFilterResult {
  return {
    passed: true,
    keywords: whitelistReason,
    reason: null,
  };
}

export async function applyAiFilter(
  title: string,
  content: string | null,
  whitelistReason: string | null,
  prompt: string,
): Promise<AiFilterResult> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    return withoutAi(whitelistReason);
  }

  if (!getAiConfig()) {
    console.warn(
      "[ai-filter] prompt configured but BASE_URL/API_KEY/MODEL_NAME missing; skipping",
    );
    return withoutAi(whitelistReason);
  }

  const bodyContent = (content ?? "").slice(0, MAX_CONTENT_CHARS);
  const userMessage = [
    "Criteria:",
    trimmedPrompt,
    "",
    `Title: ${title}`,
    "",
    "Content:",
    bodyContent || "(empty)",
  ].join("\n");

  try {
    const text = await chatCompletion(
      'You are a news relevance filter. Decide whether the news matches the user criteria. Reply with JSON only: {"pass": boolean, "reason": string}',
      userMessage,
    );

    const verdict = parseAiVerdict(text);
    if (!verdict) {
      throw new Error(`Unparseable AI response: ${text.slice(0, 100)}`);
    }

    return {
      passed: verdict.pass,
      keywords: whitelistReason,
      reason: verdict.reason,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ai-filter] ${message}`);
    return withoutAi(whitelistReason);
  }
}
