import { useSettingStoreHook } from "/@/store/modules/settings";
import { computed } from "vue";

export function useRootSetting() {
  const projectConfig = useSettingStoreHook();

  const getShowLogo = computed(() => projectConfig.sidebar.showLogo);
  const getHideTabs = computed(() => projectConfig.hideTabs);
  const getOpenGrey = computed(() => projectConfig.grey);
  const getLayout = computed(() => projectConfig.layout);
  const getOpenWeak = computed(() => projectConfig.weak);
  const getThemeColor = computed(() => projectConfig.themeColor);
  const getTheme = computed(() => {
    return projectConfig.theme === "dark";
  });
  // const getTagsCache = computed(() => projectConfig.multiTagsCache);
  // const getHideSidebar = computed(() => projectConfig.hiddenSideBar);

  const handleChangeSidebar = (sidebar = {}) => {
    projectConfig.setProjectConfig("sidebar", {
      ...projectConfig.sidebar,
      ...sidebar
    });
  };
  return {
    getShowLogo,
    getHideTabs,
    getOpenGrey,
    getLayout,
    getOpenWeak,
    getTheme,
    getThemeColor,
    handleChangeSidebar
  };
}
