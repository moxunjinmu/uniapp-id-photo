import { defineStore } from "pinia";
import { ref } from "vue";
// import { PhotoType } from "@/enums/PhotoType";

export interface PhotoState {
  // 当前选择的照片类型ID
  photoTypeId: string;
  // 原始图片路径
  sourceImagePath: string;
  // 处理后的图片路径
  processedImagePath: string;
  // 布局排版后的图片路径
  layoutImagePath: string;
  // 当前选择的背景色
  backgroundColor: string;
  // 当前的预览模式
  previewMode: "single" | "layout";
  // 是否处理完成
  isProcessed: boolean;
}

export const usePhotoStore = defineStore("photo", () => {
  // 照片处理状态
  const photoState = ref<PhotoState>({
    photoTypeId: "",
    sourceImagePath: "",
    processedImagePath: "",
    layoutImagePath: "",
    backgroundColor: "#2196F3", // 默认蓝色背景
    previewMode: "single",
    isProcessed: false,
  });

  // 清空照片状态
  const resetPhotoState = () => {
    photoState.value = {
      photoTypeId: "",
      sourceImagePath: "",
      processedImagePath: "",
      layoutImagePath: "",
      backgroundColor: "#2196F3",
      previewMode: "single",
      isProcessed: false,
    };
  };

  // 设置照片类型
  const setPhotoType = (photoTypeId: string) => {
    photoState.value.photoTypeId = photoTypeId;
  };

  // 设置原始图片路径
  const setSourceImage = (imagePath: string) => {
    photoState.value.sourceImagePath = imagePath;
  };

  // 设置处理后的图片路径
  const setProcessedImage = (imagePath: string) => {
    photoState.value.processedImagePath = imagePath;
    photoState.value.isProcessed = true;
  };

  // 设置布局排版图片
  const setLayoutImage = (imagePath: string) => {
    photoState.value.layoutImagePath = imagePath;
  };

  // 设置背景色
  const setBackgroundColor = (color: string) => {
    photoState.value.backgroundColor = color;
  };

  // 设置预览模式
  const setPreviewMode = (mode: "single" | "layout") => {
    photoState.value.previewMode = mode;
  };

  // 设置处理状态
  const setProcessedState = (isProcessed: boolean) => {
    photoState.value.isProcessed = isProcessed;
  };

  // 初始化照片数据（用于一次性设置多个值）
  const initPhotoData = (data: Partial<PhotoState>) => {
    photoState.value = {
      ...photoState.value,
      ...data,
    };
  };

  return {
    photoState,
    resetPhotoState,
    setPhotoType,
    setSourceImage,
    setProcessedImage,
    setLayoutImage,
    setBackgroundColor,
    setPreviewMode,
    setProcessedState,
    initPhotoData,
  };
});
