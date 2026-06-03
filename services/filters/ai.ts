import { httpPost } from "../http-fetcher";

const AI_TIMEOUT_MS = 30_000;
const MAX_CONTENT_CHARS = 3000;

type AiConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

type AiFilterResult = {
  passed: boolean;
  keywords: string | null;
  reason: string | null;
};

function aiConfig(): AiConfig | null {
  const baseUrl = process.env.BASE_URL?.trim();
  const apiKey = process.env.API_KEY?.trim();
  const model = process.env.MODEL_NAME?.trim();
  if (!baseUrl || !apiKey || !model) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey, model };
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

  const config = aiConfig();
  if (!config) {
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
    const response = await httpPost(`${config.baseUrl}/v1/chat/completions`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              'You are a news relevance filter. Decide whether the news matches the user criteria. Reply with JSON only: {"pass": boolean, "reason": string}',
          },
          { role: "user", content: userMessage },
        ],
      }),
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${detail.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty AI response");

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
