<template>
  <div class="setting-outline" @click="handleDrawer">
    <svg-icon icon="mdi:cog-outline"></svg-icon>
  </div>
  <el-drawer v-model="drawer" :z-index="1000" custom-class="setting-container" size="330px">
    <template #title>
      <div class="setting-title">基础设置</div>
    </template>
    <div class="setting-content">
      <el-divider><span class="setting-content__title">主题</span></el-divider>
      <div class="flex justify-center">
        <el-switch
          :value="getTheme"
          inline-prompt
          :active-icon="SidebarSunny"
          :inactive-icon="SidebarNight"
          @change="handleChangeTheme"
        >
        </el-switch>
      </div>
      <el-divider><span class="setting-content__title">主题色</span></el-divider>
      <ul class="theme-color">
        <li
          v-for="(item, index) in themeColors"
          @click="setThemeColor(item)"
          :key="index"
          :style="getThemeColorStyle(item.rgb)"
        >
          <svg-icon
            icon="ant-design:check-outlined"
            :color="themeColorSetting(item.themeColor)"
          ></svg-icon>
        </li>
      </ul>
      <el-divider><span class="setting-content__title">界面显示</span></el-divider>
      <ul class="setting">
        <li>
          <span>侧边栏LOGO</span>
          <el-switch
            :value="getShowLogo"
            inline-prompt
            inactive-color="#a6a6a6"
            active-text="开"
            inactive-text="关"
            @change="sidebarChange($event, 'showLogo')"
          >
          </el-switch>
        </li>
        <li>
          <span>隐藏标签页</span>
          <el-switch
            :value="getHideTabs"
            inline-prompt
            inactive-color="#a6a6a6"
            active-text="开"
            inactive-text="关"
            @change="handleChange($event, 'hideTabs')"
          >
          </el-switch>
        </li>
        <li>
          <span>灰色模式</span>
          <el-switch
            :value="getOpenGrey"
            inline-prompt
            inactive-color="#a6a6a6"
            active-text="开"
            inactive-text="关"
            @change="handleChangeByCls($event, 'grey', 'html-grey')"
          >
          </el-switch>
        </li>
        <li>
          <span>色弱模式</span>
          <el-switch
            :value="getOpenWeak"
            inline-prompt
            inactive-color="#a6a6a6"
            active-text="开"
            inactive-text="关"
            @change="handleChangeByCls($event, 'weak', 'html-weakness')"
          >
          </el-switch>
        </li>
      </ul>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, unref, computed, nextTick } from "vue";
import rgbHex from "rgb-hex";
import { useSettingStoreHook } from "/@/store/modules/settings.ts";
import { useRootSetting } from "/@/hooks/useRootSetting";
import { toggleClass } from "/@/utils/toggleClass";
import { SidebarSunny, SidebarNight } from "./SettingIcons";
// import ThemeColorPicker from "./ThemeColorPicker.vue";
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils";
import { themeColorsType } from "../../types";
import { writeNewStyle, createNewStyle } from "./element-plus";

const projectConfig = useSettingStoreHook();
const {
  getShowLogo,
  getHideTabs,
  getOpenGrey,
  getOpenWeak,
  getTheme,
  getThemeColor,
  handleChangeSidebar
} = useRootSetting();

const body = document.documentElement as HTMLElement;

let themeColors = ref<Array<themeColorsType>>([
  // 道奇蓝（默认）
  { rgb: "27, 42, 71", themeColor: "default" },
  // 亮白色
  { rgb: "255, 255, 255", themeColor: "light" },
  // 猩红色
  { rgb: "245, 34, 45", themeColor: "dusk" },
  // 绿宝石
  { rgb: "19, 194, 194", themeColor: "mingQing" },
  // 酸橙绿
  { rgb: "82, 196, 26", themeColor: "auroraGreen" }
]);

const drawer = ref(false);

const handleDrawer = () => {
  drawer.value = !drawer.value;
};
const sidebarChange = (value, key) => {
  handleChangeSidebar({
    [key]: value
  });
};
const handleChange = (value, key) => {
  console.log({ value, key });
  projectConfig.setProjectConfig(key, value);
};
const handleChangeByCls = (value, key, cls) => {
  toggleClass(value, cls, document.querySelector("html"));
  handleChange(value, key);
};
const handleChangeTheme = value => {
  const theme = value ? "dark" : "light";
  handleChange(theme, "theme");
  body.setAttribute("data-theme", theme);
};
const getThemeColorStyle = computed(() => {
  return rgb => {
    return { background: `rgb(${rgb})` };
  };
});

const themeColorSetting = computed(() => {
  return theme => {
    const themeColor = unref(getThemeColor);
    if (theme === themeColor && themeColor !== "light") {
      return "#fff";
    } else if (theme === themeColor && themeColor === "light") {
      return "#000";
    } else {
      return "transparent";
    }
  };
});

const setThemeColor = themeItem => {
  const { themeColor, rgb } = themeItem;
  toggleTheme({
    scopeName: `layout-theme-${themeColor}`
  });
  if (themeColor === "default" || themeColor === "light") {
    setEpThemeColor("#409EFF");
  } else {
    const color = "#" + rgbHex(rgb);
    setEpThemeColor(color);
  }
  console.log(333, performance.now());
  handleChange(themeColor, "themeColor");
};

// 设置ep主题色
const setEpThemeColor = (color: string) => {
  writeNewStyle(createNewStyle(color));
  // body.style.setProperty("--el-color-primary-active", shadeBgColor(color));
};

// 初始化
nextTick(() => {
  handleChangeTheme(getTheme.value);
  handleChangeByCls(getOpenGrey.value, "grey", "html-grey");
  handleChangeByCls(getOpenWeak.value, "weak", "html-weakness");
  const color = themeColors.value.find(i => i.themeColor === getThemeColor.value);

  color && setThemeColor(color);
});
</script>

<style lang="scss" scoped>
.setting-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 40px;
  cursor: pointer;
  &:hover {
    background: #f6f6f6;
  }
}
.setting-title {
  color: #000;
}
.setting-content {
  border-top: 1px solid #dcdfe6;
  margin: -20px;
  margin-top: -32px;
  padding-left: 20px;
  padding-right: 20px;
  &__title {
    font-size: 16px;
    font-weight: 700;
  }
}

.setting {
  width: 100%;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px;
  }
}

.theme-color {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  display: flex;
  justify-content: center;

  li {
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    font-weight: 700;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:nth-child(2) {
      border: 1px solid #ddd;
    }
  }
  .anticon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
