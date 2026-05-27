import { mount } from "svelte";
import App from "./App.svelte";
import { connectItemStream } from "./lib/item-stream";
import { registerPwa } from "./lib/pwa";
import { initFontSize } from "./lib/fontSize.svelte";
import { initLocale } from "./lib/locale.svelte";
import { initTheme } from "./lib/theme.svelte";
import { initRouter } from "./lib/router";

initRouter();

initTheme();
initFontSize();
initLocale();
registerPwa();
connectItemStream();
mount(App, { target: document.getElementById("app")! });
