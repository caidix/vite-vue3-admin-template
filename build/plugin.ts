import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import ElementPlus from "unplugin-element-plus/vite";
import purgeIcons from "vite-plugin-purge-icons";
import Unocss from "unocss/vite";
import themePreprocessorPlugin from "@zougt/vite-plugin-theme-preprocessor";

import { pathResolve } from "./utils";

export function createVitePlugin(viteEnv: ViteEnv, isBuild: boolean) {
  const vitePlugin = [vue(), vueJsx(), Unocss()];

  vitePlugin.push(svgLoader());

  vitePlugin.push(ElementPlus({}));

  vitePlugin.push(purgeIcons());

  vitePlugin.push(useThemePlugin());

  return vitePlugin;
}

function useThemePlugin() {
  return themePreprocessorPlugin({
    scss: {
      multipleScopeVars: [
        {
          scopeName: "layout-theme-default",
          path: pathResolve("src/design/style/theme/default-vars.scss")
        },
        {
          scopeName: "layout-theme-dusk",
          path: pathResolve("src/design/style/theme/dusk-vars.scss")
        },
        {
          scopeName: "layout-theme-auroraGreen",
          path: pathResolve("src/design/style/theme/auroraGreen-vars.scss")
        },
        {
          scopeName: "layout-theme-light",
          path: pathResolve("src/design/style/theme/light-vars.scss")
        },
        {
          scopeName: "layout-theme-mingQing",
          path: pathResolve("src/design/style/theme/mingQing-vars.scss")
        }
      ],
      // 默认取 multipleScopeVars[0].scopeName
      defaultScopeName: "",
      // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
      extract: true,
      // 独立主题css文件的输出路径，默认取 viteConfig.build.assetsDir 相对于 (viteConfig.build.outDir)
      outputDir: "",
      // 会选取defaultScopeName对应的主题css文件在html添加link
      themeLinkTagId: "head",
      // "head"||"head-prepend" || "body" ||"body-prepend"
      themeLinkTagInjectTo: "head",
      // 是否对抽取的css文件内对应scopeName的权重类名移除
      removeCssScopeName: false,
      // 可以自定义css文件名称的函数
      customThemeCssFileName: scopeName => scopeName
    }
  });
}
