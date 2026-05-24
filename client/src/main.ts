import { mount } from "svelte";
import App from "./App.svelte";
import { registerPwa } from "./lib/pwa";
import { initFontSize } from "./lib/fontSize.svelte";
import { initLocale } from "./lib/locale.svelte";
import { initTheme } from "./lib/theme.svelte";

const { pathname, hash, search } = window.location;
if (pathname !== "/" && !hash.startsWith("#/")) {
  window.location.replace(`/#${pathname}${search}`);
}

initTheme();
initFontSize();
initLocale();
registerPwa();
mount(App, { target: document.getElementById("app")! });
