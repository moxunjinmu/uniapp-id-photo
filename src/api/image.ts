/*
 * @Author: moxunjinmu
 * @Date: 2025-04-02 15:44:17
 * @Description: imageApi
 */
import { request } from "@/utils/request";

// API密钥
const API_KEY = "SoCbsU5JUMhDSr14nbAEc6t5";

/**
 * 移除图片背景
 * @param imageUrl 本地图片路径
 * @param options 配置选项
 * @returns Promise<string> 处理后的图片路径
 */
export function removeBackground(
  imageUrl: string,
  options: {
    size?: string; // 'auto' | '4k' | 'regular' | 'small' | 'hd'
    bg_color?: string; // 例如 'blue' 或 '#0000ff'
  },
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 读取本地文件
    const fs = uni.getFileSystemManager();
    fs.readFile({
      filePath: imageUrl,
      success: (res) => {
        // 将文件转为base64
        const base64 = uni.arrayBufferToBase64(res.data as ArrayBuffer);

        // 调用API
        request({
          url: "/v1.0/removebg",
          method: "POST",
          header: {
            "X-API-Key": API_KEY,
          },
          data: {
            image_file_b64: base64,
            size: options.size || "auto",
            bg_color: options.bg_color,
          },
          responseType: "arraybuffer",
          success: (response: UniApp.RequestSuccessCallbackResult) => {
            console.log("API响应数据:", response.data);

            // 保存处理后的图片
            const tempFilePath = `${uni.getStorageSync("tempFilePath")}/bg_removed_${Date.now()}.png`;
            fs.writeFile({
              filePath: tempFilePath,
              data: response.data as ArrayBuffer,
              encoding: "binary",
              success: () => {
                resolve(tempFilePath);
              },
              fail: (err: UniApp.GeneralCallbackResult) => {
                reject(new Error(`保存文件失败: ${err.errMsg}`));
              },
            });
          },
          fail: (err: UniApp.GeneralCallbackResult) => {
            reject(new Error(`移除背景失败: ${err.errMsg}`));
          },
        });
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        reject(new Error(`读取文件失败: ${err.errMsg}`));
      },
    });
  });
}

/**
 * 更换图片背景色
 * @param imageUrl 已移除背景的图片路径
 * @param bgColor 背景色 (如 '#FF0000' 或 'blue')
 */
export function changeBackgroundColor(imageUrl: string, bgColor: string): Promise<string> {
  return removeBackground(imageUrl, {
    bg_color: bgColor,
  });
}

// 模拟测试接口 (用于开发测试)
export function mockRemoveBackground(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(imageUrl); // 开发测试时直接返回原图
    }, 1500);
  });
}
