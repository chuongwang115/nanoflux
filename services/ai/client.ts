import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

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

function createChatModel(
  config: AiConfig,
  options?: { temperature?: number },
): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: config.apiKey,
    model: config.model,
    // Some Azure-backed models only accept their provider default.  Omit the
    // field unless a caller explicitly opts into a supported value.
    ...(options?.temperature === undefined
      ? {}
      : { temperature: options.temperature }),
    timeout: AI_TIMEOUT_MS,
    // Prefer chat completions for OpenAI-compatible providers.
    useResponsesApi: false,
    configuration: {
      baseURL: `${config.baseUrl}/v1`,
    },
  });
}

function textFromContent(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((part) =>
      typeof part === "string"
        ? part
        : part &&
            typeof part === "object" &&
            "type" in part &&
            part.type === "text" &&
            "text" in part &&
            typeof part.text === "string"
          ? part.text
          : "",
    )
    .join("")
    .trim();
}

/** Some reasoning models put the final JSON in reasoning when content is empty. */
function textFromReasoning(response: {
  additional_kwargs?: Record<string, unknown>;
}): string {
  const reasoning = response.additional_kwargs?.reasoning_content;
  if (typeof reasoning !== "string" || !reasoning.trim()) return "";
  const jsonMatch = reasoning.match(/\{[\s\S]*"pass"\s*:[\s\S]*\}/);
  return (jsonMatch?.[0] ?? reasoning).trim();
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

  const model = createChatModel(config, options);
  const response = await model.invoke([
    new SystemMessage(system),
    new HumanMessage(user),
  ]);

  const text =
    textFromContent(response.content) || textFromReasoning(response);

  if (!text) throw new Error("Empty AI response");
  return text;
}
