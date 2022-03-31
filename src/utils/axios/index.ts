import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import cancelHandler from "./cancel";
import codeHandler from "./code";
import { HandlerFunction } from "./types";

const request = axios.create({
  baseURL: "/api"
});
// codeHandler从响应结构中取出data，需要放在最后进行
[cancelHandler, codeHandler].forEach((handler: any) => {
  const handlerContext: HandlerFunction = handler();
  function normalRequestResolve(config: AxiosRequestConfig) {
    return config;
  }

  function normalResponseResolve(response: AxiosResponse) {
    return response;
  }

  function normalReject(error: AxiosError) {
    return Promise.reject(error);
  }
  const {
    requestResolve = normalRequestResolve,
    requestReject = normalReject,
    responseResolve = normalResponseResolve,
    responseReject = normalReject
  } = handlerContext;
  request.interceptors.request.use(requestResolve, requestReject);
  request.interceptors.response.use(responseResolve, responseReject);
});

export default request;
