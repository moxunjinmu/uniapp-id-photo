/**
 * 环境配置
 */

// 环境类型
export type EnvType = "development" | "production" | "preview";

// 获取当前环境
const currentEnv = import.meta.env.VITE_APP_ENV as EnvType;

// 环境配置
export const env = {
  // 当前环境
  mode: currentEnv,

  // 是否为开发环境
  isDev: currentEnv === "development",

  // 是否为生产环境
  isProd: currentEnv === "production",

  // 是否为预览环境
  isPreview: currentEnv === "preview",

  // API配置
  api: {
    // API基础路径
    baseUrl:
      currentEnv === "production"
        ? "https://api.remove.bg" // 生产环境
        : currentEnv === "preview"
          ? "https://api.remove.bg" // 预览环境
          : "https://api.remove.bg", // 开发环境
  },

  // 功能开关
  features: {
    // 是否使用模拟数据
    useMock: currentEnv === "development",

    // 是否启用调试日志
    enableDebug: currentEnv !== "production",
  },
};
