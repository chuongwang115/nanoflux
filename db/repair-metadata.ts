import { eq } from "drizzle-orm";
import { db } from "./database";
import { items } from "./schema";
import { parseWhitelistKeywords } from "../services/filters/whitelist";
import { getSettings } from "../settings";
import { isStoredKeywordList } from "../utils/text";

function matchWhitelistKeywords(
  title: string,
  content: string | null,
  keywords: string[],
): string | null {
  if (keywords.length === 0) return null;
  const haystack = `${title}\n${content ?? ""}`.toLowerCase();
  const matched = keywords.filter((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  );
  return matched.length > 0 ? matched.join(",") : null;
}

/** Move legacy AI prose out of `matched_keywords` and backfill whitelist hits. */
export function repairItemFilterMetadata(): void {
  const whitelist = parseWhitelistKeywords(getSettings().whitelist);
  const failed = db
    .select({
      id: items.id,
      title: items.title,
      content: items.content,
      matched_keywords: items.matched_keywords,
      pass_reason: items.pass_reason,
    })
    .from(items)
    .where(eq(items.filter_passed, 0))
    .all();

  for (const row of failed) {
    let matched_keywords = row.matched_keywords;
    let pass_reason = row.pass_reason;

    if (
      matched_keywords &&
      !isStoredKeywordList(matched_keywords) &&
      !pass_reason
    ) {
      pass_reason = matched_keywords;
      matched_keywords = null;
    }

    if (!matched_keywords) {
      matched_keywords = matchWhitelistKeywords(
        row.title,
        row.content,
        whitelist,
      );
    }

    if (
      matched_keywords === row.matched_keywords &&
      pass_reason === row.pass_reason
    ) {
      continue;
    }

    db.update(items)
      .set({ matched_keywords, pass_reason })
      .where(eq(items.id, row.id))
      .run();
  }
}
