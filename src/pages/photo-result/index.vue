<!--
 * @Author: moxunjingmu
 * @Date: 2025-03-25 19:24:06
 * @Description:
-->
<template>
  <view class="result-container pb-20 overflow-auto h-full">
    <!-- 顶部标题 -->
    <view class="status-bar flex items-center justify-between px-4 py-3">
      <text class="text-32rpx font-medium">照片结果</text>
    </view>

    <view v-if="photoType && imgPath" class="px-4">
      <!-- 照片预览区 -->
      <view class="preview-section bg-white rounded-xl p-4 mb-4">
        <!-- 切换按钮 -->
        <view class="flex justify-between mb-3">
          <view
            :class="[previewMode === 'single' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600']"
            class="px-4 py-2 rounded-full text-26rpx transition-colors"
            @tap="previewMode = 'single'">
            单张预览
          </view>
          <view
            :class="[previewMode === 'layout' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600']"
            class="px-4 py-2 rounded-full text-26rpx transition-colors"
            @tap="previewMode = 'layout'">
            排版预览
          </view>
        </view>

        <!-- 单张预览 -->
        <view v-if="previewMode === 'single'" class="photo-preview">
          <image :src="imgPath" mode="aspectFit" class="preview-image">
            <!-- 水印 -->
            <text class="watermark">证件照预览</text>
          </image>
        </view>

        <!-- 排版预览 -->
        <view v-else class="layout-preview">
          <image :src="imgPath" mode="aspectFit" class="layout-image"></image>
        </view>

        <!-- 照片信息 -->
        <view class="flex justify-between items-center mt-3 px-2">
          <view>
            <text class="text-28rpx font-medium">{{ photoType.name }}</text>
            <text class="text-24rpx text-gray-500 block">{{ photoType.size }}</text>
          </view>
          <view>
            <text class="text-24rpx text-gray-500">{{ photoType.pixelWidth }}×{{ photoType.pixelHeight }}px</text>
          </view>
        </view>
      </view>

      <!-- 背景色设置 -->
      <view class="bg-white rounded-xl p-4 mb-4">
        <text class="text-28rpx font-medium mb-3 block">背景色设置</text>
        <view class="flex justify-between">
          <view
            v-for="(color, index) in backgroundColors"
            :key="index"
            class="color-option"
            :style="{ backgroundColor: color.value }"
            :class="{ 'color-selected': selectedBackgroundColor === color.value }"
            @tap="changeBackgroundColor(color.value)"></view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="grid grid-cols-2 gap-3 mb-4">
        <button
          class="bg-indigo-100 text-indigo-600 py-3 rounded-full text-32rpx flex items-center justify-center"
          @tap="downloadPhoto">
          <IconFont name="download" class="mr-2" />
          下载电子照
        </button>
        <button
          class="bg-indigo-500 text-white py-3 rounded-full text-32rpx flex items-center justify-center"
          @tap="mockPrintOrder">
          <IconFont name="print" class="mr-2" />
          冲印照片
        </button>
      </view>

      <!-- 提示文本 -->
      <view class="bg-yellow-50 p-3 rounded-xl">
        <view class="flex items-start">
          <IconFont name="info-circle" class="text-yellow-500 mt-1 mr-2" />
          <text class="text-24rpx text-gray-700 leading-1.4">
            照片已自动处理完成，您可以选择背景颜色，下载或冲印照片。下载后的照片可用于各类电子证件提交。
          </text>
        </view>
      </view>
    </view>

    <!-- 加载中/错误提示 -->
    <view v-else class="flex flex-col items-center justify-center h-full">
      <IconFont name="spinner" class="text-gray-400 text-60rpx animate-spin mb-4" />
      <text class="text-28rpx text-gray-500">正在处理照片...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useConfigStore } from "@/store/modules/config";
import { usePhotoProcessor } from "@/hooks/usePhotoProcessor";
import { useHistoryStore } from "@/store/modules/history";
import { useToast } from "@/hooks/useToast";
import { PhotoType } from "@/enums/PhotoType";

const configStore = useConfigStore();
const historyStore = useHistoryStore();
const { processPhoto } = usePhotoProcessor();
const { showToast, showLoading, hideLoading } = useToast();

// 页面状态
const photoTypeId = ref<string>("");
const rawImgPath = ref<string>("");
const imgPath = ref<string>("");
const photoType = ref<PhotoType | null>(null);
const previewMode = ref<"single" | "layout">("single"); // single 或 layout
const backgroundColors = ref<Array<{ name: string; value: string }>>(configStore.backgroundColors);
const selectedBackgroundColor = ref<string>("#2196F3"); // 默认蓝色背景

// 照片下载计数器，每日限制
const getDownloadCount = () => {
  const today = new Date().toISOString().split("T")[0];
  const countData = uni.getStorageSync("download_count") || "{}";
  const countObj = JSON.parse(countData);
  return countObj[today] || 0;
};

const incrementDownloadCount = () => {
  const today = new Date().toISOString().split("T")[0];
  const countData = uni.getStorageSync("download_count") || "{}";
  const countObj = JSON.parse(countData);
  countObj[today] = (countObj[today] || 0) + 1;
  uni.setStorageSync("download_count", JSON.stringify(countObj));
};

// 更换背景色
const changeBackgroundColor = async (color: string) => {
  if (selectedBackgroundColor.value === color) return;

  showLoading("更换背景色中...");
  selectedBackgroundColor.value = color;

  try {
    // 模拟背景色更换操作
    await new Promise((resolve) => setTimeout(resolve, 800));
    hideLoading();
    showToast("背景色更换成功");
  } catch (error: any) {
    hideLoading();
    showToast("背景色更换失败");
    console.log(error.message);
  }
};

// 下载照片
const downloadPhoto = () => {
  const downloadCount = getDownloadCount();

  if (downloadCount >= 5) {
    showToast("今日下载次数已达上限（5次）");
    return;
  }

  showLoading("正在下载...");

  // 模拟下载操作
  setTimeout(() => {
    hideLoading();
    incrementDownloadCount();

    // 保存到历史记录
    saveToHistory();

    showToast("下载成功");
  }, 1000);
};

// 模拟冲印订单
const mockPrintOrder = () => {
  showToast("冲印功能开发中，敬请期待");
};

// 保存到历史记录
const saveToHistory = () => {
  if (!photoType.value || !imgPath.value) return;

  historyStore.savePhotoRecord({
    photoUrl: imgPath.value,
    thumbnailUrl: imgPath.value,
    typeId: photoType.value.id,
    typeName: photoType.value.name,
    size: photoType.value.size,
    backgroundColor: selectedBackgroundColor.value,
  });
};

// 处理照片
const handleProcessPhoto = async () => {
  if (!photoType.value || !rawImgPath.value) return;

  showLoading("正在处理照片...");

  try {
    const result = await processPhoto(rawImgPath.value, {
      backgroundColor: selectedBackgroundColor.value,
      photoType: photoType.value,
    });

    imgPath.value = result.photoUrl;
    hideLoading();
  } catch (error) {
    hideLoading();
    showToast("照片处理失败");
    console.error("照片处理失败", error);
  }
};

// 逻辑函数：处理照片类型
const handlePhotoType = (photoTypeId: string) => {
  const photoType = configStore.getPhotoTypeById(photoTypeId);
  if (!photoType) {
    showToast("未找到对应照片类型");
    throw new Error("PhotoType not found");
  }
  return photoType;
};

// 逻辑函数：设置背景色
const setDefaultBackground = (photoType: PhotoType) => {
  if (photoType.backgroundColor) {
    const color = backgroundColors.value.find((c) => c.name.includes(photoType.backgroundColor!));
    selectedBackgroundColor.value = color?.value || "#FFFFFF"; // 提供默认值
  }
};

onLoad((options: any) => {
  // 获取路由参数
  photoTypeId.value = options.id || "";
  rawImgPath.value = decodeURIComponent(options.imgPath || "");

  if (photoTypeId.value) {
    photoType.value = handlePhotoType(photoTypeId.value);

    // 设置默认背景色
    setDefaultBackground(photoType.value);

    // 处理照片
    handleProcessPhoto();
  } else {
    showToast("参数错误");
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
});
</script>

<style lang="scss" scoped>
.result-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.status-bar {
  height: 88rpx;
  background-color: #f7f7f7;
  position: relative;
  z-index: 10;
}

.photo-preview {
  position: relative;
  height: 600rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
  border-radius: 12rpx;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.watermark {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24rpx;
  transform: rotate(-45deg);
  opacity: 0.7;
}

.layout-preview {
  height: 600rpx;
  background-color: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12rpx;
  overflow: hidden;
}

.layout-image {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.color-option {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  transition: all 0.3s ease;
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
