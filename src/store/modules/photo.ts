import { defineStore } from "pinia";
import { ref } from "vue";

export interface PhotoData {
  photoTypeId: string;
  imgPath: string | null;
  backgroundColorValue: string;
  processedImgPath?: string;
}

export const usePhotoStore = defineStore("photo", () => {
  // 照片数据
  const photoData = ref<PhotoData>({
    photoTypeId: "", // 照片类型ID
    imgPath: null, // 原始图片路径
    backgroundColorValue: "#2196F3", // 默认背景色
    processedImgPath: undefined, // 处理后的图片路径
  });

  // 设置照片类型ID
  const setPhotoTypeId = (id: string) => {
    photoData.value.photoTypeId = id;
  };

  // 设置照片路径
  const setImgPath = (path: string) => {
    photoData.value.imgPath = path;
  };

  // 设置背景色
  const setBackgroundColor = (color: string) => {
    photoData.value.backgroundColorValue = color;
  };

  // 设置处理后的图片路径
  const setProcessedImgPath = (path: string) => {
    photoData.value.processedImgPath = path;
  };

  // 重置照片数据
  const resetPhotoData = () => {
    photoData.value = {
      photoTypeId: "",
      imgPath: null,
      backgroundColorValue: "#2196F3",
      processedImgPath: undefined,
    };
  };

  return {
    photoData,
    setPhotoTypeId,
    setImgPath,
    setBackgroundColor,
    setProcessedImgPath,
    resetPhotoData,
  };
});
