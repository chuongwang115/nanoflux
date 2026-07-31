import { EnvHttpProxyAgent, fetch as undiciFetch } from "undici";
import type { RequestInit as UndiciRequestInit } from "undici";

const dispatcher = new EnvHttpProxyAgent();

async function httpRequest(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  return undiciFetch(url, { ...init, dispatcher }) as unknown as Response;
}

export async function httpGet(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  return httpRequest(url, init);
}

export async function httpPost(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  return httpRequest(url, { ...init, method: init.method ?? "POST" });
}

export async function httpDelete(
  url: string,
  init: UndiciRequestInit = {},
): Promise<Response> {
  return httpRequest(url, { ...init, method: "DELETE" });
}
