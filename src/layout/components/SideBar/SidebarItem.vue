<script setup lang="ts">
import { ref, PropType, nextTick, computed, CSSProperties, getCurrentInstance } from "vue";
import path from "path";
import { useSettingStoreHook } from "/@/store/modules/settings";
import Item from "./Item.vue";
import { RouteRecordRaw } from "vue-router";

const projectConfig = useSettingStoreHook();

const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    alignItems: "center"
  };
});

const getDivStyle = computed((): CSSProperties => {
  return {
    width: projectConfig.sidebar.hide ? "" : "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden"
  };
});

const getMenuTextStyle = computed((): CSSProperties => {
  return {
    width: projectConfig.sidebar.hide ? "125px" : "",
    overflow: "hidden",
    textOverflow: "ellipsis",
    outline: "none"
  };
});

const getSubTextStyle = computed((): CSSProperties => {
  return {
    width: projectConfig.sidebar.hide ? "125px" : "",
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
});

const getSpanStyle = computed((): CSSProperties => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
});

const onlyOneChild = ref(null);
// 存放菜单是否存在showTooltip属性标识
const hoverMenuMap = new WeakMap();
// 存储菜单文本dom元素
const menuTextRef = ref(null);

function hoverMenu(key) {
  // 如果当前菜单showTooltip属性已存在，退出计算
  if (hoverMenuMap.get(key)) return;

  nextTick(() => {
    // 如果文本内容的整体宽度大于其可视宽度，则文本溢出
    menuTextRef.value?.scrollWidth > menuTextRef.value?.clientWidth
      ? Object.assign(key, {
          showTooltip: true
        })
      : Object.assign(key, {
          showTooltip: false
        });

    hoverMenuMap.set(key, true);
  });
}

function hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath)) {
    return props.basePath + "/" + routePath;
  } else {
    return path.resolve(props.basePath, routePath);
  }
}
</script>

<template>
  <template
    v-if="
      hasOneShowingChild(props.item.children, props.item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
  >
    <el-menu-item
      :index="resolvePath(onlyOneChild.path)"
      :class="{ 'submenu-title-noDropdown': !isNest }"
      :style="getNoDropdownStyle"
    >
      <Item
        :icon="onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)"
        :title="onlyOneChild.meta.title"
      />
    </el-menu-item>
  </template>

  <el-sub-menu v-else ref="subMenu" :index="resolvePath(props.item.path)" popper-append-to-body>
    <template #title>
      <Item
        v-if="props.item.meta"
        :icon="props.item.meta && props.item.meta.icon"
        :title="props.item.meta.title"
      />
      <el-tooltip v-else placement="top" :offset="-10" :disabled="!props.item.meta.showTooltip">
        <template #content>
          {{ props.item.meta.title }}
        </template>
        <div ref="menuTextRef" :style="getSubTextStyle" @mouseover="hoverMenu(props.item)">
          <span :style="getSpanStyle">
            {{ props.item.meta.title }}
          </span>
        </div>
      </el-tooltip>
    </template>
    <sidebar-item
      v-for="child in props.item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>
