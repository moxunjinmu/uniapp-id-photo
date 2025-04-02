// src/utils/request.ts
// import { env } from "@/env";
/**
 * 请求函数封装
 * 基于 uni.request 封装的请求函数
 */
interface RequestOptions extends UniApp.RequestOptions {
  baseUrl?: string;
  timeout?: number;
}

// 响应数据结构

// 基础配置
const BASE_URL = import.meta.env.VITE_APP_BASE_API || "";
const TIMEOUT = 30000;

/**
 * 请求函数
 * @param options 请求配置项
 */
export function request<T>(options: RequestOptions): Promise<T> {
  const token = uni.getStorageSync("token"); // 从本地缓存获取 token
  const proxyUrl = options.baseUrl ? `${options.baseUrl}${options.url}` : `${BASE_URL}${options.url}`;
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      // VITE_APP_BASE_API 是在 Vite 项目的 .env.development 文件中配置的环境变量，使用代理标识，实际转发到真实 API
      url: proxyUrl, // 示例: http://localhost:5173/dev-api/login
      header: {
        ...options.header,
        Authorization: token,
      },
      timeout: options.timeout || TIMEOUT,
      success: (response) => {
        try {
          console.log("请求成功: ", response);

          // 处理JSON响应
          const resData = response.data as ResponseData<T>;
          // 业务状态码 00000 表示成功
          if (response.statusCode === 200) {
            // 处理二进制数据
            if (options.responseType === "arraybuffer") {
              const resData = response.data as T;
              console.log("请求成功: 处理二进制数据", resData);
              resolve(resData);
              console.log("请求成功: 处理二进制数据结束");
              return;
            }
            resolve(resData.data);
          } else {
            uni.showToast({
              title: resData.msg || "业务处理失败",
              icon: "none",
              duration: 2000,
            });
            reject({
              message: resData.msg || "业务处理失败",
              code: resData.code,
            });
          }
        } catch (error: any) {
          console.log("请求成功: 处理报错", error);
        }
      },
      fail: (error) => {
        uni.showToast({
          title: "网络请求失败",
          icon: "none",
          duration: 2000,
        });
        reject({
          message: "网络请求失败",
          error,
        });
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
