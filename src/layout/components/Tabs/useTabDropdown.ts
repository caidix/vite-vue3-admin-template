import type { TabContentProps } from "./types";
import type { ComputedRef } from "vue";

import { computed, unref, reactive } from "vue";
import { MenuEventEnum } from "./types";
import { useCacheTabStoreHook } from "/@/store/modules/cacheTab";
import { RouteLocationNormalized, useRouter } from "vue-router";
import { useTabs } from "/@/hooks/useTabs";
export interface DropMenuProps {
  icon: string;
  event: MenuEventEnum;
  text: string;
  disabled: boolean;
  divider?: boolean;
}
export interface TabItemProps {
  current: RouteLocationNormalized | null;
  currentIndex: number;
}
export function useTabDropdown(tabContentProps: TabItemProps, getIsTabs: boolean) {
  const tabStore = useCacheTabStoreHook();
  const router = useRouter();
  const { currentRoute } = router;
  const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs(
    router,
    tabContentProps.current
  );

  const getTargetTab = computed((): RouteLocationNormalized => {
    return getIsTabs ? tabContentProps.current : unref(currentRoute);
  });

  /**
   * @description: drop-down list
   */
  const getDropMenuList = computed(() => {
    if (!unref(getTargetTab)) {
      return;
    }
    const { meta } = unref(getTargetTab);
    const { path } = unref(currentRoute);

    const isCurItem = getTargetTab.value ? unref(getTargetTab).path === path : false;

    // Refresh button
    const index = tabContentProps.currentIndex;
    const refreshDisabled = !isCurItem;
    // Close left
    const closeLeftDisabled = index === 0 || !isCurItem;

    const disabled = tabStore.getTabList.length === 1;

    // Close right
    const closeRightDisabled = !isCurItem || index === tabStore.getTabList.length - 1;
    const dropMenuList: DropMenuProps[] = [
      {
        icon: "ion:reload-sharp",
        event: MenuEventEnum.REFRESH_PAGE,
        text: "重新加载",
        disabled: refreshDisabled
      },
      {
        icon: "clarity:close-line",
        event: MenuEventEnum.CLOSE_CURRENT,
        text: "关闭当前标签页",
        disabled: !!meta?.affix || disabled,
        divider: true
      },
      {
        icon: "line-md:arrow-close-left",
        event: MenuEventEnum.CLOSE_LEFT,
        text: "关闭左侧标签页",
        disabled: closeLeftDisabled,
        divider: false
      },
      {
        icon: "line-md:arrow-close-right",
        event: MenuEventEnum.CLOSE_RIGHT,
        text: "关闭右侧标签页",
        disabled: closeRightDisabled,
        divider: true
      },
      {
        icon: "dashicons:align-center",
        event: MenuEventEnum.CLOSE_OTHER,
        text: "关闭其余标签页",
        disabled: disabled || !isCurItem
      },
      {
        icon: "clarity:minus-line",
        event: MenuEventEnum.CLOSE_ALL,
        text: "关闭全部标签页",
        disabled: disabled
      }
    ];

    return dropMenuList;
  });

  // Handle right click event
  function handleMenuEvent(menu): void {
    const { event } = menu;
    switch (event) {
      case MenuEventEnum.REFRESH_PAGE:
        // refresh page
        refreshPage();
        break;
      // Close current
      case MenuEventEnum.CLOSE_CURRENT:
        close(tabContentProps.current);
        break;
      // Close left
      case MenuEventEnum.CLOSE_LEFT:
        closeLeft();
        break;
      // Close right
      case MenuEventEnum.CLOSE_RIGHT:
        closeRight();
        break;
      // Close other
      case MenuEventEnum.CLOSE_OTHER:
        closeOther();
        break;
      // Close all
      case MenuEventEnum.CLOSE_ALL:
        closeAll();
        break;
    }
  }
  return { getDropMenuList, handleMenuEvent };
}
