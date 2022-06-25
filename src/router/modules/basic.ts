import { LAYOUT, REDIRECT_NAME } from "../constant";
import { AppRouteRecordRaw } from "../types";

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: "/redirect",
  component: LAYOUT,
  name: "RedirectTo",
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true
  },
  children: [
    {
      path: "/redirect/:path(.*)",
      name: REDIRECT_NAME,
      component: () => import("/@/views/redirect/index.vue"),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true
      }
    }
  ]
};

export const LOGIN: AppRouteRecordRaw = {
  path: "/login",
  name: "login",
  component: () => import("/@/views/login/index.vue"),
  meta: {
    title: "登录",
    showLink: false,
    rank: 101
  }
};

export default [LOGIN, REDIRECT_ROUTE];
