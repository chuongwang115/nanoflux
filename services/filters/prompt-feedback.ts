import { chatCompletion } from "../ai/client";

const MAX_CONTENT_CHARS = 3000;
const MAX_PROMPT_CHARS = 8000;
const LEGACY_APPENDIX_MARKERS = ["用户排除示例", "用户认可示例"];

const SHARED_OPTIMIZE_GUIDE = [
  "核心原则：",
  "- 不要简单追加规则、段落或附录；须将原提示词与用户反馈融会贯通，输出一份重新整理后的完整提示词",
  "- 梳理清晰结构（建议包含：关注范围、应保留/高度相关、应排除/不相关、判断规则等，可按内容自由组织）",
  "- 合并重复或冲突条目，删除冗余表述，修正边界模糊之处",
  "- 将本次反馈提炼为可泛化的规则，融入相应章节，不要逐条罗列新闻标题",
  "- 保留仍然有效的原有标准，整体行文简洁、层次清楚、便于 AI 执行",
  "- 若原提示词为空，则根据过滤器名称新建完整过滤标准",
  "- 只输出提示词正文，不要解释、不要 markdown 代码块",
].join("\n");

const REJECT_OPTIMIZE_SYSTEM_PROMPT = [
  "你是新闻过滤器提示词优化专家。",
  "用户排除了一条误通过过滤器的新闻。请结合该反馈，对过滤标准提示词进行整体重写与优化，使同类新闻未来被判定为不通过。",
  "",
  SHARED_OPTIMIZE_GUIDE,
].join("\n");

const ACCEPT_OPTIMIZE_SYSTEM_PROMPT = [
  "你是新闻过滤器提示词优化专家。",
  "用户认可了一条正确通过过滤器的新闻。请结合该反馈，对过滤标准提示词进行整体重写与优化，使同类新闻未来能被稳定判定为通过。",
  "",
  SHARED_OPTIMIZE_GUIDE,
].join("\n");

function stripLegacyAppendix(prompt: string): string {
  let trimmed = prompt.trim();
  for (const marker of LEGACY_APPENDIX_MARKERS) {
    const idx = trimmed.indexOf(marker);
    if (idx !== -1) {
      trimmed = trimmed.slice(0, idx).trimEnd();
    }
  }
  return trimmed;
}

function normalizeOptimizedPrompt(text: string): string {
  return text
    .replace(/^```[\w]*\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim()
    .slice(0, MAX_PROMPT_CHARS);
}

async function optimizeFilterPrompt(
  systemPrompt: string,
  filterName: string,
  currentPrompt: string,
  title: string,
  content: string | null,
  feedbackLabel: string,
): Promise<string | null> {
  try {
    const bodyContent = (content ?? "").slice(0, MAX_CONTENT_CHARS);
    const basePrompt = stripLegacyAppendix(currentPrompt);

    const userMessage = [
      `过滤器名称：${filterName}`,
      "",
      "当前提示词：",
      basePrompt || "(空)",
      "",
      feedbackLabel,
      `标题：${title}`,
      "",
      "正文：",
      bodyContent || "(空)",
      "",
      "请结合上述反馈，对提示词进行整体重写与整理优化，输出完整的新版提示词。",
    ].join("\n");

    const optimized = await chatCompletion(systemPrompt, userMessage, {
      temperature: 0.3,
    });
    const normalized = normalizeOptimizedPrompt(optimized);
    if (!normalized) return null;
    if (normalized === basePrompt) return null;
    return normalized;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[prompt-feedback] optimize prompt failed: ${message}`);
    return null;
  }
}

export async function optimizeFilterPromptFromRejection(
  title: string,
  content: string | null,
  filterName: string,
  currentPrompt: string,
): Promise<string | null> {
  return optimizeFilterPrompt(
    REJECT_OPTIMIZE_SYSTEM_PROMPT,
    filterName,
    currentPrompt,
    title,
    content,
    "用户排除的新闻（不应通过该过滤器）：",
  );
}

export async function optimizeFilterPromptFromAcceptance(
  title: string,
  content: string | null,
  filterName: string,
  currentPrompt: string,
): Promise<string | null> {
  return optimizeFilterPrompt(
    ACCEPT_OPTIMIZE_SYSTEM_PROMPT,
    filterName,
    currentPrompt,
    title,
    content,
    "用户认可的新闻（应通过该过滤器）：",
  );
}
