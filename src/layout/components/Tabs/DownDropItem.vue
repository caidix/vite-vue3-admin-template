<template>
  <template v-for="(item, key) in menuList" :key="key">
    <div
      v-show="!item.disabled"
      class="menu-item"
      v-bind="getAttr(item.event)"
      @click="handleMenuEvent(item)"
    >
      <svg-icon class="menu-item__icon" :icon="item.icon" />
      <span>{{ item.text }}</span>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { DropMenuProps } from "./useTabDropdown";

defineProps({
  menuList: {
    type: Array as PropType<DropMenuProps[]>,
    default: () => []
  }
});

const emit = defineEmits(["handle-menu"]);

const handleMenuEvent = item => {
  if (!item) {
    return;
  }
  emit("handle-menu", item);
};

const getAttr = (key: string | number) => ({ key });
</script>
<style scoped lang="scss">
.menu-item {
  width: 100%;
  margin: 0;
  padding: 7px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: #eee;
  }
  &__icon {
    display: block;
    margin-right: 0.5em;
  }
}
</style>
