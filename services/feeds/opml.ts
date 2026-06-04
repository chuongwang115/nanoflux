import type { Feed } from "../../db/schema";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function attr(value: string): string {
  return `"${escapeXml(value)}"`;
}

function outlineXml(feed: Pick<Feed, "title" | "url" | "description">): string {
  const attrs = [
    `type=${attr("rss")}`,
    `text=${attr(feed.title)}`,
    `title=${attr(feed.title)}`,
    `xmlUrl=${attr(feed.url)}`,
  ];
  if (feed.description?.trim()) {
    attrs.push(`description=${attr(feed.description.trim())}`);
  }
  return `    <outline ${attrs.join(" ")}/>`;
}

export function feedsToOpml(
  feedList: Pick<Feed, "title" | "url" | "description">[],
  title = "NanoFlux",
): string {
  const dateCreated = new Date().toUTCString();
  const outlines = feedList.map(outlineXml).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXml(title)}</title>
    <dateCreated>${escapeXml(dateCreated)}</dateCreated>
  </head>
  <body>
${outlines}
  </body>
</opml>
`;
}
