import type { RouteLocationNormalized, Router } from "vue-router";

import { useRouter } from "vue-router";
import { unref } from "vue";

import { useCacheTabStoreHook } from "/@/store/modules/cacheTab";
import { useSettingStoreHook } from "/@/store/modules/settings";

enum TableActionEnum {
  REFRESH,
  CLOSE_ALL,
  CLOSE_LEFT,
  CLOSE_RIGHT,
  CLOSE_OTHER,
  CLOSE_CURRENT,
  CLOSE
}

export function useTabs(_router?: Router, currentRoute?: RouteLocationNormalized) {
  const settingStore = useSettingStoreHook();
  const tabStore = useCacheTabStoreHook();

  function isShowTab(): boolean {
    const { show } = settingStore.getCacheTabSetting;
    return !!show;
  }

  const router = _router || useRouter();
  currentRoute = currentRoute ? currentRoute : unref(router.currentRoute);

  function getCurrentTab() {
    const route = unref(currentRoute);
    return tabStore.getTabList.find(item => item.path === route.path)!;
  }

  async function updateTabTitle(title: string, tab?: RouteLocationNormalized) {
    const canUseTab = isShowTab();
    if (!canUseTab) {
      return;
    }
    const targetTab = tab || getCurrentTab();
    tabStore.setTabTitle(title, targetTab);
  }

  async function updateTabPath(path: string, tab?: RouteLocationNormalized) {
    const canUseTab = isShowTab();
    if (!canUseTab) {
      return;
    }
    const targetTab = tab || getCurrentTab();
    await tabStore.updateTabPath(path, targetTab);
  }

  async function handleTabAction(action: TableActionEnum, tab?: RouteLocationNormalized) {
    const canUseTab = isShowTab();
    if (!canUseTab) {
      return;
    }
    const currentTab = getCurrentTab();
    switch (action) {
      case TableActionEnum.REFRESH:
        await tabStore.RefreshTab(router);
        break;

      case TableActionEnum.CLOSE_ALL:
        await tabStore.closeAllTab(router);
        break;

      case TableActionEnum.CLOSE_LEFT:
        await tabStore.closeLeftTabs(currentTab, router);
        break;

      case TableActionEnum.CLOSE_RIGHT:
        await tabStore.closeRightTabs(currentTab, router);
        break;

      case TableActionEnum.CLOSE_OTHER:
        await tabStore.closeOtherTabs(currentTab, router);
        break;

      case TableActionEnum.CLOSE_CURRENT:
      case TableActionEnum.CLOSE:
        await tabStore.closeTab(tab || currentTab, router);
        break;
    }
  }

  return {
    refreshPage: () => handleTabAction(TableActionEnum.REFRESH),
    closeAll: () => handleTabAction(TableActionEnum.CLOSE_ALL),
    closeLeft: () => handleTabAction(TableActionEnum.CLOSE_LEFT),
    closeRight: () => handleTabAction(TableActionEnum.CLOSE_RIGHT),
    closeOther: () => handleTabAction(TableActionEnum.CLOSE_OTHER),
    closeCurrent: () => handleTabAction(TableActionEnum.CLOSE_CURRENT),
    close: (tab?: RouteLocationNormalized) => handleTabAction(TableActionEnum.CLOSE, tab),
    setTitle: (title: string, tab?: RouteLocationNormalized) => updateTabTitle(title, tab),
    updatePath: (fullPath: string, tab?: RouteLocationNormalized) => updateTabPath(fullPath, tab)
  };
}
