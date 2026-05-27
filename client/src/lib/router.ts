import { get, writable } from "svelte/store";
import { basePath, withBase } from "./base-path";

export type AppRoute = "/" | "/feeds";

const scrollByRoute = new Map<string, number>();

export const route = writable<AppRoute>("/");

function pathnameToRoute(pathname: string): AppRoute {
  const base = basePath();
  let path = pathname;
  if (base) {
    if (pathname === base || pathname === `${base}/`) {
      path = "/";
    } else if (pathname.startsWith(`${base}/`)) {
      path = pathname.slice(base.length);
    } else {
      path = "/";
    }
  }
  return path === "/feeds" ? "/feeds" : "/";
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
  const target = new URL(withBase(next), window.location.origin);
  const current = get(route);
  if (window.location.pathname === target.pathname && current === next) return;

  saveScroll(current);
  history.pushState(null, "", target.pathname + window.location.search);
  route.set(next);
  restoreScroll(next);
}

/** Redirect legacy `/#/…` URLs to pathname routes. */
function migrateHashRoute(): void {
  const { hash, search } = window.location;
  if (!hash.startsWith("#/")) return;

  const path = hash.slice(1).split("?")[0] || "/";
  const appPath: AppRoute = path === "/feeds" ? "/feeds" : "/";
  history.replaceState(null, "", withBase(appPath) + search);
}

export function initRouter(): void {
  migrateHashRoute();
  syncRouteFromLocation();

  window.addEventListener("popstate", () => {
    syncRouteFromLocation();
    restoreScroll(get(route));
  });
}

export function navClick(next: AppRoute) {
  return (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(next);
  };
}
