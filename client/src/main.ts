import { mount } from "svelte";
import App from "./App.svelte";
import { basePath } from "./lib/base-path";
import { connectItemStream } from "./lib/item-stream";
import { registerPwa } from "./lib/pwa";
import { initFontSize } from "./lib/fontSize.svelte";
import { initLocale } from "./lib/locale.svelte";
import { initTheme } from "./lib/theme.svelte";

function normalizePathForRouter(): void {
  const { pathname, hash, search } = window.location;
  if (hash.startsWith("#/")) return;

  const base = basePath();
  if (!base) {
    if (pathname !== "/") {
      window.location.replace(`/#${pathname}${search}`);
    }
    return;
  }

  const baseSlash = `${base}/`;
  if (pathname === base || pathname === baseSlash) {
    window.location.replace(`${baseSlash}#/${search}`);
    return;
  }

  if (pathname.startsWith(base)) {
    const sub = pathname.slice(base.length) || "/";
    window.location.replace(`${baseSlash}#${sub}${search}`);
    return;
  }

  window.location.replace(`${baseSlash}#/${search}`);
}

normalizePathForRouter();

initTheme();
initFontSize();
initLocale();
registerPwa();
connectItemStream();
mount(App, { target: document.getElementById("app")! });
