import { PhotoType } from "@/enums/PhotoType";
import {
  removeBackground,
  // changeBackgroundColor as changeBackground,
  mockRemoveBackground,
  createPhotoLayout,
  addWatermark,
} from "@/api/image";
import { RemoveBackgroundOptions } from "@/enums";
import { useToast } from "./useToast";
import { readFile, saveFile } from "@/utils/file";

export interface PhotoProcessorOptions {
  backgroundColor: string;
  photoType: PhotoType;
}

export interface PhotoProcessResult {
  photoUrl: string;
  thumbnailUrl: string;
}

export function usePhotoProcessor() {
  const { showToast } = useToast();
  // 生产环境使用真实API，开发环境使用模拟API
  let processedImageUrl;

  /**
   * 处理证件照
   * @param imageUrl 原始照片路径
   * @param options 处理选项
   */
  const processPhoto = async (imageUrl: string, options: PhotoProcessorOptions): Promise<PhotoProcessResult> => {
    const { backgroundColor, photoType } = options;

    try {
      // 根据证件照类型设置适当的API参数
      const apiOptions: RemoveBackgroundOptions = {
        image_file_b64: "",
        bg_color: backgroundColor,
        size: "auto",
        type: "person", // 证件照主要是人像
        format: "png", // 透明背景最好用PNG
        crop: true, // 裁剪空白区域
        semitransparency: false, // 证件照不需要半透明
      };
      console.log("生产环境使用真实API", import.meta.env.VITE_APP_ENV);
      // 根据证件照类型调整参数
      if (photoType) {
        // 根据证件照尺寸设置合适的输出尺寸
        if (photoType.pixelWidth && photoType.pixelHeight) {
          // 如果证件照尺寸较小（小于1000像素），使用较小的输出尺寸以提高处理速度
          if (photoType.pixelWidth < 1000 || photoType.pixelHeight < 1000) {
            apiOptions.size = "small";
          } else if (photoType.pixelWidth > 2000 || photoType.pixelHeight > 2000) {
            // 如果证件照尺寸较大，使用高清输出
            apiOptions.size = "hd";
          }
        }

        // 设置裁剪边距，根据证件照类型调整
        // 一寸、二寸等标准证件照通常需要较小的边距
        if (photoType.category === "standard") {
          apiOptions.crop_margin = "0";
        } else {
          // 其他类型可以保留一些边距
          apiOptions.crop_margin = "10";
        }

        // 根据证件照类型设置缩放比例
        // 确保输出图像符合证件照的尺寸要求
        if (photoType.pixelWidth && photoType.pixelHeight) {
          const targetSize = Math.max(photoType.pixelWidth, photoType.pixelHeight);
          if (targetSize < 500) {
            apiOptions.scale = "50%"; // 小尺寸证件照
          } else if (targetSize > 1500) {
            apiOptions.scale = "100%"; // 大尺寸证件照
          }
        }
      }

      // 使用跨平台的文件读取函数
      const fileData = await readFile(imageUrl);
      const base64 = uni.arrayBufferToBase64(fileData as ArrayBuffer);
      apiOptions.image_file_b64 = base64;
      if (import.meta.env.VITE_APP_ENV === "production") {
        // 使用真实API
        const res = await removeBackground(apiOptions);
        console.log("processedImageUrl", res);
        processedImageUrl = await saveFile(res, `bg_removed_${Date.now()}.png`);
        console.log("真实环境使用API", { imageUrl, apiOptions });
      } else {
        // 模拟API调用
        console.log("开发环境使用模拟API");
        processedImageUrl = await mockRemoveBackground(imageUrl);
      }

      // 生成缩略图
      // 在真实项目中，应该有一个专门的缩略图生成函数
      // 这里简单处理，实际应该对照片进行等比例缩小
      const thumbnailUrl = processedImageUrl;
      console.log("生成缩略图", { thumbnailUrl });

      return {
        photoUrl: processedImageUrl,
        thumbnailUrl,
      };
    } catch (error: any) {
      console.error("处理照片失败:", error.message);
      showToast("处理照片失败，请重试");
      throw error;
    }
  };

  /**
   * 生成照片排版预览
   * @param photoUrl 照片URL
   * @param count 排版数量（张数）
   */
  const generatePhotoLayout = async (photoUrl: string, count: 4 | 8 | 12 = 4): Promise<string> => {
    try {
      if (import.meta.env.VITE_APP_ENV === "production") {
        return await createPhotoLayout(photoUrl, count);
      } else {
        // 模拟排版生成
        console.log("模拟生成照片排版", { photoUrl, count });
        return photoUrl;
      }
    } catch (error: any) {
      console.error("生成排版失败:", error.message);
      showToast("生成排版失败，请重试");
      throw error;
    }
  };

  /**
   * 添加水印到照片
   * @param photoUrl 照片URL
   * @param text 水印文本
   */
  const addWatermarkToPhoto = async (photoUrl: string, text: string): Promise<string> => {
    try {
      if (import.meta.env.VITE_APP_ENV === "production") {
        return await addWatermark(photoUrl, text);
      } else {
        // 模拟水印添加
        console.log("模拟添加水印", { photoUrl, text });
        return photoUrl;
      }
    } catch (error: any) {
      console.error("添加水印失败:", error.message);
      showToast("添加水印失败");
      return photoUrl; // 水印失败仍然返回原图
    }
  };

  /**
   * 更换背景色
   * @param photoUrl 照片URL
   * @param backgroundColor 背景色
   */
  const changeBackgroundColor = async (
    photoUrl: string,
    backgroundColor: string,
    photoType?: PhotoType,
  ): Promise<string> => {
    try {
      // 准备API参数
      const apiOptions: RemoveBackgroundOptions = {
        format: "png", // 透明背景最好用PNG
      };
      console.log("生产环境使用真实更换背景色API", import.meta.env.VITE_APP_ENV);
      // 如果提供了photoType，根据证件照类型调整参数
      if (photoType) {
        // 设置裁剪边距，根据证件照类型调整
        if (photoType.category === "standard") {
          apiOptions.crop_margin = "0";
        } else {
          apiOptions.crop_margin = "10";
        }

        // 根据证件照尺寸设置合适的输出尺寸
        if (photoType.pixelWidth && photoType.pixelHeight) {
          if (photoType.pixelWidth < 1000 || photoType.pixelHeight < 1000) {
            apiOptions.size = "small";
          } else if (photoType.pixelWidth > 2000 || photoType.pixelHeight > 2000) {
            apiOptions.size = "hd";
          }
        }
      }

      if (import.meta.env.VITE_APP_ENV === "production") {
        console.log("请求地址:", "https://api.remove.bg/v1.0/removebg");
        // 使用真实API
        // TODO
        // return await changeBackground(photoUrl, backgroundColor, apiOptions);
        return "String";
      } else {
        // 开发环境使用模拟API
        console.log("模拟更换背景色:", backgroundColor);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(photoUrl);
          }, 800);
        });
      }
    } catch (error: any) {
      console.error("更换背景色失败:", error.message);
      showToast("更换背景色失败，请重试");
      throw error;
    }
  };

  /**
   * 智能裁剪照片适应证件尺寸
   * @param photoUrl 照片URL
   * @param photoType 证件照类型
   */
  const cropPhotoToSize = async (photoUrl: string, photoType: PhotoType): Promise<string> => {
    try {
      // 准备裁剪参数，使用证件照的尺寸比例
      const ratio = photoType.width / photoType.height;

      // 根据证件照类型设置更多裁剪参数
      const cropParams = {
        ratio,
        targetWidth: photoType.pixelWidth,
        targetHeight: photoType.pixelHeight,
        category: photoType.category,
        // 根据证件照类型设置不同的裁剪策略
        cropStrategy: photoType.category === "standard" ? "strict" : "flexible",
      };

      // 在实际项目中，这里应该使用Canvas对图片进行智能裁剪
      // 作为示例，我们只打印参数
      console.log("智能裁剪照片:", { photoUrl, ...cropParams });

      return photoUrl; // 这里简单返回原图
    } catch (error: any) {
      console.error("裁剪照片失败:", error.message);
      showToast("调整照片尺寸失败");
      return photoUrl;
    }
  };

  return {
    processPhoto,
    generatePhotoLayout,
    addWatermark: addWatermarkToPhoto,
    changeBackgroundColor,
    cropPhotoToSize,
  };
}
