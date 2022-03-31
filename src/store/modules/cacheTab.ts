import { toRaw, unref } from "vue";
import { defineStore } from "pinia";
import { store } from "/@/store";
import defaultSettings from "/@/settings";
import { LocalCache } from "/@/utils/storage/storage";
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
  Router,
  RouteRecordNormalized
} from "vue-router";
import { PageEnum } from "/@/dependencies/enums/pageEnum";
import { CACHE_TAB_SETTING } from "/@/dependencies/enums/cacheEnum";
import { useGo, useRedo } from "/@/hooks/usePage";

const getToTarget = (tabItem: RouteLocationNormalized) => {
  const { params, path, query } = tabItem;
  return {
    params: params || {},
    path,
    query: query || {}
  };
};

function handleGotoPage(router: Router) {
  const go = useGo(router);
  const len = this.tabList.length;
  const { path } = unref(router.currentRoute);

  let toPath: PageEnum | string = PageEnum.BASE_HOME;

  if (len > 0) {
    const page = this.tabList[len - 1];
    const p = page.fullPath || page.path;
    if (p) {
      toPath = p;
    }
  }
  // Jump to the current page and report an error
  path !== toPath && go(toPath as PageEnum, true);
}

function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) {
    return route;
  }
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map(item => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined) as RouteRecordNormalized[]
  };
}
const isCacheTab = defaultSettings.cacheTabSetting.cache;
export const useCacheTabStore = defineStore({
  id: "cacheTab",
  state: () => ({
    cacheTabList: new Set(),
    tabList: isCacheTab ? LocalCache.get(CACHE_TAB_SETTING, []) : []
  }),
  getters: {
    getCacheTabList(): string[] {
      return Array.from(this.cacheTabList);
    },
    getTabList() {
      return this.tabList;
    }
  },
  actions: {
    addTab(route: RouteLocationNormalized) {
      const { path, name, fullPath, params, query, meta } = getRawRoute(route);

      if (path === PageEnum.ERROR_PAGE || path === PageEnum.BASE_LOGIN || !name) {
        return;
      }

      // 是否为已存在的标签
      let updateIndex = -1;
      const tabHasExits = this.tabList.some((tab, index) => {
        updateIndex = index;
        return (tab.fullPath || tab.path) === (fullPath || path);
      });
      // 若为已存在标签则执行更新操作
      if (tabHasExits) {
        const curTab = toRaw(this.tabList)[updateIndex];
        if (!curTab) {
          return;
        }
        curTab.params = params || curTab.params;
        curTab.query = query || curTab.query;
        curTab.fullPath = fullPath || curTab.fullPath;
        this.tabList.splice(updateIndex, 1, curTab);
      } else {
        // Add tab - 控制动态路由打开数， meta需要增加dynamicLevel和realPath参数
        // 获取动态路由打开数，超过 0 即代表需要控制打开数
        const dynamicLevel = meta?.dynamicLevel ?? -1;
        if (dynamicLevel > 0) {
          // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
          // 首先获取到真实的路由，使用配置方式减少计算开销.
          // const realName: string = path.match(/(\S*)\//)![1];
          const realPath = meta?.realPath ?? "";
          // 获取到已经打开的动态路由数, 判断是否大于某一个值
          if (
            this.tabList.filter(e => e.meta?.realPath ?? "" === realPath).length >= dynamicLevel
          ) {
            // 关闭第一个
            const index = this.tabList.findIndex(item => item.meta.realPath === realPath);
            index !== -1 && this.tabList.splice(index, 1);
          }
        }
        this.tabList.push({
          ...route
        });
      }
      this.updateCacheTab();
      isCacheTab && LocalCache.set(CACHE_TAB_SETTING, this.tabList);
    },

    // 更新缓存tab
    updateCacheTab(): void {
      const cacheMap: Set<string> = new Set();

      for (const tab of this.tabList) {
        const item = getRawRoute(tab);
        // 默认开启缓存，ignoreKeepAlive为true时代表该页面关闭缓存
        const needCache = !item.meta?.ignoreKeepAlive;
        if (!needCache) {
          continue;
        }
        const name = item.name as string;
        cacheMap.add(name);
      }
      this.cacheTabList = cacheMap;
    },

    clearCacheTabs(): void {
      this.cacheTabList = new Set();
    },

    bulkCloseTabs(pathList: string[]) {
      this.tabList = this.tabList.filter(item => !pathList.includes(item.fullPath));
    },

    resetState(): void {
      this.tabList = [];
      this.clearCacheTabs();
    },

    async RefreshTab(router: Router) {
      const { currentRoute } = router;
      const route = unref(currentRoute);
      const name = route.name;
      const findTab = this.getCacheTabList.find(item => item === name);
      if (findTab) {
        this.cacheTabList.delete(findTab);
      }
      const redo = useRedo(router);
      await redo();
    },

    goTo(router: Router) {
      const go = useGo(router);
      const { currentRoute } = router;
      const len = this.tabList.length;
      const { path } = unref(currentRoute);
      let toPath: PageEnum | string = PageEnum.BASE_HOME;

      if (len > 0) {
        const page = this.tabList[len - 1];
        const p = page.fullPath || page.path;
        if (p) {
          toPath = p;
        }
      }
      if (path !== toPath) {
        go(toPath, true);
      }
    },

    closeAllTab(router: Router) {
      this.tabList = this.tabList.filter(item => item?.meta?.affix ?? false);
      this.clearCacheTabs();
      this.goTo(router);
    },

    async closeTab(tab: RouteLocationNormalized, router: Router) {
      const close = (route: RouteLocationNormalized) => {
        const { fullPath, meta: { affix } = {} } = route;
        if (affix) {
          return;
        }
        const index = this.tabList.findIndex(item => item.fullPath === fullPath);
        index !== -1 && this.tabList.splice(index, 1);
      };
      const { currentRoute, replace } = router;

      const { path } = unref(currentRoute);

      // 关闭非当前tab项
      if (path !== tab.path) {
        close(tab);
        return;
      }

      let toTarget: RouteLocationRaw = {};
      const index = this.tabList.findIndex(item => item.path === path);
      // 如果当前tab在最左侧
      if (index === 0) {
        if (this.tabList.length === 1) {
          toTarget = PageEnum.BASE_HOME;
        } else {
          toTarget = getToTarget(this.tabList[index + 1]);
        }
      } else {
        toTarget = getToTarget(this.tabList[index - 1]);
      }
      close(currentRoute.value);
      await replace(toTarget);
    },

    async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex(item => item.path === route.path);
      if (index > 0) {
        const leftTabs = this.tabList.slice(0, index);
        const pathTabs: string[] = [];
        leftTabs.forEach(item => {
          const affix = item?.meta?.affix ?? false;
          if (!affix) {
            pathTabs.push(item.fullPath);
          }
        });
        this.bulkCloseTabs(pathTabs);
      }
      this.updateCacheTab();
      handleGotoPage(router);
    },

    async closeRightTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.tabList.findIndex(item => item.path === route.path);
      if (index < this.tabList.length) {
        const rightTabs = this.tabList.slice(index + 1, this.tabList.length);
        const pathTabs: string[] = [];
        rightTabs.forEach(item => {
          const affix = item?.meta?.affix ?? false;
          if (!affix) {
            pathTabs.push(item.fullPath);
          }
        });
        this.bulkCloseTabs(pathTabs);
      }
      debugger;
      this.updateCacheTab();
      handleGotoPage(router);
    },

    async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
      const otherTabs = this.tabList
        .filter(item => item.path !== route.path)
        .filter(item => {
          const affix = item?.meta?.affix ?? false;
          return !affix;
        })
        .map(item => item.fullPath);
      this.bulkCloseTabs(otherTabs);
      this.updateCacheTab();
      handleGotoPage(router);
    },

    async closeTabByKey(key: string, router: Router) {
      const index = this.tabList.findIndex(item => (item.fullPath || item.path) === key);
      if (index !== -1) {
        await this.closeTab(this.tabList[index], router);
        const { currentRoute, replace } = router;
        const isActivated = this.tabList.findIndex(item => {
          return item.fullPath === currentRoute.value.fullPath;
        });
        if (isActivated === -1) {
          let pageIndex;
          if (index > 0) {
            pageIndex = index - 1;
          } else if (index < this.tabList.length - 1) {
            pageIndex = index + 1;
          } else {
            pageIndex = -1;
          }
          if (pageIndex >= 0) {
            const page = this.tabList[index - 1];
            const toTarget = getToTarget(page);
            await replace(toTarget);
          }
        }
      }
    },

    /**
     * 组件内部改变tabs标题方法
     */
    async setTabTitle(title: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find(item => item === route);
      if (findTab) {
        findTab.meta.title = title;
        await this.updateCacheTab();
      }
    },

    /**
     * 替换地址
     * **/
    async updateTabPath(fullPath: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find(item => item === route);
      if (findTab) {
        findTab.fullPath = fullPath;
        findTab.path = fullPath;
        await this.updateCacheTab();
      }
    }
  }
});

export function useCacheTabStoreHook() {
  return useCacheTabStore(store);
}
