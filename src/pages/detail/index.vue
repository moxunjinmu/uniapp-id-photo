<template>
  <view class="detail-container pb-20 overflow-auto h-full">
    <view v-if="photoType" class="h-full">
      <!-- 头部信息卡片 -->
      <view class="header-card bg-white mb-3 pb-6">
        <view class="flex flex-col items-center justify-center pt-6 px-4">
          <view
            :class="`bg-${photoType.backgroundColor}-100 w-120rpx h-120rpx rounded-full flex items-center justify-center mb-4`">
            <IconFont :name="photoType.icon" :class="`text-${photoType.backgroundColor}-500 text-50rpx`" />
          </view>
          <text class="text-36rpx font-bold mb-2">{{ photoType.name }}</text>
          <text class="text-28rpx text-gray-500 mb-4">{{ photoType.description }}</text>
        </view>

        <!-- 照片示例与参数信息 -->
        <view class="flex mx-4 bg-gray-50 rounded-xl p-4">
          <!-- 照片示例 -->
          <view class="w-1/3 mr-4">
            <view class="relative shadow-lg" style="width: 100%; aspect-ratio: 295/413">
              <view class="absolute inset-0 rounded-sm" :style="{ backgroundColor: selectedBackgroundColor }"></view>
              <view class="absolute inset-0 border-8 border-white rounded-sm"></view>
            </view>
          </view>

          <!-- 参数信息 -->
          <view class="w-2/3">
            <view class="grid grid-cols-1 gap-2">
              <view class="flex justify-between items-center">
                <text class="text-24rpx text-gray-500">规格:</text>
                <text class="text-28rpx font-medium">{{ photoType.size }}</text>
              </view>

              <view class="flex justify-between items-center">
                <text class="text-24rpx text-gray-500">文件格式:</text>
                <text class="text-28rpx font-medium">jpg</text>
              </view>

              <view class="flex justify-between items-center">
                <text class="text-24rpx text-gray-500">像素尺寸:</text>
                <text class="text-28rpx font-medium">{{ photoType.pixelWidth }}×{{ photoType.pixelHeight }}px</text>
              </view>

              <view class="flex justify-between items-center">
                <text class="text-24rpx text-gray-500">冲印尺寸:</text>
                <text class="text-28rpx font-medium">{{ photoType.width }}×{{ photoType.height }}mm</text>
              </view>

              <view class="flex justify-between items-center">
                <text class="text-24rpx text-gray-500">分辨率:</text>
                <text class="text-28rpx font-medium">300DPI</text>
              </view>

              <!-- 背景色选择 -->
              <view class="flex justify-between items-center">
                <text class="text-24rpx text-gray-500">背景色:</text>
                <view class="flex space-x-2">
                  <view
                    v-for="(color, index) in backgroundColors"
                    :key="index"
                    class="color-option"
                    :style="{ backgroundColor: color.value }"
                    :class="{ 'color-selected': selectedBackgroundColor === color.value }"
                    @tap="handleChangeBackgroundColor(color.value)"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 拍摄提示 -->
      <view class="bg-white rounded-t-xl mx-4 p-4 mb-3">
        <view class="mb-4">
          <text class="text-32rpx font-medium mb-3 block">拍摄要求</text>
          <view class="flex items-center mb-2">
            <view class="w-8rpx h-8rpx rounded-full bg-indigo-500 mr-2"></view>
            <text class="text-26rpx text-gray-700">五官端正，表情自然</text>
          </view>
          <view class="flex items-center mb-2">
            <view class="w-8rpx h-8rpx rounded-full bg-indigo-500 mr-2"></view>
            <text class="text-26rpx text-gray-700">头部占画面2/3，双耳对称露出</text>
          </view>
          <view class="flex items-center mb-2">
            <view class="w-8rpx h-8rpx rounded-full bg-indigo-500 mr-2"></view>
            <text class="text-26rpx text-gray-700">光线均匀，背景纯色</text>
          </view>
          <view class="flex items-center">
            <view class="w-8rpx h-8rpx rounded-full bg-indigo-500 mr-2"></view>
            <text class="text-26rpx text-gray-700">衣着整洁，不穿白色或与底色相近的衣服</text>
          </view>
        </view>

        <view class="mb-4">
          <text class="text-32rpx font-medium mb-3 block">使用场景</text>
          <text class="text-26rpx text-gray-700 leading-1.5">
            {{ photoType.description }}，可用于{{ getUsageText(photoType.id) }}
          </text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="px-4">
        <view class="grid grid-cols-2 gap-3">
          <button
            class="bg-gray-100 text-gray-800 py-3 rounded-full text-32rpx flex items-center justify-center"
            @tap="handleChooseFromAlbum">
            <IconFont name="image" class="mr-2" />
            相册上传
          </button>
          <button
            :class="`bg-${photoType.backgroundColor}-500 text-white py-3 rounded-full text-32rpx flex items-center justify-center`"
            @tap="navigateToCamera">
            <IconFont name="camera" class="mr-2" />
            立即拍照
          </button>
        </view>
      </view>
    </view>

    <!-- 加载中/错误提示 -->
    <view v-else class="flex flex-col items-center justify-center h-full">
      <IconFont name="spinner" class="text-gray-400 text-60rpx animate-spin mb-4" />
      <text class="text-28rpx text-gray-500">加载中...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useConfigStore } from "@/store/modules/config";
import { useCameraController } from "@/hooks/useCameraController";
// import { usePhotoProcessor } from "@/hooks/usePhotoProcessor";
import { useToast } from "@/hooks/useToast";
import { PhotoType } from "@/enums/PhotoType";

const configStore = useConfigStore();
const { chooseFromAlbum } = useCameraController();
// const { changeBackgroundColor } = usePhotoProcessor();
const { showToast, showLoading, hideLoading } = useToast();
// 获取照片类型ID
const photoTypeId = ref("");
const photoType = ref<PhotoType | null>(null);
// 背景色相关
const backgroundColors = ref<Array<{ name: string; value: string }>>(configStore.backgroundColors);
const selectedBackgroundColor = ref<string>("#2196F3"); // 默认蓝色背景

// 预览图片样式
const previewImageStyle = ref({
  width: "100%",
  height: "100%",
  backgroundColor: "#FFFFFF",
});

// 获取用途文本
const getUsageText = (id: string) => {
  const usageMap: any = {
    passport: "护照申请、国际旅行、签证申请等",
    "one-inch": "各类证件、资格证书、学生证等",
    "two-inch": "简历、档案、职业资格证等",
    visa: "签证申请、出国留学、工作许可等",
    "id-card": "身份证办理、户口本更新等",
    "drive-license": "驾驶证申请与更新",
  };

  return usageMap[id] || "各类证件办理";
};

// 从相册选择照片
const handleChooseFromAlbum = async () => {
  try {
    const imgPath = await chooseFromAlbum();
    navigateToPhotoResult(imgPath);
  } catch (error) {
    console.error("选择图片失败", error);
  }
};

// 导航到相机页面
const navigateToCamera = () => {
  uni.navigateTo({
    url: `/pages/camera/index?id=${photoTypeId.value}`,
  });
};

// 导航到结果页面
const navigateToPhotoResult = (imgPath: string) => {
  uni.navigateTo({
    url: `/pages/photo-result/index?id=${photoTypeId.value}&imgPath=${encodeURIComponent(imgPath)}`,
  });
};
const handlePhotoType = (photoTypeId: string) => {
  const photoType = configStore.getPhotoTypeById(photoTypeId);
  if (!photoType) {
    showToast("未找到对应照片类型");
    throw new Error("PhotoType not found");
  }
  return photoType;
};

// 更换背景色
const handleChangeBackgroundColor = async (color: string) => {
  if (selectedBackgroundColor.value === color) return;

  showLoading("更换背景色中...");
  selectedBackgroundColor.value = color;

  try {
    // 直接更新预览图片的背景色
    previewImageStyle.value = {
      ...previewImageStyle.value,
      backgroundColor: color,
    };

    hideLoading();
    showToast("背景色更换成功");
  } catch (error: any) {
    hideLoading();
    showToast("背景色更换失败");
    console.log(error.message);
  }
};

// 设置默认背景色
const setDefaultBackground = (photoType: PhotoType) => {
  if (photoType.backgroundColor) {
    const color = backgroundColors.value.find((c) => c.name.toLowerCase().includes(photoType.backgroundColor!));
    selectedBackgroundColor.value = color?.value || "#FFFFFF"; // 提供默认值
  }
};

onLoad((options: any) => {
  console.log("options", options);

  try {
    // 获取路由参数
    photoTypeId.value = options.id;

    if (photoTypeId.value) {
      photoType.value = handlePhotoType(photoTypeId.value);
      // 设置默认背景色
      if (photoType.value) {
        setDefaultBackground(photoType.value);
      }
    } else {
      uni.showToast({
        title: "参数错误",
        icon: "none",
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  } catch (error) {
    console.log("error", error);
  }
});
</script>

<style lang="scss" scoped>
.detail-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.header-card {
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
}

.color-option {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #e0e0e0;
  transition: all 0.3s ease;
  margin-left: 10rpx;
}

.color-selected {
  transform: scale(1.1);
  border: 2rpx solid #4080ff;
  box-shadow: 0 0 0 4rpx rgba(64, 128, 255, 0.2);
}

button {
  font-weight: normal;
  border: none;

  &::after {
    border: none;
  }
}
</style>
