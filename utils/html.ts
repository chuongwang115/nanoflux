export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Remove srcset attrs so sanitize-html/parse-srcset never see invalid `0w` etc. */
export function stripSrcsetAttributes(html: string): string {
  return html.replace(
    /\s(?:srcset|data-srcset|imagesrcset)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
    "",
  );
}
