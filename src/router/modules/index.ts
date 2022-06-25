import { PageEnum } from "/@/dependencies/enums/pageEnum";

import type { AppRouteRecordRaw, AppRouteModule } from "/@/router/types";
import Basic from "./basic";

import Dashboard from "./dashboard";
import Users from "./users";
import Errors from "./error";

export const RootRoute: AppRouteRecordRaw = {
  path: "/",
  name: "Root",
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: "Root"
  }
};
export const basicRoutes = [RootRoute, Users, Dashboard, ...Basic, Errors];
