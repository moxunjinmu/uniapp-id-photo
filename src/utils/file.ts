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
  try {
    // 使用uni.request替代fetch
    return new Promise((resolve, reject) => {
      uni.request({
        url: filePath,
        method: "GET",
        responseType: "arraybuffer",
        success: (res) => {
          resolve(res.data as ArrayBuffer);
        },
        fail: (err) => {
          console.error("请求文件失败:", err);
          reject(err);
        },
      });
    });
  } catch (error) {
    console.error("读取文件失败: ", error);
    throw error;
  }
}

/**
 * 保存文件
 * @param data 文件数据
 * @param fileName 文件名
 * @returns Promise<string> 保存后的文件路径
 */
export async function saveFile(data: ArrayBuffer, fileName: string): Promise<string> {
  try {
    // 获取平台信息
    const platform = uni.getSystemInfoSync()?.platform || "h5";

    if (platform === "h5" || platform === "windows" || platform === "ios" || platform === "android") {
      // H5环境下，使用Blob和URL.createObjectURL
      const blob = new Blob([data], { type: "image/png" });
      return URL.createObjectURL(blob);
    } else {
      // 小程序环境下，使用文件系统
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
  } catch (error) {
    console.error("保存文件失败:", error);
    throw error;
  }
}

/**
 * 获取临时目录
 * @returns string 临时目录路径
 */
export function getTempDir(): string {
  try {
    const platform = uni.getSystemInfoSync()?.platform || "h5";
    return platform === "h5" ? "/temp" : uni.getStorageSync("tempFilePath") || "/temp";
  } catch (error) {
    console.error("获取临时目录失败:", error);
    return "/temp";
  }
}
