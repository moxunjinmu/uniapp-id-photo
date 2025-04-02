import { PhotoType } from "@/enums/PhotoType";
import { removeBackground, changeBackgroundColor as changeBackground, mockRemoveBackground } from "@/api/image";
import { useToast } from "./useToast";

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

  /**
   * 处理证件照
   * @param imageUrl 原始照片路径
   * @param options 处理选项
   */
  const processPhoto = async (imageUrl: string, options: PhotoProcessorOptions): Promise<PhotoProcessResult> => {
    const { backgroundColor } = options;

    try {
      // 生产环境使用真实API，开发环境使用模拟API
      let processedImageUrl;
      if (import.meta.env.PROD) {
        // 使用真实API
        processedImageUrl = await removeBackground(imageUrl, {
          bg_color: backgroundColor,
        });
      } else {
        // 使用模拟API
        processedImageUrl = await mockRemoveBackground(imageUrl);
      }

      // 生成缩略图 (实际项目中应该有专门的缩略图生成函数)
      const thumbnailUrl = processedImageUrl;

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
  const generatePhotoLayout = (photoUrl: string, count: 4 | 8 | 12 = 4): string => {
    // 模拟生成排版预览
    console.log("生成照片排版", { photoUrl, count });
    return photoUrl; // 实际项目中应该返回排版后的图片URL
  };

  /**
   * 添加水印到照片
   * @param photoUrl 照片URL
   * @param text 水印文本
   */
  const addWatermark = (photoUrl: string, text: string): string => {
    // 模拟添加水印
    console.log("添加水印", { photoUrl, text });
    return photoUrl; // 实际项目中应该返回添加水印后的图片URL
  };

  /**
   * 更换背景色
   * @param photoUrl 照片URL
   * @param backgroundColor 背景色
   */
  const changeBackgroundColor = async (photoUrl: string, backgroundColor: string): Promise<string> => {
    try {
      if (import.meta.env.PROD) {
        // 使用真实API
        return await changeBackground(photoUrl, backgroundColor);
      } else {
        // 开发环境使用模拟API
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

  return {
    processPhoto,
    generatePhotoLayout,
    addWatermark,
    changeBackgroundColor,
  };
}
