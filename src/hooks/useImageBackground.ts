import { PhotoType } from "@/enums/index";
import { useToast } from "./useToast";

// 图片缓存
const imageCache = new Map<string, HTMLImageElement | ImageBitmap>();

// 清除缓存的函数
const clearImageCache = () => {
  console.log("清除图片缓存");
  imageCache.clear();
};

// 在页面关闭时清除缓存
// 使用uni-app的方式监听页面关闭事件
uni.onAppHide(() => {
  console.log("应用进入后台，清除图片缓存");
  clearImageCache();
});

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
      const isDevTool = platform === "devtools"; // 微信开发工具环境判断
      const isAndroid = platform === "android";
      const isWeiXin = platform === "mp-weixin";
      const isMiniProgram = isWeiXin || isDevTool || isAndroid;

      console.log("更换背景色环境:", platform);

      // 加载图片（使用缓存）
      const imageData = await loadImage(imageUrl);
      console.log("图片加载成功", imageData);

      // 创建Canvas
      const canvas = await createCanvas(imageData.width, imageData.height, isMiniProgram);
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("无法创建Canvas上下文");
      }

      // 清空Canvas
      ctx.clearRect(0, 0, imageData.width, imageData.height);

      // 绘制背景色
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, imageData.width, imageData.height);

      // 绘制图片
      ctx.drawImage(imageData, 0, 0, imageData.width, imageData.height);

      // 导出Canvas为图片
      const newImagePath = await exportCanvasToImage(canvas, isMiniProgram);
      console.log("背景色更换成功，新图片路径:", newImagePath);

      return newImagePath;
    } catch (error: any) {
      console.error("更换背景色失败:", error.message);
      showToast("更换背景色失败，请重试");
      throw error;
    }
  };

  const weiXinLoadImage = async (
    imageUrl: string,
    resolve: (value: HTMLImageElement | ImageBitmap) => void,
    reject: (reason?: any) => void,
  ) => {
    try {
      console.log("小程序加载图片:", imageUrl);

      // 检查缓存中是否已有该图片
      if (imageCache.has(imageUrl)) {
        console.log("使用缓存的图片:", imageUrl);
        resolve(imageCache.get(imageUrl)!);
        return;
      }

      // 非wxfile://路径，直接加载
      const offscreenCanvas = uni.createOffscreenCanvas({ type: "2d", width: 1, height: 1 });
      const img = (offscreenCanvas as any).createImage();

      // 添加超时处理
      const timeout = setTimeout(() => {
        reject(new Error("加载图片超时"));
      }, 30000); // 增加超时时间到30秒

      img.onload = () => {
        clearTimeout(timeout);
        console.log("小程序图片加载成功", img.width, img.height);
        // 将图片存入缓存
        imageCache.set(imageUrl, img);
        resolve(img);
      };

      img.onerror = (err: any) => {
        clearTimeout(timeout);
        console.error("小程序图片加载失败", err);
        reject(new Error("加载图片失败"));
      };

      img.src = imageUrl;
    } catch (error) {
      console.error("小程序加载图片出错:", error);
      reject(error);
    }
  };

  const h5LoadImage = async (
    imageUrl: string,
    resolve: (value: HTMLImageElement | ImageBitmap) => void,
    reject: (reason?: any) => void,
  ) => {
    // 检查缓存中是否已有该图片
    if (imageCache.has(imageUrl)) {
      console.log("使用缓存的图片:", imageUrl);
      resolve(imageCache.get(imageUrl)!);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous"; // 允许跨域

    // 添加超时处理
    const timeout = setTimeout(() => {
      reject(new Error("加载图片超时"));
    }, 10000);

    img.onload = () => {
      clearTimeout(timeout);
      console.log("H5图片加载成功", img.width, img.height);
      // 将图片存入缓存
      imageCache.set(imageUrl, img);
      resolve(img);
    };

    img.onerror = (err: any) => {
      clearTimeout(timeout);
      console.error("H5图片加载失败", err);
      reject(new Error("加载图片失败"));
    };

    img.src = imageUrl;
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
      const isDevTool = platform === "devtools"; // 微信开发工具环境判断
      const isAndroid = platform === "android";
      const isWeiXin = platform === "mp-weixin";
      const isMiniProgram = isWeiXin || isDevTool || isAndroid;

      console.log("加载图片环境:", platform, "图片路径:", imageUrl);

      if (isMiniProgram) {
        // 小程序环境
        // #ifdef MP-WEIXIN
        weiXinLoadImage(imageUrl, resolve, reject);
        return;
        // #endif
      }
      // H5环境
      h5LoadImage(imageUrl, resolve, reject);
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
    }
    // H5环境
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
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
          console.error("小程序导出图片失败", error);
          reject(error);
        }
      });
      // #endif
    }
    // H5环境
    return new Promise((resolve, reject) => {
      try {
        const dataURL = (canvas as HTMLCanvasElement).toDataURL("image/png");
        resolve(dataURL);
      } catch (error) {
        console.error("H5导出图片失败", error);
        reject(error);
      }
    });
  };

  return {
    changeBackground,
    clearImageCache, // 导出清除缓存的方法
  };
}
