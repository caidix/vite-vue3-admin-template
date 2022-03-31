<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <div class="screen-full" @click="toggle">
    <svg-icon
      :title="isFullscreen ? '关闭全屏' : '打开全屏'"
      :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
    ></svg-icon>
  </div>
</template>

<style lang="scss" scoped>
.screen-full {
  width: 36px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  &:hover {
    background: #f6f6f6;
  }
  .anticon {
    font-size: 20px;
  }
}
</style>
