export interface PlatformInfo {
  isMiniProgram: boolean;
  isDevTool: boolean;
  isAndroid: boolean;
  isWeiXin: boolean;
  platform: string;
  miniProgramAction: (callback: () => void, otherCallback: () => void) => void;
}

export const usePlatform = (): PlatformInfo => {
  // 获取平台信息
  const platform = uni.getSystemInfoSync()?.platform || "h5";
  const isDevTool = platform === "devtools"; // 微信开发工具环境判断
  const isAndroid = platform === "android";
  const isWeiXin = platform === "mp-weixin";
  const isMiniProgram = isWeiXin || isDevTool || isAndroid;

  // 创建一个函数，判断是否为小程序环境，并执行传入的两个回调函数，第一个是小程序环境，第二个是其他环境,并接收参数
  const miniProgramAction = (
    callback: (...args: any[]) => void,
    otherCallback: (...args: any[]) => void,
    ...args: any[]
  ) => {
    if (isMiniProgram) {
      // 小程序环境
      // #ifdef MP-WEIXIN
      return callback(...args);
      // #endif
    }
    return otherCallback(...args);
  };

  return {
    isMiniProgram,
    isDevTool,
    isAndroid,
    isWeiXin,
    platform,
    miniProgramAction,
  };
};
