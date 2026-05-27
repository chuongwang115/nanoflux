import { withBase } from "./base-path";

export function registerPwa() {
  if (!("serviceWorker" in navigator)) return;

  const swUrl = withBase("/sw.js");
  const scope = withBase("/");

  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register(swUrl, { scope })
      .catch((err) => console.warn("[pwa] service worker registration failed", err));
  });
}
