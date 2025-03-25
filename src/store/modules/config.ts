import { defineStore } from "pinia";
import { PhotoType } from "@/enums/PhotoType";

export const useConfigStore = defineStore("config", () => {
  // 证件照类型列表
  const photoTypes = ref<PhotoType[]>([
    {
      id: "passport",
      name: "护照照片",
      size: "35×45mm",
      width: 35,
      height: 45,
      pixelWidth: 413,
      pixelHeight: 531,
      category: "证件照",
      description: "标准护照证件照，国际通用",
      isPopular: true,
      icon: "id-card",
      backgroundColor: "blue",
    },
    {
      id: "one-inch",
      name: "一寸照片",
      size: "25×35mm",
      width: 25,
      height: 35,
      pixelWidth: 295,
      pixelHeight: 413,
      category: "证件照",
      description: "标准一寸证件照，适用于各类证件",
      isPopular: true,
      icon: "id-badge",
      backgroundColor: "green",
    },
    {
      id: "two-inch",
      name: "二寸照片",
      size: "35×49mm",
      width: 35,
      height: 49,
      pixelWidth: 413,
      pixelHeight: 579,
      category: "证件照",
      description: "标准二寸证件照，适用于各类证件",
      isPopular: true,
      icon: "graduation-cap",
      backgroundColor: "amber",
    },
    {
      id: "visa",
      name: "签证照片",
      size: "33×48mm",
      width: 33,
      height: 48,
      pixelWidth: 390,
      pixelHeight: 567,
      category: "证件照",
      description: "签证申请专用照片",
      isPopular: true,
      icon: "plane",
      backgroundColor: "purple",
    },
    {
      id: "id-card",
      name: "身份证照片",
      size: "26×32mm",
      width: 26,
      height: 32,
      pixelWidth: 307,
      pixelHeight: 378,
      category: "证件照",
      description: "身份证办理专用照片",
      isPopular: true,
      icon: "address-card",
      backgroundColor: "red",
    },
    {
      id: "drive-license",
      name: "驾照照片",
      size: "22×32mm",
      width: 22,
      height: 32,
      pixelWidth: 260,
      pixelHeight: 378,
      category: "证件照",
      description: "驾驶证办理专用照片",
      isPopular: false,
      icon: "car",
      backgroundColor: "orange",
    },
  ]);

  // 可选背景色
  const backgroundColors = ref([
    { name: "白色", value: "#FFFFFF" },
    { name: "蓝色", value: "#2196F3" },
    { name: "红色", value: "#F44336" },
    { name: "绿色", value: "#4CAF50" },
    { name: "灰色", value: "#9E9E9E" },
  ]);

  // 获取热门照片类型
  const getPopularPhotoTypes = computed(() => {
    return photoTypes.value.filter((type) => type.isPopular);
  });

  // 搜索照片类型
  const searchPhotoTypes = (keyword: string) => {
    if (!keyword) return photoTypes.value;

    const lowerKeyword = keyword.toLowerCase();
    return photoTypes.value.filter(
      (type) =>
        type.name.toLowerCase().includes(lowerKeyword) ||
        type.description.toLowerCase().includes(lowerKeyword) ||
        type.size.toLowerCase().includes(lowerKeyword),
    );
  };

  // 根据ID获取照片类型
  const getPhotoTypeById = (id: string): PhotoType | undefined => {
    return photoTypes.value.find((type) => type.id === id);
  };

  return {
    photoTypes,
    backgroundColors,
    getPopularPhotoTypes,
    searchPhotoTypes,
    getPhotoTypeById,
  };
});
