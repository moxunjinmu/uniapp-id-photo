/*
 * @Author: moxunjinmu
 * @Date: 2025-04-02 15:44:17
 * @Description: imageApi
 */
import { request } from "@/utils/request";
import { RemoveBackgroundOptions, API_KEY } from "@/enums";

/**
 * 移除图片背景
 * @param options 配置选项
 * @returns Promise<string> 处理后的图片路径
 */
export function removeBackground(options: RemoveBackgroundOptions = {}): Promise<ArrayBuffer> {
  // 调用API
  return request({
    url: "/removebg",
    baseUrl: "https://api.remove.bg/v1.0",
    method: "POST",
    header: {
      "X-API-Key": API_KEY,
    },
    data: options,
    responseType: "arraybuffer",
  });
}

/**
 * 更换图片背景色
 * @param imageUrl 已移除背景的图片路径
 * @param bgColor 背景色 (如 '#FF0000' 或 'blue')
 * @param options 其他选项
 */
export function changeBackgroundColor(
  imageUrl: string,
  bgColor: string,
  options: Omit<RemoveBackgroundOptions, "bg_color"> = {},
): Promise<ArrayBuffer> {
  return removeBackground({
    ...options,
    bg_color: bgColor,
  });
}

/**
 * 创建证件照排版
 * @param imageUrl 已处理的证件照路径
 * @param count 排版数量 (4/6/8/12)
 * @param bgColor 背景色
 */
export function createPhotoLayout(
  imageUrl: string,
  count: 4 | 6 | 8 | 12 = 4,
  bgColor: string = "#FFFFFF",
): Promise<string> {
  console.log("创建照片排版", { imageUrl, count, bgColor });
  // 这里应该实现排版逻辑，可能需要调用canvas绘制
  // 作为示例，我们使用模拟实现
  return mockRemoveBackground(imageUrl);
}

/**
 * 添加水印
 * @param imageUrl 图片路径
 * @param text 水印文本
 */
export function addWatermark(imageUrl: string, text: string): Promise<string> {
  console.log("添加水印", { imageUrl, text });
  // 这里应该实现水印逻辑，通常使用canvas
  // 作为示例，我们使用模拟实现
  return mockRemoveBackground(imageUrl);
}

// 模拟测试接口 (用于开发测试)
export function mockRemoveBackground(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    console.log("使用模拟API，返回原图:", imageUrl);
    setTimeout(() => {
      resolve(imageUrl); // 开发测试时直接返回原图
    }, 1500);
  });
}

// 检查每日下载限制
const DAILY_DOWNLOAD_LIMIT = 10;

export function checkDailyDownloadLimit(): { canDownload: boolean; remainingCount: number } {
  const today = new Date().toISOString().split("T")[0]; // 获取当天日期 YYYY-MM-DD
  const downloadCountKey = `photo_download_count_${today}`;

  // 获取当日下载次数
  const countStr = uni.getStorageSync(downloadCountKey) || "0";
  const count = parseInt(countStr, 10);

  return {
    canDownload: count < DAILY_DOWNLOAD_LIMIT,
    remainingCount: DAILY_DOWNLOAD_LIMIT - count,
  };
}

export function incrementDownloadCount(): number {
  const today = new Date().toISOString().split("T")[0];
  const downloadCountKey = `photo_download_count_${today}`;

  // 获取并递增下载次数
  const countStr = uni.getStorageSync(downloadCountKey) || "0";
  const count = parseInt(countStr, 10) + 1;

  // 存储更新后的次数
  uni.setStorageSync(downloadCountKey, count.toString());

  return count;
}
