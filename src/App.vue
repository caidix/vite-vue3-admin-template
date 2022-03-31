<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { ElConfigProvider } from "element-plus";
import { getCurrentInstance } from "vue";
export default {
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  mounted() {
    const instance = getCurrentInstance();
    console.log(this, instance);
  }
};
</script>
