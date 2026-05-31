import { createHash } from "node:crypto";

const MD5_HEX_RE = /^[a-f0-9]{32}$/i;

export function isMd5Format(value: string): boolean {
  return MD5_HEX_RE.test(value);
}

export function md5Hex(input: string): string {
  return createHash("md5").update(input).digest("hex");
}
