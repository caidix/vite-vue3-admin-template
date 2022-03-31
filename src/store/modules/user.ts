import { defineStore } from "pinia";
import { store } from "/@/store";
import { USER_INFO_KEY, USER_TOKEN_KEY, USER_ROLES_KEY } from "/@/dependencies/enums/cacheEnum";
import { LocalCache } from "/@/utils/storage/storage";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    userInfo: null,
    roleList: [],
    token: undefined,
    lastUpdateTime: 0
  }),
  getters: {
    getUserInfo() {
      return this.userInfo || LocalCache.get(USER_INFO_KEY, {});
    },
    getToken(): string {
      return this.token || LocalCache.get(USER_TOKEN_KEY, "");
    },
    getRoleList() {
      return this.roleList || LocalCache.get(USER_ROLES_KEY, []);
    }
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info || "";
      LocalCache.set(USER_TOKEN_KEY, this.token);
    },
    setUserInfo(info) {
      this.userInfo = info;
      LocalCache.set(USER_INFO_KEY, info);
    },
    setRoles(info) {
      info = info || [];
      this.roleList = info;
      LocalCache.set(USER_ROLES_KEY, info);
    },
    resetState() {
      this.userInfo = null;
      this.token = "";
      this.roleList = [];
      this.lastUpdateTime = 0;
    },
    async login() {}
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
