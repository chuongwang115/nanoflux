import { httpPost } from "../http-fetcher";

const AI_TIMEOUT_MS = 30_000;

export type AiConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

export function getAiConfig(): AiConfig | null {
  const baseUrl = process.env.LLM_BASE_URL?.trim();
  const apiKey = process.env.LLM_API_KEY?.trim();
  const model = process.env.LLM_MODEL_NAME?.trim();
  if (!baseUrl || !apiKey || !model) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey, model };
}

export async function chatCompletion(
  system: string,
  user: string,
  options?: { temperature?: number },
): Promise<string> {
  const config = getAiConfig();
  if (!config) {
    throw new Error("AI is not configured");
  }

  const response = await httpPost(`${config.baseUrl}/v1/chat/completions`, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: options?.temperature ?? 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
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
  return text;
}
