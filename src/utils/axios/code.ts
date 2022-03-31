/**
 * default handle errorCode page
 */
import { AxiosResponse, AxiosError } from "axios";
import { RequestConfig, ResponseData } from "./types";
import { ElMessage } from "element-plus";
function createErrorModal(options) {
  return ElMessage.error(options);
}
const codeHandler = () => {
  return {
    responseResolve(response: AxiosResponse) {
      const data: ResponseData = response.data || {};
      if (response.status === 200 && data.code === 200) {
        return data;
      } else {
        return createErrorModal({
          title: "错误",
          content: data.message || "服务器响应出错"
        });
      }
    },
    responseReject(error: AxiosError) {
      // 如果配置设置自己处理异常, 就直接 reject
      const config = error.config as RequestConfig;

      // console.log(error.response);
      if (config && config.handleError) {
        return Promise.reject(error);
      }
      let promise = Promise.resolve();
      if (!error.response) {
        // 极端情况下
        createErrorModal({
          title: "错误",
          content: error.message || "请求发生错误, 请稍后再试"
        });
      }
      const { status = 0 } = error.response as AxiosResponse;

      switch (status) {
        case 400:
          createErrorModal({
            title: "错误",
            content: error.message || "请求发生错误, 请稍后再试"
          });
          break;
        case 401:
          createErrorModal({
            title: "错误",
            content: "用户没有权限"
          });
          break;
        case 403:
          createErrorModal({
            title: "错误",
            content: "用户得到授权，但是访问是被禁止的!"
          });
          break;
        // 404请求不存在
        case 404:
          createErrorModal({
            title: "错误",
            content: "网络请求错误,未找到该资源!"
          });
          break;
        case 405:
          createErrorModal({
            title: "错误",
            content: "网络请求错误,请求方法有误!"
          });
          break;
        case 408:
          createErrorModal({
            title: "错误",
            content: "网络请求超时!"
          });
          break;
        case 422:
          createErrorModal({
            title: "错误",
            content: "参数错误！"
          });
          break;
        case 500:
          createErrorModal({
            title: "错误",
            content: "服务器错误!"
          });
          break;
        case 501:
          createErrorModal({
            title: "错误",
            content: "网络未实现!"
          });
          break;
        case 502:
          createErrorModal({
            title: "错误",
            content: "网络错误!"
          });
          break;
        case 503:
          createErrorModal({
            title: "错误",
            content: "服务不可用，服务器暂时过载或维护!"
          });
          break;
        case 504:
          createErrorModal({
            title: "错误",
            content: "网络超时!"
          });
          break;
        case 505:
          createErrorModal({
            title: "错误",
            content: "http版本不支持该请求!"
          });
          break;
        default:
          promise = Promise.resolve();
      }
      return promise.then(() => {
        const response = error.response;
        return {
          data: {
            code: response ? response.status : -1
          }
        };
      });
    }
  };
};

export default codeHandler;
