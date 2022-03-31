// default setting
export default {
  title: "CD_ADMIN",
  hiddenSideBar: false,
  keepAlive: true, // vue-router是否开启keepAlive
  layout: "vertical", // 模式切换
  theme: "light", // 样式
  themeColor: "auroraGreen", // 颜色样式
  grey: false, // 是否为灰色模式

  weak: false, // 是否开启色盲模式

  multiTagsCache: false, // 快速跳转tags是否开启缓存
  hideTabs: false, // 是否隐藏tags

  fixedHeader: true,
  sidebar: {
    hide: false, // 是否收缩侧边栏目
    withoutAnimation: false,
    showLogo: true // 是否展示logo
  },
  showSettings: true, // 是否展示配置

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  cacheTabSetting: {
    // 缓存tab栏目配置
    cache: true,
    // Turn on
    show: true,
    showRedo: true,
    showModel: "schedule"
  },
  transitionSetting: {
    // 动画设置
    enable: true, // 是否使用切换动画
    openNProgress: true, // 是否使用NProgress
    openPageLoading: false // 是否使用页面加载
  }
};
