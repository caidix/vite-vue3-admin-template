import { defineStore } from "pinia";
import { store } from "/@/store";
import { ThemeEnum } from "/@/dependencies/enums/appEnum";
interface AppState {
  darkMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: any;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: any;
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
}
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: {
      aaa: 1
    },
    beforeMiniInfo: {},
    sidebar: {
      opened: true,
      withoutAnimation: false
    }
  }),
  getters: {
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getBeforeMiniInfo() {
      return this.beforeMiniInfo;
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
