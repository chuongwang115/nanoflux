export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain text with paragraph breaks preserved from block-level HTML. */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|section|article|h[1-6]|li|tr|blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Remove srcset attrs so sanitize-html/parse-srcset never see invalid `0w` etc. */
export function stripSrcsetAttributes(html: string): string {
  return html.replace(
    /\s(?:srcset|data-srcset|imagesrcset)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
    "",
  );
}
