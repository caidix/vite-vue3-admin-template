import {
  Router,
  createRouter,
  RouteComponent,
  createWebHashHistory,
  RouteRecordRaw
} from "vue-router";
import type { App } from "vue";
import { basicRoutes } from "./modules";

export const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}
