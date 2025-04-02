/*
 * @Author: moxunjinmu
 * @Date: 2025-04-02 16:28:56
 * @Description:
 */
/**
 * 跨平台文件操作工具
 */

/**
 * 读取文件内容
 * @param filePath 文件路径
 * @returns Promise<ArrayBuffer> 文件内容
 */
export async function readFile(filePath: string): Promise<ArrayBuffer> {
  // 检查当前环境
  console.log("当前环境", uni.getSystemInfoSync().platform);
  if (
    uni.getSystemInfoSync().platform === "h5" ||
    uni.getSystemInfoSync().platform === "windows" ||
    uni.getSystemInfoSync().platform === "ios" ||
    uni.getSystemInfoSync().platform === "android"
  ) {
    // H5环境下使用fetch
    const response = await fetch(filePath);
    return await response.arrayBuffer();
  } else {
    // 小程序和App环境下使用uni.getFileSystemManager
    return new Promise((resolve, reject) => {
      const fs = uni.getFileSystemManager();
      fs.readFile({
        filePath,
        success: (res) => resolve(res.data as ArrayBuffer),
        fail: (err) => reject(err),
      });
    });
  }
}

/**
 * 保存文件
 * @param data 文件数据
 * @param fileName 文件名
 * @returns Promise<string> 保存后的文件路径
 */
export async function saveFile(data: ArrayBuffer, fileName: string): Promise<string> {
  if (
    uni.getSystemInfoSync().platform === "h5" ||
    uni.getSystemInfoSync().platform === "windows" ||
    uni.getSystemInfoSync().platform === "ios" ||
    uni.getSystemInfoSync().platform === "android"
  ) {
    // H5环境下，使用Blob和URL.createObjectURL
    const blob = new Blob([data], { type: "image/png" });
    return URL.createObjectURL(blob);
  } else {
    // 小程序和App环境下，使用文件系统
    return new Promise((resolve, reject) => {
      const fs = uni.getFileSystemManager();
      let tempDir = uni.getStorageSync("tempFilePath") || "";

      if (!tempDir) {
        try {
          tempDir = "/temp";
          fs.mkdirSync(tempDir, true);
        } catch (pathError) {
          console.error("创建临时目录失败，使用默认路径", pathError);
          tempDir = "/temp";
        }
        uni.setStorageSync("tempFilePath", tempDir);
      }

      const filePath = `${tempDir}/${fileName}`;
      fs.writeFile({
        filePath,
        data,
        encoding: "binary",
        success: () => resolve(filePath),
        fail: (err) => reject(err),
      });
    });
  }
}

/**
 * 获取临时目录
 * @returns string 临时目录路径
 */
export function getTempDir(): string {
  if (uni.getSystemInfoSync().platform === "h5") {
    return "/temp";
  } else {
    return uni.getStorageSync("tempFilePath") || "/temp";
  }
}
