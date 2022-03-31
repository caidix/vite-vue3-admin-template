<script lang="ts">
export default {
  name: "SideBar"
};
</script>
<script setup lang="ts">
import { computed, ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSettingStoreHook } from "/@/store/modules/settings";
import SidebarItem from "./SidebarItem.vue";
import Logo from "./Logo.vue";
const projectConfig = useSettingStoreHook();
const route = useRoute();
const router = useRouter().options.routes;
const showLogo = computed(() => {
  return projectConfig.sidebar.showLogo;
});
const isCollapse = computed(() => {
  return projectConfig.sidebar.hide;
});
const layoutMode = computed(() => {
  return projectConfig.layout;
});
const activeMenu = computed((): string => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    // @ts-ignorea
    return meta.activeMenu;
  }
  return path;
});
const handleSelect = (path, keyPath) => {
  console.log(path, keyPath);
};
</script>

<template>
  <div class="sidebar-container" :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" :title="projectConfig.title" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        :mode="layoutMode"
        class="outer-most"
        router
        @select="handleSelect"
      >
        <sidebar-item
          v-for="route in router"
          :key="route.path"
          :item="route"
          class="outer-most"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
