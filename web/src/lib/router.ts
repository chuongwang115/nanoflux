import { get, writable } from "svelte/store";

/** Logical routes (not URL pathnames). */
export type AppRoute = "/" | "/feeds" | "/filters" | "/export";

const scrollByRoute = new Map<string, number>();

export const route = writable<AppRoute>("/");

const SUBPAGE_PATH_SUFFIXES = ["/feeds/", "/filters/", "/export/"];

function isSubPagePath(path: string): boolean {
  return SUBPAGE_PATH_SUFFIXES.some((suffix) => path.endsWith(suffix));
}

function pathnameToRoute(pathname: string): AppRoute {
  if (pathname.endsWith("/feeds")) return "/feeds";
  if (pathname.endsWith("/filters")) return "/filters";
  if (pathname.endsWith("/export")) return "/export";
  return "/";
}

function routeToRelativeHref(next: AppRoute): string {
  if (next === "/feeds") return "feeds";
  if (next === "/filters") return "filters";
  if (next === "/export") return "export";
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

/** Relative link to the filters page. */
export function filtersHref(): string {
  return "filters";
}

/** Relative link to the export page. */
export function exportHref(): string {
  return "export";
}

export function navigateToParent() {
  navigate("/");
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

export function navClickParent() {
  return (event: MouseEvent) => {
    if (!shouldHandleNavClick(event)) return;
    event.preventDefault();
    navigateToParent();
  };
}
