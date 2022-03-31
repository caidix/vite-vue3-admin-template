<template>
  <div :class="['app-wrapper', classes]">
    <!-- <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    /> -->
    <Sidebar />
    <div class="main-container">
      <Navbar />
      <Tabs v-if="!getHideTabs" />
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Sidebar from "./components/SideBar/index.vue";
import AppMain from "./components/AppMain.vue";
import Tabs from "./components/Tabs/index.vue";
import Navbar from "./components/Navbar.vue";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { useRootSetting } from "/@/hooks/useRootSetting";
const projectConfig = useSettingStoreHook();
const { getHideTabs } = useRootSetting();

const classes = computed(() => {
  return {
    hideSidebar: projectConfig.sidebar.hide,
    openSidebar: !projectConfig.sidebar.hide
    // mobile: projectConfig.device === "mobile"
  };
});
</script>

<style scoped lang="scss">
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
