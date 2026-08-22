import { get, writable } from "svelte/store";

/** Logical routes (not URL pathnames). */
export type AppRoute = "/" | "/feeds" | "/filter" | "/export" | "/fever";

const scrollByRoute = new Map<string, number>();

export const route = writable<AppRoute>("/");

const SUBPAGE_PATH_SUFFIXES = ["/feeds/", "/filter/", "/export/", "/fever/"];

function isSubPagePath(path: string): boolean {
  return SUBPAGE_PATH_SUFFIXES.some((suffix) => path.endsWith(suffix));
}

function pathnameToRoute(pathname: string): AppRoute {
  if (pathname.endsWith("/feeds")) return "/feeds";
  if (pathname.endsWith("/filter") || pathname.endsWith("/filters")) {
    return "/filter";
  }
  if (pathname.endsWith("/export")) return "/export";
  if (pathname.endsWith("/fever")) return "/fever";
  return "/";
}

function routeToRelativeHref(next: AppRoute): string {
  if (next === "/feeds") return "feeds";
  if (next === "/filter") return "filter";
  if (next === "/export") return "export";
  if (next === "/fever") return "fever";
  if (isSubPagePath(window.location.pathname)) {
    return "..";
  }
  return "./";
}

/** Relative link to the app home (sibling of the feeds segment). */
export function homeHref(): string {
  if (isSubPagePath(window.location.pathname)) {
    return "..";
  }
  return "./";
}

/** Relative link to the feeds page. */
export function feedsHref(): string {
  return "feeds";
}

/** Relative link to the filter page. */
export function filterHref(): string {
  return "filter";
}

/** Relative link to the export page. */
export function exportHref(): string {
  return "export";
}

/** Relative link to the Fever page. */
export function feverHref(): string {
  return "fever";
}

function saveScroll(current: AppRoute) {
  scrollByRoute.set(current, window.scrollY);
}

function restoreScroll(next: AppRoute) {
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollByRoute.get(next) ?? 0);
  });
}

export function syncRouteFromLocation() {
  route.set(pathnameToRoute(window.location.pathname));
}

export function navigate(next: AppRoute) {
  const current = get(route);
  if (current === next) return;

  const href = routeToRelativeHref(next);
  const target = new URL(href, window.location.href);
  if (window.location.pathname === target.pathname) return;

  saveScroll(current);
  history.pushState(null, "", href + window.location.search);
  route.set(next);
  restoreScroll(next);
}

export function initRouter(): void {
  syncRouteFromLocation();

  window.addEventListener("popstate", () => {
    syncRouteFromLocation();
    restoreScroll(get(route));
  });
}

export function shouldHandleNavClick(event: MouseEvent): boolean {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }
  return true;
}

export function navClick(next: AppRoute) {
  return (event: MouseEvent) => {
    if (!shouldHandleNavClick(event)) return;
    event.preventDefault();
    navigate(next);
  };
}
