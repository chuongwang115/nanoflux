import { get, writable } from "svelte/store";

/** Logical routes (not URL pathnames). */
export type AppRoute = "/" | "/feeds";

const scrollByRoute = new Map<string, number>();

export const route = writable<AppRoute>("/");

function pathnameToRoute(pathname: string): AppRoute {
  return pathname.endsWith("/feeds") ? "/feeds" : "/";
}

function routeToRelativeHref(next: AppRoute): string {
  if (next === "/feeds") return "feeds";
  // /app/feeds has no trailing slash: ".." resolves to site root (/), not /app/.
  const path = window.location.pathname;
  return path.endsWith("/feeds/") ? ".." : "./";
}

/** Relative link to the app home (sibling of the feeds segment). */
export function homeHref(): string {
  const path = window.location.pathname;
  return path.endsWith("/feeds/") ? ".." : "./";
}

/** Relative link to the feeds page. */
export function feedsHref(): string {
  return "feeds";
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

function shouldHandleNavClick(event: MouseEvent): boolean {
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
