<template>
  <ul class="theme-color">
    <li
      v-for="(item, index) in themeColors"
      @click="setThemeColor(item)"
      :key="index"
      :style="getThemeColorStyle(item.rgb)"
    >
      <svg-icon icon="ant-design:check-outlined" :color="getThemeColor(item.themeColor)"></svg-icon>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineEmits, ref, computed } from "vue";
import { themeColorsType } from "../../types";
import rgbHex from "rgb-hex";
import { writeNewStyle, createNewStyle } from "./element-plus";
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils";

const themeColors = ref<Array<themeColorsType>>([
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

const props = defineProps({
  themeColor: {
    type: String,
    required: true
  }
});
const emit = defineEmits(["change"]);

const getThemeColorStyle = computed(() => {
  return rgb => {
    return { background: `rgb(${rgb})` };
  };
});

const getThemeColor = computed(() => {
  return theme => {
    if (theme === props.themeColor && props.themeColor !== "light") {
      return "#fff";
    } else if (theme === props.themeColor && props.themeColor === "light") {
      return "#000";
    } else {
      return "transparent";
    }
  };
});

const handleChangeThemeColor = theme => {
  emit("change", theme, "themeColor");
};

const setThemeColor = themeItem => {
  const { themeColor, rgb } = themeItem;
  toggleTheme({
    scopeName: `layout-theme-${themeColor}`
  });
  console.log(1111, performance.now());
  if (themeColor === "default" || themeColor === "light") {
    setEpThemeColor("#409EFF");
  } else {
    const color = "#" + rgbHex(rgb);
    console.log(22222, performance.now());
    setEpThemeColor(color);
  }
  console.log(333, performance.now());
  handleChangeThemeColor(themeColor);
};

// 设置ep主题色
const setEpThemeColor = (color: string) => {
  writeNewStyle(createNewStyle(color));
  // body.style.setProperty("--el-color-primary-active", shadeBgColor(color));
};
</script>
<style lang="scss" scoped>
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
