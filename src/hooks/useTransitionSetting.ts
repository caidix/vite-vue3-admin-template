import { useSettingStoreHook } from "/@/store/modules/settings";

import { computed } from "vue";

export function useTransitionSetting() {
  const projectConfig = useSettingStoreHook();

  const getEnableTransition = computed(() => projectConfig.transitionSetting.enable);
  const getOpenNProgress = computed(() => projectConfig.transitionSetting.openNProgress);
  const getOpenPageLoading = computed(() => projectConfig.transitionSetting.openPageLoading);

  return {
    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading
  };
}
