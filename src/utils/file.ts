/*
 * @Author: moxunjinmu
 * @Date: 2025-04-02 16:28:56
 * @Description:
 */

/**
 * 跨平台文件操作工具
 */

const fsReadFile = (filePath: string): Promise<ArrayBuffer> => {
  // 微信小程序环境下，使用文件系统管理器
  return new Promise((resolve, reject) => {
    const fs = uni.getFileSystemManager();
    fs.readFile({
      filePath: filePath,
      success: (res: any) => {
        resolve(res.data as ArrayBuffer);
      },
      fail: (err: any) => {
        console.error("读取文件失败:", err);
        reject(err);
      },
    });
  });
};

const uniRequest = (filePath: string): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${filePath}`,
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
};

/**
 * 读取文件内容
 * @param filePath 文件路径
 * @returns Promise<ArrayBuffer> 文件内容
 */
export async function readFile(filePath: string): Promise<ArrayBuffer> {
  try {
    if (!filePath) {
      throw new Error("文件路径不能为空");
    }

    // 获取平台信息
    const platform = uni.getSystemInfoSync()?.platform || "h5";

    // 获取系统信息判断环境
    const isDevTool = platform === "devtools"; // 微信开发工具环境判断
    const isAndroid = platform === "android";
    const isWeiXin = platform === "mp-weixin";
    console.log("环境", platform);

    if (isDevTool || isWeiXin || isAndroid) {
      // #ifdef MP-WEIXIN
      return fsReadFile(filePath);
      // #endif
    }
    return uniRequest(filePath);
  } catch (error) {
    console.error("读取文件失败: ", error);
    throw error;
  }
}

const saveFsFile = (data: ArrayBuffer, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fs = uni.getFileSystemManager();
    const tempDir = wx.env.USER_DATA_PATH;
    const filePath = `${tempDir}/${fileName}`;
    fs.writeFile({
      filePath,
      data,
      encoding: "binary",
      success: () => resolve(filePath),
      fail: (err) => reject(err),
    });
  });
};

const saveBlobFile = (data: ArrayBuffer): Promise<string> => {
  // H5环境下，使用Blob和URL.createObjectURL
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([data], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};

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
    // 获取系统信息判断环境
    const isDevTool = platform === "devtools"; // 微信开发工具环境判断
    const isAndroid = platform === "android";
    const isWeiXin = platform === "mp-weixin";

    if (isDevTool || isWeiXin || isAndroid) {
      // #ifdef MP-WEIXIN
      return saveFsFile(data, fileName);
      // #endif
    }
    return saveBlobFile(data);
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

/**
 * H5环境下载文件
 * @param filePath 文件路径
 * @param fileName 文件名
 * @returns Promise<string> 下载后的文件路径
 */
const downloadFileH5 = (filePath: string, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: filePath,
      success: (res) => {
        if (res.statusCode === 200) {
          // 使用fileName作为下载文件名
          const a = document.createElement("a");
          a.href = res.tempFilePath;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          resolve(res.tempFilePath);
        } else {
          reject(new Error(`下载失败，状态码: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error("H5下载文件失败:", err);
        reject(err);
      },
    });
  });
};

const uniSaveImageToPhotosAlbum = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        resolve(filePath);
      },
      fail: (err) => {
        console.error("保存到相册失败:", err);
        reject(err);
      },
    });
  });
};

/**
 * 微信小程序或iOS环境下载文件
 * @param filePath 文件路径
 * @returns Promise<string> 下载后的文件路径
 */
const downloadFileWeixinOrIOS = async (filePath: string): Promise<string> => {
  // 验证URL格式
  if (!filePath || typeof filePath !== "string") {
    throw new Error("无效的文件路径");
  }

  // 检查是否是本地临时文件路径
  const isLocalPath = filePath.startsWith("wxfile://") || filePath.startsWith("http://tmp/");

  // 如果是本地临时文件，直接保存到相册
  if (isLocalPath) {
    return uniSaveImageToPhotosAlbum(filePath);
  }

  // 先下载到临时文件
  const tempFilePath = await downloadFileOther(filePath);

  // 保存到相册
  return uniSaveImageToPhotosAlbum(tempFilePath);
};

/**
 * 其他环境（如Android）下载文件
 * @param filePath 文件路径
 * @returns Promise<string> 下载后的文件路径
 */
const downloadFileOther = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 检查URL是否有效
    if (!filePath.startsWith("http://") && !filePath.startsWith("https://")) {
      reject(new Error("无效的URL格式，必须以http://或https://开头"));
      return;
    }

    uni.downloadFile({
      url: filePath,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        } else {
          reject(new Error(`下载失败，状态码: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error("下载文件失败:", err);
        reject(err);
      },
    });
  });
};

/**
 * 下载文件到本地
 * @param filePath 文件路径
 * @param fileName 文件名
 * @returns Promise<string> 下载后的文件路径
 */
export async function downloadFile(filePath: string, fileName: string): Promise<string> {
  try {
    // 验证参数
    if (!filePath) {
      throw new Error("文件路径不能为空");
    }

    // 获取平台信息
    const platform = uni.getSystemInfoSync()?.platform || "h5";

    // 获取系统信息判断环境
    const isDevTool = platform === "devtools"; // 微信开发工具环境判断
    const isAndroid = platform === "android";
    const isWeiXin = platform === "mp-weixin";
    const isH5 = platform === "h5";
    const isIOS = platform === "ios";
    console.log("环境", platform);

    if (isDevTool || isWeiXin || isAndroid) {
      // #ifdef MP-WEIXIN
      return downloadFileWeixinOrIOS(filePath);
      // #endif
    }

    if (isH5) {
      return downloadFileH5(filePath, fileName);
    }

    if (isIOS) {
      // return downloadFileIOS(filePath);
    }

    return downloadFileOther(filePath);
  } catch (error) {
    console.error("下载文件失败:", error);
    throw error;
  }
}

/**
 * 将base64转换为临时文件路径
 * @param base64 base64字符串
 * @returns Promise<string> 临时文件路径
 */
const base64ToTempFilePath = async (base64: string, base64fileName?: string): Promise<string> => {
  const { arrayBuffer, fileName } = await new Promise<{ arrayBuffer: ArrayBuffer; fileName: string }>(
    (resolve, reject) => {
      try {
        // 移除base64头部信息
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
        // 将base64转换为ArrayBuffer
        const arrayBuffer = uni.base64ToArrayBuffer(base64Data);
        base64fileName = base64fileName ?? `temp_${Date.now()}.png`;
        resolve({ arrayBuffer, fileName: base64fileName });
      } catch (error) {
        console.error("base64转临时文件失败:", error);
        reject(error);
      }
    },
  );

  return saveFile(arrayBuffer, fileName);
};

/**
 * 保存图片到相册
 * @param filePath 图片路径
 * @returns Promise<void>
 */
export async function saveImageToPhotosAlbum(filePath: string, fileName?: string): Promise<void | string> {
  try {
    fileName = fileName ?? `temp_${Date.now()}.png`;
    // 获取平台信息
    const platform = uni.getSystemInfoSync()?.platform || "h5";

    // 获取系统信息判断环境
    const isDevTool = platform === "devtools"; // 微信开发工具环境判断
    const isAndroid = platform === "android";
    const isWeiXin = platform === "mp-weixin";
    const isH5 = platform === "h5";
    // const isIOS = platform === "ios";
    console.log("环境", platform);

    // 检查是否是base64格式
    const isBase64 = filePath.startsWith("data:image/");

    // 如果是base64格式，需要先转换为临时文件
    if (isBase64) {
      console.log("检测到base64格式图片，转换为临时文件");
      filePath = await base64ToTempFilePath(filePath, fileName);
    }

    if (isDevTool || isWeiXin || isAndroid) {
      // #ifdef MP-WEIXIN
      return downloadFileWeixinOrIOS(filePath);
      // #endif
    }

    // 如果是H5环境，需要先下载文件
    if (isH5 || isAndroid) {
      downloadFileH5(filePath, fileName);
      return;
    }

    // 其他环境使用uni.saveImageToPhotosAlbum
    return uniSaveImageToPhotosAlbum(filePath);
  } catch (error) {
    console.error("保存图片到相册失败:", error);
    throw error;
  }
}
