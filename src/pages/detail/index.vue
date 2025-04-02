<template>
  <view class="detail-container">
    <!-- 内容区域 -->
    <view class="content-area pb-20 overflow-auto h-full px-4">
      <!-- 尺寸参数 -->
      <view class="mt-4">
        <h3 class="text-sm font-bold text-gray-800 mb-3">{{ photoType?.name }}</h3>
        <p class="text-xs text-gray-500 mb-3">{{ photoType?.description }}</p>

        <!-- 尺寸展示 -->
        <view class="bg-white rounded-xl p-4 shadow-sm">
          <view class="flex">
            <!-- 照片示例 -->
            <view class="w-1/3 mr-4">
              <view
                class="relative shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-sm"
                :style="{
                  width: '100%',
                  aspectRatio: `${photoType?.pixelWidth || 295}/${photoType?.pixelHeight || 413}`,
                  backgroundColor: selectedBackgroundColor,
                }">
                <view class="absolute inset-0 border-12 border-white border-solid shadow-inner"></view>
              </view>
            </view>

            <!-- 参数信息 -->
            <view class="w-2/3">
              <view class="grid grid-cols-1 gap-2">
                <view class="flex justify-between items-center">
                  <text class="text-sm text-gray-700">规格:</text>
                  <text class="text-sm font-medium">{{ photoType?.size }}</text>
                </view>

                <view class="flex justify-between items-center">
                  <text class="text-sm text-gray-700">文件格式:</text>
                  <text class="text-sm font-medium">jpg</text>
                </view>

                <view class="flex justify-between items-center">
                  <text class="text-sm text-gray-700">像素尺寸:</text>
                  <text class="text-sm font-medium">{{ photoType?.pixelWidth }}×{{ photoType?.pixelHeight }}px</text>
                </view>

                <view class="flex justify-between items-center">
                  <text class="text-sm text-gray-700">冲印尺寸:</text>
                  <text class="text-sm font-medium">{{ photoType?.width }}×{{ photoType?.height }}mm</text>
                </view>

                <view class="flex justify-between items-center">
                  <text class="text-sm text-gray-700">分辨率:</text>
                  <text class="text-sm font-medium">300dpi</text>
                </view>

                <view class="flex justify-between items-center">
                  <text class="text-sm text-gray-700">背景色:</text>
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
      </view>

      <!-- 温馨提示 -->
      <view class="mt-6">
        <h3 class="text-sm font-bold text-gray-800 mb-3">温馨提示</h3>

        <view class="bg-white rounded-xl p-4 shadow-sm">
          <view class="tip-item">
            <view class="tip-number">1</view>
            <text class="text-xs text-gray-700">照片背景必须是纯白色</text>
          </view>

          <view class="tip-item">
            <view class="tip-number">2</view>
            <text class="text-xs text-gray-700">双耳必须露出（避免佩戴耳饰）</text>
          </view>

          <view class="tip-item">
            <view class="tip-number">3</view>
            <text class="text-xs text-gray-700">不能佩戴墨镜（避免佩戴有色眼镜）</text>
          </view>

          <view class="tip-item">
            <view class="tip-number">4</view>
            <text class="text-xs text-gray-700">照片必须是近期（6个月内）拍摄</text>
          </view>
        </view>
      </view>

      <!-- 拍照选项 -->
      <view class="mt-6">
        <h3 class="text-sm font-bold text-gray-800 mb-3">拍照上传</h3>

        <view class="grid grid-cols-2 gap-3">
          <view class="action-button bg-indigo-50 text-indigo-600" @tap="handleChooseFromAlbum">
            <IconFont name="image" class="mr-2" />
            <text>相册上传</text>
          </view>

          <view class="action-button bg-blue-50 text-blue-600" @tap="navigateToCamera">
            <IconFont name="camera" class="mr-2" />
            <text>拍照上传</text>
          </view>
        </view>
      </view>
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
// const getUsageText = (id: string) => {
//   const usageMap: any = {
//     passport: "护照申请、国际旅行、签证申请等",
//     "one-inch": "各类证件、资格证书、学生证等",
//     "two-inch": "简历、档案、职业资格证等",
//     visa: "签证申请、出国留学、工作许可等",
//     "id-card": "身份证办理、户口本更新等",
//     "drive-license": "驾驶证申请与更新",
//   };

//   return usageMap[id] || "各类证件办理";
// };

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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.status-bar {
  height: 88rpx;
  background-color: #f7f7f7;
  position: relative;
  z-index: 10;
}

.content-area {
  height: calc(100vh - 88rpx - 140rpx);
}

.bottom-nav {
  border-top: 1px solid #eaeaea;
  background-color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 140rpx;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #999;
}

.bottom-nav-icon {
  font-size: 48rpx;
  margin-bottom: 4rpx;
}

.color-option {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-selected {
  transform: scale(1.1);
  border: 2rpx solid #4080ff;
  box-shadow: 0 0 0 4rpx rgba(64, 128, 255, 0.2);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.tip-number {
  width: 40rpx;
  height: 40rpx;
  background-color: #fef3c7;
  color: #d97706;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.action-button {
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 28rpx;
}
</style>
