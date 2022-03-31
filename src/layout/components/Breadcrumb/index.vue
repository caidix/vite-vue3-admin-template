<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { RouteLocationMatched, useRoute } from "vue-router";
import { useRouter } from "vue-router";
import * as pathToRegexp from "path-to-regexp";

const route = useRoute();
const router = useRouter();
const levelList = ref([]);
getBreadcrumb();
watch(route, () => {
  getBreadcrumb();
});

// Function
function getBreadcrumb() {
  let matched = route.matched.filter(item => item.meta?.title);
  const first = matched[0];
  if (!isDashboard(first)) {
    matched = [
      {
        path: "/dashboard",
        parentPath: "/",
        meta: { title: "首页" }
      } as unknown as RouteLocationMatched
    ].concat(matched);
  }
  levelList.value = matched.filter(
    item => item?.meta && item?.meta.title && item.meta.breadcrumb !== false
  );
}

function isDashboard(route: RouteLocationMatched): boolean | string {
  const name = route && (route.name as string);
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "dashboard".toLocaleLowerCase();
}

function pathCompile(path: string) {
  const { params } = route;
  const toPath = pathToRegexp.compile(path);
  return toPath(params);
}
function handleLink(item) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect);
    return;
  }
  router.push(pathCompile(path));
}
</script>
<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
