import { chatCompletion, getAiConfig } from "../ai/client";

const MAX_CONTENT_CHARS = 3000;

type AiFilterResult = {
  passed: boolean;
  reason: string | null;
};

/** Recover pass/reason when the model embeds unescaped quotes in reason. */
function parseLooseVerdict(
  blob: string,
): { pass: boolean; reason: string | null } | null {
  const passMatch = blob.match(/"pass"\s*:\s*(true|false)/i);
  if (!passMatch) return null;

  const pass = passMatch[1].toLowerCase() === "true";
  const reasonMatch = blob.match(/"reason"\s*:\s*"([\s\S]*)"\s*\}/);
  const reason = reasonMatch?.[1]?.trim() || null;
  return { pass, reason };
}

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
      const loose = parseLooseVerdict(jsonMatch[0]);
      if (loose) return loose;
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

/** Fail-open: keep the item when LLM is unavailable or unparseable. */
function passThrough(): AiFilterResult {
  return { passed: true, reason: null };
}

export async function applyAiFilter(
  title: string,
  content: string | null,
  prompt: string,
): Promise<AiFilterResult> {
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    return passThrough();
  }

  if (!getAiConfig()) {
    console.warn(
      "[ai-filter] prompt configured but LLM_BASE_URL/LLM_API_KEY/LLM_MODEL_NAME missing; skipping",
    );
    return passThrough();
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
      'You are a news relevance filter. Decide whether the news matches the user criteria. Reply with JSON only: {"pass": boolean, "reason": string}. Escape any double quotes inside reason (e.g. \\"word\\"), or avoid them.',
      userMessage,
    );

    const verdict = parseAiVerdict(text);
    if (!verdict) {
      throw new Error(`Unparseable AI response: ${text.slice(0, 100)}`);
    }

    return {
      passed: verdict.pass,
      reason: verdict.reason,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ai-filter] ${message}`);
    return passThrough();
  }
}
