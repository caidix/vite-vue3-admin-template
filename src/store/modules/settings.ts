import defaultSettings from "/@/settings";
import { defineStore } from "pinia";
import { store } from "/@/store";

export const useSettingStore = defineStore({
  id: "settings",
  state: () => ({
    ...defaultSettings
  }),
  getters: {
    getSidebar() {
      return this.sidebar;
    },
    getTransitionSetting() {
      return this?.transitionSetting || {};
    },
    getCacheTabSetting() {
      return this?.cacheTabSetting;
    }
  },
  actions: {
    changeSetting({ key, value }) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    },
    toggleSidebar(hide) {
      this.sidebar = {
        ...this.sidebar,
        hide
      };
    },
    setProjectConfig(key, value): void {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value;
      }
    }
  }
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
