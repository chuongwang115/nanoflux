import Parser from "rss-parser";
import { httpGet } from "./http-fetcher";

export const RSS_USER_AGENT = "NanoFlux/1.0 (+https://github.com/nanoflux)";
export const RSS_TIMEOUT_MS = 15_000;

export async function fetchRssFeed<
  TFeed extends Record<string, unknown> = Record<string, unknown>,
  TItem extends Record<string, unknown> = Record<string, unknown>,
>(
  url: string,
  parser: Parser<TFeed, TItem> = new Parser<TFeed, TItem>(),
): Promise<Parser.Output<TFeed & TItem>> {
  const response = await httpGet(url, {
    headers: { "User-Agent": RSS_USER_AGENT },
    signal: AbortSignal.timeout(RSS_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return parser.parseString(await response.text());
}
