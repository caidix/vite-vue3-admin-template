import type { Router, RouteLocationNormalized } from "vue-router";
import nprogress from "nprogress";
import { useTransitionSetting } from "/@/hooks/useTransitionSetting";
import { unref } from "vue";

export function setupRouterGuard(router: Router) {
  createProgressGuard(router);
  createScrollGuard(router);
}

function createProgressGuard(router: Router) {
  const { getOpenNProgress } = useTransitionSetting();
  router.beforeEach(async to => {
    if (to.meta.loaded) {
      return true;
    }
    unref(getOpenNProgress) && nprogress.start();
    return true;
  });
  router.afterEach(async () => {
    unref(getOpenNProgress) && nprogress.done();
    return true;
  });
}

// Routing switch back to the top
function createScrollGuard(router: Router) {
  const isHash = (href: string) => {
    return /^#/.test(href);
  };

  const body = document.body;

  router.afterEach(async to => {
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
    return true;
  });
}
