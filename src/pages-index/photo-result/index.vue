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
          @tap="handleDownload">
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
          <text class="text-24rpx text-gray-700 leading-relaxed">
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
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { useConfigStore } from "@/store/modules/config";
import { usePhotoStore } from "@/store/modules/photo";
import { useHistoryStore } from "@/store/modules/history"; // 新增导入
import { usePhotoProcessor } from "@/hooks/usePhotoProcessor";
import { useToast } from "@/hooks/useToast";
import { PhotoType, PreviewMode } from "@/enums/PhotoType";
import { saveImageToPhotosAlbum } from "@/utils/file";
import { useImageBackground } from "@/hooks/useImageBackground";

const configStore = useConfigStore();
const photoStore = usePhotoStore();
const historyStore = useHistoryStore(); // 新增获取 store 实例
const { processPhoto, generatePhotoLayout } = usePhotoProcessor();
const { showToast, showLoading, hideLoading } = useToast();
const { changeBackground, clearImageCache } = useImageBackground();

// 页面状态
const photoType = ref<PhotoType | null>(null);
const rawImgPath = computed(() => photoStore.photoState.sourceImagePath);
const transparentImgPath = computed(() => photoStore.photoState.processedImagePath || "");
const coloredImgPath = computed(() => photoStore.photoState.coloredImagePath || "");
const imgPath = ref<string>(coloredImgPath.value || transparentImgPath.value || "");
const previewMode = ref<PreviewMode>(
  photoStore.photoState.previewMode === "layout" ? PreviewMode.Layout : PreviewMode.Single,
);
const backgroundColors = ref<Array<{ name: string; value: string }>>(configStore.backgroundColors);
const selectedBackgroundColor = ref<string>(photoStore.photoState.backgroundColor);
const layoutImagePath = ref<string>(photoStore.photoState.layoutImagePath || "");

// 新增：保存到历史记录的辅助函数
const saveCurrentPhotoToHistory = () => {
  if (photoType.value && imgPath.value) {
    console.log("准备保存历史记录", {
      photoType: photoType.value,
      imgPath: imgPath.value,
      bgColor: selectedBackgroundColor.value,
    });
    try {
      historyStore.savePhotoRecord({
        photoUrl: imgPath.value, // 使用当前显示的图片路径
        thumbnailUrl: imgPath.value, // 暂时使用相同路径作为缩略图
        typeId: photoType.value.id,
        typeName: photoType.value.name,
        size: photoType.value.size,
        backgroundColor: selectedBackgroundColor.value,
      });
      console.log("历史记录保存成功");
    } catch (error) {
      console.error("保存历史记录失败:", error);
      // 这里可以选择是否提示用户保存失败
    }
  } else {
    console.warn("无法保存历史记录：缺少照片类型或图片路径");
  }
};

// 修改changeBackgroundColor函数，使用缓存的图片
const changeBackgroundColor = async (color: string) => {
  if (color === selectedBackgroundColor.value || !transparentImgPath.value) return;

  try {
    console.log("开始更换背景色", color);
    showLoading("更换背景色中...");

    // 使用透明背景图片作为基础图片
    const newImagePath = await changeBackground(transparentImgPath.value, {
      backgroundColor: color,
    });

    // 更新图片路径
    imgPath.value = newImagePath;

    // 保存带背景色的图片路径到store
    photoStore.setColoredImage(newImagePath);

    // 更新背景色
    selectedBackgroundColor.value = color;
    photoStore.setBackgroundColor(color);

    // 如果当前是布局预览模式，也更新布局图片
    if (previewMode.value === PreviewMode.Layout && layoutImagePath.value) {
      layoutImagePath.value = newImagePath;
    }

    hideLoading();
    showToast("背景色更换成功");
    saveCurrentPhotoToHistory(); // 新增：更换背景色后保存
  } catch (error) {
    console.error("更换背景色失败:", error);
    hideLoading();
    showToast("更换背景色失败，请重试");
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

// 下载图片
const handleDownload = async () => {
  try {
    // 获取当前显示的图片路径
    const currentImagePath = imgPath.value;
    if (!currentImagePath) {
      uni.showToast({
        title: "没有可下载的图片",
        icon: "none",
      });
      return;
    }

    // 生成文件名
    const fileName = `photo_${Date.now()}.png`;
    console.log("当前图片路径", currentImagePath);

    // 保存到相册
    await saveImageToPhotosAlbum(currentImagePath, fileName);

    uni.showToast({
      title: "下载成功",
      icon: "success",
    });
  } catch (error) {
    console.error("下载失败:", error);
    uni.showToast({
      title: "下载失败",
      icon: "none",
    });
  }
};

// 模拟冲印订单
const mockPrintOrder = () => {
  showToast("冲印功能开发中，敬请期待");
};

// 处理照片
const handleProcessPhoto = async () => {
  if (!photoType.value || !rawImgPath.value) return;

  showLoading("正在处理照片...");

  try {
    // 使用透明背景色处理照片
    const result = await processPhoto(rawImgPath.value, {
      backgroundColor: photoStore.photoState.transparentBackgroundColor,
      photoType: photoType.value,
    });

    console.log("照片处理结果：", result);

    // 保存透明背景图片
    photoStore.setProcessedImage(result.thumbnailUrl);

    // 如果用户选择的背景色不是透明色，则在前端处理背景色
    if (selectedBackgroundColor.value !== photoStore.photoState.transparentBackgroundColor) {
      console.log("在前端处理背景色", selectedBackgroundColor.value);
      const newImagePath = await changeBackground(result.thumbnailUrl, {
        backgroundColor: selectedBackgroundColor.value,
      });

      // 保存带背景色的图片
      photoStore.setColoredImage(newImagePath);
      imgPath.value = newImagePath;
    } else {
      // 如果用户选择的是透明背景色，则直接使用透明背景图片
      imgPath.value = result.thumbnailUrl;
    }

    // 根据预览模式决定是否需要创建排版
    if (previewMode.value === PreviewMode.Layout) {
      layoutImagePath.value = await generatePhotoLayout(imgPath.value, 4);
      // 更新store中的排版图片
      photoStore.setLayoutImage(layoutImagePath.value);
    }
    console.log("排版图片路径：", layoutImagePath.value);
    hideLoading();
    saveCurrentPhotoToHistory(); // 新增：处理照片成功后保存
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
        let imageLoaded = false; // Flag to track if image is loaded

        // Check if processed image exists (either colored or transparent)
        if (photoStore.photoState.coloredImagePath) {
          imgPath.value = photoStore.photoState.coloredImagePath;
          imageLoaded = true;
        } else if (photoStore.photoState.processedImagePath) {
          imgPath.value = photoStore.photoState.processedImagePath;
          imageLoaded = true;
        }

        // If image loaded from cache, save history
        if (imageLoaded) {
          // Check if layout image exists
          if (photoStore.photoState.layoutImagePath) {
            layoutImagePath.value = photoStore.photoState.layoutImagePath;
          }
          saveCurrentPhotoToHistory(); // Save history after loading from cache
        } else {
          // If no cached image, process the photo
          handleProcessPhoto(); // This function already saves history on success
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

// 在onUnload中清除缓存
onUnload(() => {
  console.log("页面卸载，清除图片缓存");
  clearImageCache();
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
