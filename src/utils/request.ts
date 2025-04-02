// src/utils/request.ts

/**
 * 请求函数封装
 * 基于 uni.request 封装的请求函数
 */

// 封装请求方法
interface RequestOptions extends UniApp.RequestOptions {
  baseUrl?: string;
  timeout?: number;
}

// 基础配置
const BASE_URL = import.meta.env.VITE_APP_BASE_API || "";
const TIMEOUT = 30000;

/**
 * 请求函数
 * @param options 请求配置项
 */
export function request(options: RequestOptions) {
  const { url, method, data, header, responseType, success, fail } = options;

  // 合并请求头
  const headers = {
    "Content-Type": "application/json",
    ...header,
  };

  // 请求地址
  const requestUrl = /^(http|https):\/\//.test(url as string) ? url : `${BASE_URL}${url}`;

  // 发起请求
  return uni.request({
    url: requestUrl as string,
    method: method || "GET",
    data,
    header: headers,
    timeout: options.timeout || TIMEOUT,
    responseType,
    success,
    fail,
  });
}

/**
 * GET 请求
 * @param url 请求地址
 * @param data 请求参数
 * @param options 其他选项
 */
export function get(url: string, data?: any, options?: RequestOptions) {
  return request({
    url,
    method: "GET",
    data,
    ...options,
  });
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求参数
 * @param options 其他选项
 */
export function post(url: string, data?: any, options?: RequestOptions) {
  return request({
    url,
    method: "POST",
    data,
    ...options,
  });
}

export default {
  request,
  get,
  post,
};
