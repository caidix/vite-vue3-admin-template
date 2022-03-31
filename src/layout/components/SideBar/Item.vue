<template>
  <!-- <i :class="icon" class="sub-el-icon"></i> -->
  <!-- <el-icon><arrow-up /></el-icon> -->
  <Icon class="sub-el-icon" icon="mdi-light:arrange-bring-to-front"></Icon>
  <slot name="title">
    <span>{{ title }}</span>
  </slot>
</template>
<script lang="ts" setup>
import Icon from "/@/modules/components/Icons/Icon.vue";
defineProps({
  icon: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  }
});
</script>
<script lang="ts">
export default {
  name: "Sidebar-Item"
};
</script>
<style scoped>
.sub-el-icon {
  width: 1em;
  height: 1em;
  display: inline-flex;
}
</style>
