<template>
  <div class="navbar">
    <HamBurger
      class="hamburger-container"
      :is-active="!sidebarHide"
      @toggle-click="handleChangeSidebar"
    />
    <Breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <Notice />
      <Screenfull />
      <Setting v-if="showSetting" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import Breadcrumb from "./Breadcrumb/index.vue";
import HamBurger from "./SideBar/hamBurger.vue";
import Notice from "./Notice/index.vue";
import Screenfull from "./Screenfull/index.vue";
import Setting from "./Setting/index.vue";
import { useSettingStoreHook } from "/@/store/modules/settings";

const projectConfig = useSettingStoreHook();
const sidebarHide = computed(() => projectConfig.sidebar.hide);
const showSetting = computed(() => projectConfig.showSettings);
const handleChangeSidebar = () => {
  projectConfig.toggleSidebar(!sidebarHide.value);
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    min-width: 280px;
    height: 50px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        color: #000;
        font-size: 14px;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
