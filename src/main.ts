import { createApp } from "vue";
import App from "./App.vue";
import { setupStore } from "/@/store/index";
import { MotionPlugin } from "@vueuse/motion";
import { router, setupRouter } from "/@/router";
import { setupElementPlus } from "/@/design/element-plus";
import { setupReactiveStorage } from "/@/utils/storage/storage";
import { setupRouterGuard } from "/@/router/guard";
import SvgIcon from "/@/modules/components/Icons/Icon.vue";
// 导入公共样式
import "./design/style/index.scss";
async function bootstrap() {
  const app = createApp(App);
  setupStore(app);

  setupRouter(app);

  setupRouterGuard(router);

  setupElementPlus(app);
  // setupReactiveStorage(app, {
  //   tabs: true
  // });

  app.use(MotionPlugin);
  app.component("svg-icon", SvgIcon);
  app.mount("#app");
}

bootstrap();
