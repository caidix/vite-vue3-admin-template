import { unref } from "vue";
import { RouteLocationRaw, Router, useRouter } from "vue-router";
import { PageEnum } from "../dependencies/enums/pageEnum";
import { REDIRECT_NAME } from "../router/constant";
import { isString } from "../utils/validate";

export type RouteLocationRawEx = Omit<RouteLocationRaw, "path"> & { path: PageEnum };

function handleError(e: Error) {
  console.error(e);
}

// 页面跳转
export function useGo(_router?: Router) {
  const router = _router ? _router : useRouter();
  const { push, replace } = router;
  function go(opt: PageEnum | RouteLocationRawEx | string = PageEnum.BASE_HOME, isReplace = false) {
    if (!opt) {
      return;
    }
    if (isString(opt)) {
      isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
    } else {
      const o = opt as RouteLocationRaw;
      isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
    }
  }
  return go;
}

// 重渲染页面
export const useRedo = (_router?: Router) => {
  const { push, currentRoute } = _router || useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);
  function redo(): Promise<boolean> {
    return new Promise(resolve => {
      if (name === REDIRECT_NAME) {
        resolve(false);
        return;
      }
      if (name && Object.keys(params).length > 0) {
        params["_redirect_type"] = "name";
        params["path"] = String(name);
      } else {
        params["_redirect_type"] = "path";
        params["path"] = fullPath;
      }
      push({ name: REDIRECT_NAME, params, query }).then(() => resolve(true));
    });
  }
  return redo;
};
