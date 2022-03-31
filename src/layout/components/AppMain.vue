<script lang="ts">
export default defineComponent({
  name: "AppMain"
});
</script>
<script lang="ts" setup>
import { computed, defineComponent } from "vue";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { useCacheTabStoreHook } from "/@/store/modules/cacheTab";
import { getTransitionName } from "./transition";

const settingStore = useSettingStoreHook();
const cacheTabStore = useCacheTabStoreHook();

const enableTransition = computed(() => settingStore.getTransitionSetting.enable);
const openCache = computed(() => settingStore.keepAlive && settingStore.getCacheTabSetting.show);
const getCaches = computed((): string[] => {
  if (!settingStore.keepAlive) {
    return [];
  }
  return cacheTabStore.getCacheTabList;
});
</script>

<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition
        mode="out-in"
        appear
        :name="
          getTransitionName({
            route,
            openCache,
            enableTransition: enableTransition,
            cacheTabs: getCaches
          })
        "
      >
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </router-view>
</template>
