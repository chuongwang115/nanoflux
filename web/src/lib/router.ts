import { get, writable } from "svelte/store";

export type AppRoute = "/" | "/feeds";

const scrollByRoute = new Map<string, number>();

export const route = writable<AppRoute>("/");

function pathnameToRoute(pathname: string): AppRoute {
  return pathname.endsWith("/feeds") ? "/feeds" : "/";
}

/** Pathname one segment above the current URL (e.g. /app/feeds → /app/). */
export function parentPathname(): string {
  const parts = window.location.pathname.replace(/\/$/, "").split("/").filter(Boolean);
  parts.pop();
  return parts.length ? `/${parts.join("/")}/` : "/";
}

/** Relative link to the parent of the current URL. */
export function parentHref(): string {
  return "..";
}

export function navigateToParent() {
  const targetPath = parentPathname();
  const current = get(route);
  const next = pathnameToRoute(targetPath);
  if (window.location.pathname === targetPath && current === next) return;

  saveScroll(current);
  history.pushState(null, "", targetPath + window.location.search);
  route.set(next);
  restoreScroll(next);
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
  const target = new URL(next === "/feeds" ? "feeds" : next, window.location.href);
  const current = get(route);
  if (window.location.pathname === target.pathname && current === next) return;

  saveScroll(current);
  history.pushState(null, "", target.pathname + window.location.search);
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
