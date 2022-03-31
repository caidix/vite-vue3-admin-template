import axios, { AxiosResponse } from "axios";
import type { AxiosRequestConfig, Canceler } from "axios";
import { RequestConfig } from "./types";
/**
 * 目的：希望后面的请求发出去的时候，如果前面的请求还没有响应，我们可以把前面的请求取消。
 * interface Canceler {
 *   (message?: string): void;
 *}
 */
let queue = new Map<string, Canceler>();
class CancelQueue {
  handleUrl(config: AxiosRequestConfig) {
    return [config.method, config.url].join("&");
  }
  push(config: AxiosRequestConfig) {
    this.pop(config);
    const url = this.handleUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken(cancel => {
        if (!queue.has(url)) {
          // 如果 pending 中不存在当前请求，则添加进去
          queue.set(url!, cancel!);
        }
      });
  }
  pop(config: AxiosRequestConfig) {
    const url = this.handleUrl(config);
    if (queue.has(url)) {
      // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
      const cancel = queue.get(url);
      cancel &&
        cancel(
          "cancel this request because have same new request has been initiated ! but the request is not yet corresponding"
        );
      queue.delete(url);
    }
  }
  popAll() {
    queue.forEach(cancel => {
      cancel && typeof cancel === "function" && cancel();
    });
    queue.clear();
  }
  reset(): void {
    queue = new Map<string, Canceler>();
  }
}
const cancelQueue = new CancelQueue();
const cancelHandler = () => {
  return {
    requestResolve(config: AxiosRequestConfig) {
      const { ignoreTimeout = true } = config as RequestConfig;
      if (ignoreTimeout) {
        cancelQueue.push(config);
      }
      return config;
    },
    responseResolve(response: AxiosResponse) {
      response && cancelQueue.pop(response.config);
      return response;
    }
  };
};

export default cancelHandler;
