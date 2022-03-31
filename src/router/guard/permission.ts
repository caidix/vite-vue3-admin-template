import type { Router, RouteRecordRaw } from "vue-router";
import { RootRoute } from "../modules";
import { PageEnum } from "/@/dependencies/enums/pageEnum";
import { useUserStoreHook } from "/@/store/modules/user";

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreHook();
  router.beforeEach(async (to, from) => {
    // if (from.path === RootRoute.path && to.path === PageEnum.BASE_HOME) {
    // }
  });
}
