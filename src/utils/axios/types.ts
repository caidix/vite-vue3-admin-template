import { AxiosRequestConfig, AxiosResponse } from "axios";
export interface RequestConfig extends AxiosRequestConfig {
  // 是否调用元素定义上的loading？
  loading?: boolean;
  loadingTip?: string;
  curloading?: boolean;
  ignoreTimeout?: boolean;
  tipErr?: boolean;
  handleError?: boolean;
}

export interface ResponseData extends AxiosResponse {
  result?: any;
  code?: number;
  hasTaste?: boolean;
  [propName: string]: any;
}

export interface HandlerFunction {
  requestResolve?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  requestReject?: (error: unknown) => unknown;
  responseResolve?: (value: AxiosResponse) => ResponseData | Promise<AxiosResponse>;
  responseReject?: (error: unknown) => unknown;
}
