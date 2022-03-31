import type { FunctionalComponent } from "vue";
import type { RouteLocation } from "vue-router";

export interface DefaultContext {
  Component: FunctionalComponent & { type: Recordable };
  route: RouteLocation;
}

export function getTransitionName({
  route,
  openCache,
  cacheTabs,
  enableTransition
}: Pick<DefaultContext, "route"> & {
  enableTransition: boolean;
  openCache: boolean;
  cacheTabs: string[];
}): string | undefined {
  if (!enableTransition) {
    return undefined;
  }

  const isInCache = cacheTabs.includes(route.name as string);
  const transitionName = "fade-slide";
  const name: string | undefined = transitionName;

  // if (openCache) {
  //   name = isInCache && route.meta.loaded ? transitionName : undefined;
  // }
  console.log({ tarns: name || (route.meta.transitionName as string), isInCache, route });
  return name || (route.meta.transitionName as string);
}
