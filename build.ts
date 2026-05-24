import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { $ } from "bun";
import { SveltePlugin } from "bun-plugin-svelte";
import postcss from "postcss";
import postcssConfig from "./postcss.config.mjs";

const root = import.meta.dir;
const clientDir = path.join(root, "client");
const publicDir = path.join(root, "public");
const assetsDir = path.join(publicDir, "assets");
const staticDir = path.join(clientDir, "static");

await rm(assetsDir, { recursive: true, force: true });
await mkdir(assetsDir, { recursive: true });

const appCssIn = path.join(clientDir, "src/app.css");
const appCssOut = path.join(assetsDir, "app.css");
const appCssResult = await postcss(postcssConfig.plugins).process(
  await readFile(appCssIn, "utf8"),
  { from: appCssIn, to: appCssOut },
);
await writeFile(appCssOut, appCssResult.css);

const result = await Bun.build({
  entrypoints: [path.join(clientDir, "src/main.ts")],
  outdir: assetsDir,
  target: "browser",
  plugins: [SveltePlugin()],
});

if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}

const jsFile = result.outputs.find((o) => o.path.endsWith(".js"));
if (!jsFile) {
  console.error("No JS output from build");
  process.exit(1);
}

const jsName = path.basename(jsFile.path);

const swResult = await Bun.build({
  entrypoints: [path.join(clientDir, "src/sw.ts")],
  outdir: publicDir,
  target: "browser",
  format: "iife",
  define: {
    BUILD_PRECACHE: JSON.stringify([
      `/assets/${jsName}`,
      "/assets/app.css",
    ]),
  },
});

if (!swResult.success) {
  console.error(swResult.logs);
  process.exit(1);
}

const swOut = swResult.outputs.find((o) => o.path.endsWith(".js"));
if (swOut) {
  await Bun.write(path.join(publicDir, "sw.js"), swOut);
}

await cp(staticDir, publicDir, { recursive: true });

const prefsInitScript = `<script>
(function () {
  try {
    var l = localStorage.getItem("nanoflux-locale");
    var loc = l === "en" ? "en" : l === "zh" ? "zh" : (navigator.language.toLowerCase().indexOf("zh") === 0 ? "zh" : "en");
    document.documentElement.lang = loc === "zh" ? "zh-CN" : "en";
    var desc = loc === "en" ? "Lightweight RSS reader" : "轻量 RSS 阅读器";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", desc);
    var mf = document.querySelector('link[rel="manifest"]');
    if (mf) mf.href = "/manifest.webmanifest?locale=" + loc;
    var t = localStorage.getItem("nanoflux-theme");
    if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches))
      document.documentElement.classList.add("dark");
    if (localStorage.getItem("nanoflux-font-size") === "large")
      document.documentElement.classList.add("font-large");
  } catch (e) {}
})();
</script>`;

await writeFile(
  path.join(publicDir, "index.html"),
  `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="description" content="轻量 RSS 阅读器" />
    <meta name="theme-color" content="#171717" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="NanoFlux" />
    <title>NanoFlux</title>
    <link rel="manifest" href="/manifest.webmanifest?locale=zh" />
    <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    ${prefsInitScript}
    <link rel="stylesheet" href="/assets/app.css" />
    <script type="module" crossorigin src="/assets/${jsName}"></script>
  </head>
  <body class="min-h-screen bg-white text-base text-neutral-900 antialiased font-sans dark:bg-neutral-950 dark:text-neutral-100">
    <div id="app"></div>
  </body>
</html>
`,
);

console.log(`Built frontend → public/index.html, public/assets/${jsName}`);
