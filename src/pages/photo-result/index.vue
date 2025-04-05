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
            :class="[previewMode === PreviewMode.Single ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600']"
            class="px-4 py-2 rounded-full text-26rpx transition-colors"
            @tap="togglePreviewMode(PreviewMode.Single)">
            单张预览
          </view>
          <view
            :class="[previewMode === PreviewMode.Layout ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600']"
            class="px-4 py-2 rounded-full text-26rpx transition-colors"
            @tap="togglePreviewMode(PreviewMode.Layout)">
            排版预览
          </view>
        </view>

        <!-- 单张预览 -->
        <view v-if="previewMode === PreviewMode.Single" class="photo-preview">
          <image :src="imgPath" mode="aspectFit" class="preview-image">
            <!-- 水印 -->
            <text class="watermark">证件照预览</text>
          </image>
        </view>

        <!-- 排版预览 -->
        <view v-else class="layout-preview">
          <image :src="layoutImagePath || imgPath" mode="aspectFit" class="layout-image"></image>
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
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useConfigStore } from "@/store/modules/config";
import { usePhotoStore } from "@/store/modules/photo";
import { usePhotoProcessor } from "@/hooks/usePhotoProcessor";
import { useHistoryStore } from "@/store/modules/history";
import { useToast } from "@/hooks/useToast";
import { PhotoType, PreviewMode } from "@/enums/PhotoType";
import { checkDailyDownloadLimit, incrementDownloadCount } from "@/api/image";

const configStore = useConfigStore();
const photoStore = usePhotoStore();
const historyStore = useHistoryStore();
const { processPhoto, changeBackgroundColor: changePhotoBackground, generatePhotoLayout } = usePhotoProcessor();
const { showToast, showLoading, hideLoading } = useToast();

// 页面状态
const photoType = ref<PhotoType | null>(null);
const rawImgPath = computed(() => photoStore.photoState.sourceImagePath);
const imgPath = ref<string>(photoStore.photoState.processedImagePath || "");
const previewMode = ref<PreviewMode>(
  photoStore.photoState.previewMode === "layout" ? PreviewMode.Layout : PreviewMode.Single,
);
const backgroundColors = ref<Array<{ name: string; value: string }>>(configStore.backgroundColors);
const selectedBackgroundColor = ref<string>(photoStore.photoState.backgroundColor);
const layoutImagePath = ref<string>(photoStore.photoState.layoutImagePath || "");

// 更换背景色
const changeBackgroundColor = async (color: string) => {
  if (selectedBackgroundColor.value === color || !imgPath.value) return;

  showLoading("更换背景色中...");

  try {
    const newImagePath = await changePhotoBackground(imgPath.value, color);
    imgPath.value = newImagePath;
    selectedBackgroundColor.value = color;

    // 更新store中的背景色和处理后的图片
    photoStore.setBackgroundColor(color);
    photoStore.setProcessedImage(newImagePath);

    // 如果当前是排版预览模式，也需要更新排版图片
    if (previewMode.value === PreviewMode.Layout) {
      const newLayoutPath = await generatePhotoLayout(newImagePath, 4);
      layoutImagePath.value = newLayoutPath;
      photoStore.setLayoutImage(newLayoutPath);
    }

    hideLoading();
    showToast("背景色更换成功");
  } catch (error: any) {
    hideLoading();
    showToast("背景色更换失败");
    console.error("背景色更换失败:", error.message);
  }
};

// 切换预览模式
const togglePreviewMode = async (mode: PreviewMode) => {
  if (previewMode.value === mode) return;

  previewMode.value = mode;
  // 更新store中的预览模式
  photoStore.setPreviewMode(mode === PreviewMode.Layout ? "layout" : "single");

  if (mode === PreviewMode.Layout && !layoutImagePath.value) {
    showLoading("生成排版预览中...");
    try {
      const layoutPath = await generatePhotoLayout(imgPath.value, 4);
      layoutImagePath.value = layoutPath;
      // 更新store中的排版图片
      photoStore.setLayoutImage(layoutPath);
      hideLoading();
    } catch (error) {
      hideLoading();
      showToast("生成排版预览失败");
      console.error("生成排版预览失败:", error);
    }
  }
};

// 下载照片
const downloadPhoto = async () => {
  // 检查下载限制
  const { canDownload } = checkDailyDownloadLimit();

  if (!canDownload) {
    showToast("今日下载次数已达上限，请明天再试");
    return;
  }

  showLoading("正在下载...");

  try {
    // 根据当前预览模式选择要下载的图片
    const downloadPath =
      previewMode.value === PreviewMode.Single ? imgPath.value : layoutImagePath.value || imgPath.value;

    // 保存图片到相册
    await uni.saveImageToPhotosAlbum({
      filePath: downloadPath,
    });

    // 增加下载计数
    const newCount = incrementDownloadCount();
    const remaining = 10 - newCount; // 假设每日限制10次

    // 保存到历史记录
    saveToHistory();

    hideLoading();
    showToast(`下载成功，今日剩余下载次数: ${remaining}`);
  } catch (error: any) {
    hideLoading();
    console.error("下载失败:", error);

    if (error.errMsg?.includes("auth deny")) {
      showToast("请授权保存图片到相册");
    } else {
      showToast("下载失败，请重试");
    }
  }
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

    console.log("照片处理结果：", result);
    imgPath.value = result.thumbnailUrl;
    // 更新store中的处理后图片
    photoStore.setProcessedImage(result.thumbnailUrl);

    // 根据预览模式决定是否需要创建排版
    if (previewMode.value === PreviewMode.Layout) {
      layoutImagePath.value = await generatePhotoLayout(result.photoUrl, 4);
      // 更新store中的排版图片
      photoStore.setLayoutImage(layoutImagePath.value);
    }
    console.log("排版图片路径：", layoutImagePath.value);
    hideLoading();
  } catch (error) {
    hideLoading();
    showToast("照片处理失败");
    console.error("照片处理失败", error);
  }
};

onLoad(() => {
  try {
    // 从store中获取照片类型ID和图片路径
    const photoTypeId = photoStore.photoState.photoTypeId;

    if (photoTypeId && rawImgPath.value) {
      // 获取照片类型
      photoType.value = configStore.getPhotoTypeById(photoTypeId) || null;

      if (photoType.value) {
        // 如果已经有处理好的图片，直接使用
        if (photoStore.photoState.processedImagePath) {
          imgPath.value = photoStore.photoState.processedImagePath;
        } else {
          // 处理照片
          handleProcessPhoto();
        }

        // 如果已经有排版图片，直接使用
        if (photoStore.photoState.layoutImagePath) {
          layoutImagePath.value = photoStore.photoState.layoutImagePath;
        }
      } else {
        showToast("未找到对应照片类型");
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    } else {
      showToast("参数错误，请重新选择照片");
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
  } catch (error) {
    console.error("加载照片结果页面失败:", error);
    showToast("加载失败，请重试");
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
