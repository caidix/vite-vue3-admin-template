import { ConfigEnv, loadEnv, UserConfigExport } from "vite";
import { warpperEnv, pathResolve } from "./build/utils";
import { createProxy } from "./build/proxy";
import { createVitePlugin } from "./build/plugin";
// https://vitejs.dev/config/

const root: string = process.cwd();
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  /**
   * 检查process.cwd()路径下.env.development.local、.env.development、.env.local、.env这四个环境文件。
   * 输出NODE_ENV和VITE_开头的键值对
   * ts:  loadEnv(mode, root, prefix = 'VITE_')
   * loadEnv读取的布尔类型是一个字符串,warpperEnv可以转换为布尔类型
   */
  const viteEnv = warpperEnv(loadEnv(mode, root));
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY } = viteEnv;
  const isBuild = command === "build";
  return {
    // 公共路径
    base: process.env.NODE_ENV === "production" ? "/manages/" : VITE_PUBLIC_PATH,
    // 找index.html路径的配置
    root,
    resolve: {
      alias: {
        "/@": pathResolve("src"),
        "@build": pathResolve("build")
      }
    },
    server: {
      https: false,
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY)
    },
    plugins: createVitePlugin(viteEnv, isBuild),
    optimizeDeps: {
      // include: ["element-plus/lib/locale/lang/zh-cn", "element-plus/lib/locale/lang/en"],
      exclude: ["@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"]
    }
  };
};
