import { get, writable } from "svelte/store";

export type AppRoute = "/" | "/feeds";

const scrollByRoute = new Map<string, number>();

export const route = writable<AppRoute>("/");

function pathnameToRoute(pathname: string): AppRoute {
  return pathname.endsWith("/feeds") ? "/feeds" : "/";
}

/** Relative href for in-app links (works under a URL prefix). */
export function routeHref(next: AppRoute): string {
  return next === "/" ? ".." : "feeds";
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
  const target = new URL(routeHref(next), window.location.href);
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
