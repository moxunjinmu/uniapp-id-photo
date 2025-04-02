/*
 * @Author: moxunjinmu
 * @Date: 2025-04-02 15:44:17
 * @Description: imageApi
 */
import { request } from "@/utils/request";
import { readFile, saveFile } from "@/utils/file";
import { useToast } from "@/hooks/useToast";

// API密钥
const API_KEY = "SoCbsU5JUMhDSr14nbAEc6t5";

// 证件照处理选项
export interface RemoveBackgroundOptions {
  size?: string; // 'auto' | '4k' | 'regular' | 'small' | 'hd' | '50MP'
  bg_color?: string; // 例如 'blue' 或 '#0000ff'
  type?: string; // 'auto' | 'person' | 'product' | 'car' | 'animal' | 'graphic' | 'transportation'
  type_level?: string; // 'none' | 'latest' | '1' | '2'
  format?: string; // 'auto' | 'png' | 'jpg' | 'zip'
  roi?: string; // x1,y1,x2,y2 格式的区域
  crop?: boolean; // 是否裁剪空白区域
  scale?: string; // '10%' | '50%' | '100%' 等比例
  position?: string; // 'center' | 'original'
  crop_margin?: string; // 裁剪边距
  semitransparency?: boolean; // 是否保留半透明
  shadow_type?: string; // 'drop_shadow' | 'reflection_shadow' | 'natural_shadow'
  shadow_opacity?: number; // 0.0 ~ 1.0
}

/**
 * 移除图片背景
 * @param imageUrl 本地图片路径
 * @param options 配置选项
 * @returns Promise<string> 处理后的图片路径
 */
export function removeBackground(imageUrl: string, options: RemoveBackgroundOptions = {}): Promise<string> {
  const { showToast } = useToast();

  return readFile(imageUrl)
    .then((fileData) => {
      // 将文件转为base64
      const base64 = uni.arrayBufferToBase64(fileData as ArrayBuffer);

      // 准备API参数
      const apiData: Record<string, any> = {
        image_file_b64: base64,
        size: options.size || "auto",
      };

      // 添加可选参数
      if (options.bg_color) apiData.bg_color = options.bg_color;
      if (options.type) apiData.type = options.type;
      if (options.type_level) apiData.type_level = options.type_level;
      if (options.format) apiData.format = options.format;
      if (options.roi) apiData.roi = options.roi;
      if (options.crop !== undefined) apiData.crop = options.crop ? "true" : "false";
      if (options.scale) apiData.scale = options.scale;
      if (options.position) apiData.position = options.position;
      if (options.crop_margin) apiData.crop_margin = options.crop_margin;
      if (options.semitransparency !== undefined)
        apiData.semitransparency = options.semitransparency ? "true" : "false";
      if (options.shadow_type) apiData.shadow_type = options.shadow_type;
      if (options.shadow_opacity !== undefined) apiData.shadow_opacity = options.shadow_opacity.toString();

      return new Promise<string>((resolve, reject) => {
        request({
          url: "/v1.0/removebg",
          method: "POST",
          header: { "X-API-Key": API_KEY },
          data: apiData,
          responseType: "arraybuffer",
        })
          .then((response: any) => {
            console.log("图片处理成功", response);
            saveFile(
              (response as UniApp.RequestSuccessCallbackResult).data as ArrayBuffer,
              `bg_removed_${Date.now()}.png`,
            )
              .then((filePath) => resolve(filePath))
              .catch((err) => reject(err));
          })
          .catch((error) => {
            showToast("处理图片失败");
            reject(error);
          });
      });
    })
    .catch((error) => {
      showToast("处理图片失败");
      throw error;
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
): Promise<string> {
  return removeBackground(imageUrl, {
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
