import { mount } from "svelte";
import App from "./App.svelte";
import { registerPwa } from "./lib/pwa";
import { initFontSize } from "./lib/fontSize.svelte";
import { initLocale } from "./lib/locale.svelte";
import { initTheme } from "./lib/theme.svelte";
import { initSidebar } from "./lib/sidebar.svelte";
import { initRouter } from "./lib/router";

initRouter();

initTheme();
initSidebar();
initFontSize();
initLocale();
registerPwa();
mount(App, { target: document.getElementById("app")! });
