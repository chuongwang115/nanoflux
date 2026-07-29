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
    temperature: options?.temperature ?? 0,
    timeout: AI_TIMEOUT_MS,
    // Prefer chat completions for OpenAI-compatible providers.
    useResponsesApi: false,
    configuration: {
      baseURL: `${config.baseUrl}/v1`,
    },
  });
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
    typeof response.content === "string"
      ? response.content.trim()
      : Array.isArray(response.content)
        ? response.content
            .map((part) =>
              typeof part === "string"
                ? part
                : part.type === "text"
                  ? part.text
                  : "",
            )
            .join("")
            .trim()
        : "";

  if (!text) throw new Error("Empty AI response");
  return text;
}
