// 照片类型定义
export interface PhotoType {
  id: string;
  name: string;
  size: string;
  // 尺寸，单位毫米
  width: number;
  height: number;
  // 尺寸，单位像素
  pixelWidth: number;
  pixelHeight: number;
  category: string;
  description: string;
  isPopular: boolean;
  icon: string;
  backgroundColor: string;
}

// 照片背景色类型
export interface BackgroundColor {
  name: string;
  value: string;
}

// 预览模式
export enum PreviewMode {
  Single = "single",
  Layout = "layout",
}
