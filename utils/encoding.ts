/** Charset aliases → TextDecoder labels Bun/ICU understands. */
const CHARSET_ALIASES: Record<string, string> = {
  utf8: "utf-8",
  "utf-8": "utf-8",
  unicode: "utf-8",
  "utf-16": "utf-16le",
  "utf-16le": "utf-16le",
  "utf-16be": "utf-16be",
  gbk: "gbk",
  gb2312: "gb18030",
  "gb-2312": "gb18030",
  gb18030: "gb18030",
  "gb-18030": "gb18030",
  big5: "big5",
  "big5-hkscs": "big5",
  shift_jis: "shift_jis",
  sjis: "shift_jis",
  euc_jp: "euc-jp",
  "euc-jp": "euc-jp",
  euc_kr: "euc-kr",
  "euc-kr": "euc-kr",
  iso88591: "iso-8859-1",
  "iso-8859-1": "iso-8859-1",
  latin1: "iso-8859-1",
  windows1252: "windows-1252",
  "windows-1252": "windows-1252",
  cp1252: "windows-1252",
};

const META_CHARSET_RE =
  /<meta[^>]+charset\s*=\s*["']?\s*([a-z0-9_\-]+)/i;
const META_CONTENT_TYPE_RE =
  /<meta[^>]+http-equiv\s*=\s*["']?content-type["']?[^>]+content\s*=\s*["'][^"']*charset\s*=\s*([a-z0-9_\-]+)/i;
const META_CONTENT_TYPE_RE_ALT =
  /<meta[^>]+content\s*=\s*["'][^"']*charset\s*=\s*([a-z0-9_\-]+)[^"']*["'][^>]+http-equiv\s*=\s*["']?content-type/i;
const XML_ENCODING_RE = /<\?xml[^>]+encoding\s*=\s*["']\s*([a-z0-9_\-]+)/i;
const HEADER_CHARSET_RE = /charset\s*=\s*["']?\s*([a-z0-9_\-]+)/i;

function normalizeCharset(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase().replace(/["']/g, "");
  if (!key) return null;
  return CHARSET_ALIASES[key] ?? (CHARSET_ALIASES[key.replace(/_/g, "-")] ?? key);
}

function charsetFromContentType(contentType: string | null | undefined): string | null {
  if (!contentType) return null;
  const match = contentType.match(HEADER_CHARSET_RE);
  return normalizeCharset(match?.[1]);
}

/** Peek ASCII-compatible head of HTML/XML for charset meta. */
function charsetFromHtmlHead(bytes: Uint8Array): string | null {
  const headLen = Math.min(bytes.length, 8192);
  let head = "";
  for (let i = 0; i < headLen; i++) {
    const b = bytes[i]!;
    head += b < 0x80 ? String.fromCharCode(b) : " ";
  }

  const match =
    head.match(META_CHARSET_RE) ||
    head.match(META_CONTENT_TYPE_RE) ||
    head.match(META_CONTENT_TYPE_RE_ALT) ||
    head.match(XML_ENCODING_RE);
  return normalizeCharset(match?.[1]);
}

function charsetFromBom(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return "utf-8";
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) return "utf-16le";
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) return "utf-16be";
  return null;
}

function decodeWith(label: string, bytes: Uint8Array): string | null {
  try {
    return new TextDecoder(label).decode(bytes);
  } catch {
    return null;
  }
}

function replacementRatio(text: string): number {
  if (!text) return 0;
  let bad = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 0xfffd) bad++;
  }
  return bad / text.length;
}

/**
 * Decode HTML/XML response bytes using Content-Type, BOM, meta charset,
 * then UTF-8 / GB18030 fallback when the page is heavily mojibake.
 */
export function decodeHtmlBytes(
  input: ArrayBuffer | Uint8Array | Buffer,
  contentType?: string | null,
): string {
  const bytes =
    input instanceof ArrayBuffer
      ? new Uint8Array(input)
      : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);

  const declared =
    charsetFromBom(bytes) ||
    charsetFromContentType(contentType) ||
    charsetFromHtmlHead(bytes);

  if (declared) {
    const decoded = decodeWith(declared, bytes);
    if (decoded != null) return decoded;
  }

  const utf8 = decodeWith("utf-8", bytes) ?? "";
  if (replacementRatio(utf8) < 0.02) return utf8;

  const gb = decodeWith("gb18030", bytes);
  if (gb != null && replacementRatio(gb) < replacementRatio(utf8)) return gb;

  return utf8;
}
