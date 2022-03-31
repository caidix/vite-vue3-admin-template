import { PageEnum } from "/@/dependencies/enums/pageEnum";

import type { AppRouteRecordRaw, AppRouteModule } from "/@/router/types";
import { REDIRECT_ROUTE } from "./basic";

import Dashboard from "./dashboard";
import Users from "./users";

export const RootRoute: AppRouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: "Root"
  }
};
export const basicRoutes = [RootRoute, Users, Dashboard, REDIRECT_ROUTE];
