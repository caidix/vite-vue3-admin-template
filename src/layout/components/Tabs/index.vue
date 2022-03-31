<template>
  <div ref="containerRef" class="tags-view" v-if="tabSetting.show">
    <svg-icon
      class="shadow-icon-left icon-center"
      icon="mdi:chevron-left"
      color="#00000073"
      :size="20"
      @click="handleScroll(200)"
    />

    <div ref="scrollDomRef" class="scroll-container">
      <div class="tab" ref="tabDomRef" :style="scrollTabStyle">
        <div
          v-for="item in tabsState"
          :key="item.path"
          :class="[
            tabSetting.showModel,
            'scroll-item is-closable schedule',
            isActive(item) ? `${tabSetting.showModel}-active` : ''
          ]"
          @click="handleRouteTo(item)"
          @contextmenu.prevent="handleOpenMenu(item, $event)"
        >
          {{ item.meta?.title }}
          <svg-icon
            v-if="!item.meta?.affix"
            class="close-icon"
            icon="mdi:window-close"
            @click.stop="handleCloseCurrent(item)"
          />
        </div>
      </div>
    </div>
    <svg-icon
      class="shadow-icon-right icon-center"
      icon="mdi:chevron-right"
      color="#00000073"
      :size="20"
      @click="handleScroll(-200)"
    />
    <!-- 右键菜单按钮 -->
    <transition name="el-zoom-in-top">
      <div v-show="visible" :style="getContextMenuStyle" class="contextmenu">
        <DownDropItem
          :tab-item="state"
          @handle-menu="handleMenuEvent"
          :menuList="getDropMenuList"
        />
      </div>
    </transition>
    <ul class="right-button">
      <li>
        <el-dropdown placement="bottom-end" trigger="click">
          <svg-icon icon="ion:chevron-down" color="#000" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in getDropMenuList"
                :key="key"
                :disabled="item.disabled"
                @click="handleMenuEvent(item)"
              >
                <svg-icon :icon="item.icon" color="#000" />
                <span>{{ item.text }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li>
        <svg-icon @click="handleReload" icon="ion:reload-sharp" color="#000" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: "LayoutTag"
};
</script>
<script lang="ts" setup>
import { computed, CSSProperties, ref, unref, watch, reactive, onMounted } from "vue";
import { RouteMeta, useRoute, useRouter, RouteLocationNormalized } from "vue-router";
import { useCacheTabStoreHook } from "/@/store/modules/cacheTab";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { REDIRECT_NAME } from "/@/router/constant";

import DownDropItem from "./DownDropItem.vue";
import { MenuEventEnum } from "./types";
import { useTabDropdown } from "./useTabDropdown";

//hooks
const route = useRoute();
const router = useRouter();
const tabStore = useCacheTabStoreHook();
const projectConfig = useSettingStoreHook();

// state start
const state = reactive({
  current: null,
  currentIndex: 0
});
const translateX = ref<number>(0);
const downDropTop = ref<number>(0);
const downDropLeft = ref<number>(0);
const visible = ref<boolean>(false); // 右键下拉显隐

const { getDropMenuList, handleMenuEvent } = useTabDropdown(state, true);

// dom Ref
const containerRef = ref<HTMLElement | null>(null);
const tabDomRef = ref<HTMLElement | null>(null);
const scrollDomRef = ref<HTMLElement | null>(null);

// computed
const tabsState = computed(() => {
  return tabStore.getTabList;
});
const tabSetting = computed(() => {
  return projectConfig.getCacheTabSetting;
});
const scrollTabStyle = computed(() => {
  return {
    transform: `translateX(${translateX.value}px)`
  };
});
const getContextMenuStyle = computed((): CSSProperties => {
  return { left: downDropLeft.value + "px", top: downDropTop.value + "px" };
});

// watch
watch(
  route,
  _route => {
    _route && watchRouteChange(_route);
  },
  {
    immediate: true
  }
);
watch(visible, value => {
  if (value) {
    document.body.addEventListener("click", handleCloseMenu);
  } else {
    document.body.removeEventListener("click", handleCloseMenu);
  }
});

onMounted(() => {
  handleContextMenu(route);
});

// Function
const isActive = _route => {
  route.query;
  return route.path === _route.path;
};
function watchRouteChange(_route) {
  const { name } = _route;
  // 重定向刷新页面不需要加入tab
  if (name === REDIRECT_NAME || !_route) {
    return;
  }
  const { meta = {} } = _route;
  const { hideTab, currentActiveMenu } = meta as RouteMeta;
  const isHide = !hideTab ? null : currentActiveMenu;
  if (isHide) {
    const findParentRoute = router.getRoutes().find(item => item.path === currentActiveMenu);

    findParentRoute && tabStore.addTab(findParentRoute as unknown as RouteLocationNormalized);
  } else {
    tabStore.addTab(unref(_route));
  }
}
function handleCloseMenu(e?: any) {
  if (e) {
    console.log("close", { e }, e.target.dataset.disabled);
  }

  visible.value = false;
}
function handleOpenMenu(tag, e) {
  handleCloseMenu();
  e?.preventDefault();
  const menuMinWidth = 105;
  const offsetLeft = unref(containerRef).getBoundingClientRect().left; // container margin left
  const offsetWidth = unref(containerRef).offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const left = e.clientX - offsetLeft + 5; // 15: margin right
  if (left > maxLeft) {
    downDropLeft.value = maxLeft;
  } else {
    downDropLeft.value = left;
  }
  // dropTop需要减去顶部栏的高度
  downDropTop.value = e.clientY - 50;
  visible.value = true;
  handleContextMenu(tag);
  console.log({ maxLeft, left }, downDropTop.value, downDropLeft.value);
}
function handleContextMenu(tabItem: RouteLocationNormalized) {
  const index = tabStore.getTabList.findIndex(tab => tab.path === tabItem.path);
  state.current = tabItem;
  state.currentIndex = index;
}
function handleScroll(offset: number) {
  const scrollWidth = scrollDomRef.value ? scrollDomRef.value?.offsetWidth : 0;
  const tabWidth = tabDomRef.value ? tabDomRef.value.offsetWidth : 0;
  if (offset > 0) {
    translateX.value = Math.min(0, translateX.value + offset);
  } else {
    if (scrollWidth < tabWidth) {
      if (translateX.value >= -(tabWidth - scrollWidth)) {
        translateX.value = Math.max(translateX.value + offset, scrollWidth - tabWidth);
      }
    } else {
      translateX.value = 0;
    }
  }
}
function handleCloseCurrent(tabItem: RouteLocationNormalized) {
  tabStore.closeTab(tabItem, router);
}
function handleRouteTo(tabItem: RouteLocationNormalized) {
  tabItem && router.push(tabItem.path);
}
function handleReload() {
  handleMenuEvent({
    event: MenuEventEnum.REFRESH_PAGE
  });
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
.shadow-icon {
  box-shadow: 5px 0 5px -6px #ccc;
}
</style>
