<template>
  <i ref="elRef" :class="[$attrs.class, 'anticon']" :style="styled"></i>
</template>
<script lang="ts" setup>
interface Props {
  icon: string; //icon的名字
  size?: number; //字体大小
  color?: string; //字体颜色
}
import { renderSVG } from "@iconify/iconify";
import { onMounted, ref, unref, nextTick, computed } from "vue";
const props = withDefaults(defineProps<Props>(), {
  size: 16,
  color: ""
});

const elRef = ref<Element>();
const styled = computed(() => ({
  color: props.color
}));

const update = async () => {
  const el = unref(elRef);
  if (!el) return;
  await nextTick();
  const svg = renderSVG(props.icon);
  if (!svg) {
    const i = document.createElement("span");
    i.className = "iconify";
    i.dataset.icon = props.icon;
    el.textContent = "";
    el.appendChild(i);
  } else {
    el.textContent = "";
    el.appendChild(svg);
  }
};

onMounted(() => {
  update();
});
</script>
<style lang="scss" scoped>
.iconify {
  font-size: 16px;
  color: #fff;
}
.anticon {
  line-height: 0;
  text-align: center;
}
</style>
