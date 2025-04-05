import { PhotoType } from "@/enums/PhotoType";
import { useToast } from "./useToast";

export interface ChangeBackgroundOptions {
  backgroundColor: string;
  photoType?: PhotoType;
}

/**
 * 使用Canvas API在前端更换图片背景色
 */
export function useImageBackground() {
  const { showToast } = useToast();

  /**
   * 更换图片背景色
   * @param imageUrl 原始图片路径
   * @param options 更换背景选项
   * @returns Promise<string> 处理后的图片路径
   */
  const changeBackground = async (imageUrl: string, options: ChangeBackgroundOptions): Promise<string> => {
    const { backgroundColor } = options;
    console.log("更换背景色", { imageUrl, backgroundColor });

    try {
      // 获取平台信息
      const platform = uni.getSystemInfoSync()?.platform || "h5";
      const isMiniProgram = platform === "mp-weixin" || platform === "devtools";

      // 加载图片
      const imageData = await loadImage(imageUrl);

      // 创建Canvas
      const canvas = await createCanvas(imageData.width, imageData.height, isMiniProgram);
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("无法创建Canvas上下文");
      }

      // 绘制背景色
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, imageData.width, imageData.height);

      // 绘制图片
      ctx.drawImage(imageData, 0, 0, imageData.width, imageData.height);

      // 导出Canvas为图片
      const newImagePath = await exportCanvasToImage(canvas, isMiniProgram);

      return newImagePath;
    } catch (error: any) {
      console.error("更换背景色失败:", error.message);
      showToast("更换背景色失败，请重试");
      throw error;
    }
  };

  /**
   * 加载图片
   * @param imageUrl 图片路径
   * @returns Promise<HTMLImageElement | ImageBitmap> 加载的图片对象
   */
  const loadImage = async (imageUrl: string): Promise<HTMLImageElement | ImageBitmap> => {
    return new Promise((resolve, reject) => {
      // 获取平台信息
      const platform = uni.getSystemInfoSync()?.platform || "h5";
      const isMiniProgram = platform === "mp-weixin" || platform === "devtools";

      if (isMiniProgram) {
        // 小程序环境
        // #ifdef MP-WEIXIN
        const offscreenCanvas = uni.createOffscreenCanvas({ type: "2d", width: 1, height: 1 });
        const img = (offscreenCanvas as any).createImage();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("加载图片失败"));
        img.src = imageUrl;
        // #endif
      } else {
        // H5环境
        const img = new Image();
        img.crossOrigin = "anonymous"; // 允许跨域
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("加载图片失败"));
        img.src = imageUrl;
      }
    });
  };

  /**
   * 创建Canvas
   * @param width 宽度
   * @param height 高度
   * @param isMiniProgram 是否是小程序环境
   * @returns Promise<HTMLCanvasElement | OffscreenCanvas> Canvas对象
   */
  const createCanvas = async (
    width: number,
    height: number,
    isMiniProgram: boolean,
  ): Promise<HTMLCanvasElement | OffscreenCanvas> => {
    if (isMiniProgram) {
      // 小程序环境
      // #ifdef MP-WEIXIN
      const canvas = uni.createOffscreenCanvas({ type: "2d", width, height }) as any;
      return canvas;
      // #endif
    } else {
      // H5环境
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
  };

  /**
   * 导出Canvas为图片
   * @param canvas Canvas对象
   * @param isMiniProgram 是否是小程序环境
   * @returns Promise<string> 图片路径
   */
  const exportCanvasToImage = async (
    canvas: HTMLCanvasElement | OffscreenCanvas,
    isMiniProgram: boolean,
  ): Promise<string> => {
    if (isMiniProgram) {
      // 小程序环境
      // #ifdef MP-WEIXIN
      return new Promise((resolve, reject) => {
        try {
          const tempFilePath = (canvas as any).toDataURL("image/png");
          resolve(tempFilePath);
        } catch (error) {
          reject(error);
        }
      });
      // #endif
    } else {
      // H5环境
      return new Promise((resolve, reject) => {
        try {
          const dataURL = (canvas as HTMLCanvasElement).toDataURL("image/png");
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      });
    }
  };

  return {
    changeBackground,
  };
}
