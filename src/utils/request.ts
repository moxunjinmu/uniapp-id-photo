// src/utils/request.ts
import { env } from "@/env";
/**
 * 请求函数封装
 * 基于 uni.request 封装的请求函数
 */
interface RequestOptions extends UniApp.RequestOptions {
  baseUrl?: string;
  timeout?: number;
}

// 基础配置
// const BASE_URL = import.meta.env.VITE_APP_BASE_API || "";
const TIMEOUT = 30000;

/**
 * 请求函数
 * @param options 请求配置项
 */
export function request(options: RequestOptions) {
  const { url, method, data, header, responseType, timeout } = options;
  return new Promise((resolve, reject) => {
    // 打印代理后的实际请求地址
    const proxyUrl = env.isProd ? `${env.api.baseUrl}${url}` : `/api${url}`;
    console.log("代理请求地址:", proxyUrl);

    uni.request({
      url: proxyUrl,
      method: method || "GET",
      header: {
        "Content-Type": "application/json",
        ...header,
      },
      data: data,
      timeout: timeout || TIMEOUT,
      responseType: responseType,
      success: (res) => {
        console.log("请求成功:", res);
        console.log("options.responseType", responseType);
        // 根据responseType处理响应数据
        if (responseType === "arraybuffer") {
          console.log("ArrayBuffer:", res.data);
          resolve({
            ...res,
            data: res.data as ArrayBuffer,
          });
        } else {
          resolve(res);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
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
