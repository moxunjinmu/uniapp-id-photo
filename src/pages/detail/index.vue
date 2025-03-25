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

        <!-- 参数信息 -->
        <view class="grid grid-cols-3 mx-4 bg-gray-50 rounded-xl p-4">
          <view class="flex flex-col items-center">
            <text class="text-24rpx text-gray-500 mb-1">像素尺寸</text>
            <text class="text-28rpx font-medium">{{ photoType.pixelWidth }}×{{ photoType.pixelHeight }}</text>
          </view>
          <view class="flex flex-col items-center border-l border-r border-gray-200">
            <text class="text-24rpx text-gray-500 mb-1">物理尺寸</text>
            <text class="text-28rpx font-medium">{{ photoType.width }}×{{ photoType.height }}mm</text>
          </view>
          <view class="flex flex-col items-center">
            <text class="text-24rpx text-gray-500 mb-1">分辨率</text>
            <text class="text-28rpx font-medium">300DPI</text>
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
import { ref, onMounted } from "vue";
import { useConfigStore } from "@/store/modules/config";
import { useCameraController } from "@/hooks/useCameraController";
import { useToast } from "@/hooks/useToast";
import { PhotoType } from "@/enums/PhotoType";
const configStore = useConfigStore();
const { chooseFromAlbum } = useCameraController();
const { showToast } = useToast();
// 获取照片类型ID
const photoTypeId = ref("");
const photoType = ref<PhotoType | null>(null);

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

onMounted(() => {
  // 获取路由参数
  const params = (this as any).$instance.router.params;
  photoTypeId.value = params.id;

  if (photoTypeId.value) {
    photoType.value = handlePhotoType(photoTypeId.value);
  } else {
    uni.showToast({
      title: "参数错误",
      icon: "none",
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
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

button {
  font-weight: normal;
  border: none;

  &::after {
    border: none;
  }
}
</style>
