<template>
  <view class="home-container pb-20 overflow-auto h-full">
    <!-- 内容区域 -->
    <view class="pb-120rpx">
      <!-- 顶部宣传 -->
      <view class="banner mx-4 my-3">
        <text class="text-36rpx font-bold mb-1 block">证件照工作室</text>
        <text class="text-28rpx opacity-90">一键生成各种规格证件照</text>
      </view>

      <!-- 搜索栏 -->
      <view class="mx-4 my-3 relative">
        <view class="bg-gray-100 rounded-full flex items-center px-4 py-2" @tap="navigateToSearch">
          <IconFont name="search" class="text-gray-400 mr-2" />
          <text class="text-28rpx text-gray-400">搜索证件照尺寸...</text>
        </view>
      </view>

      <!-- 功能区 -->
      <view class="mx-4 mt-4">
        <view class="flex">
          <!-- 左侧 - 拍摄证件照 -->
          <view class="w-1/2 pr-2">
            <view
              class="bg-indigo-50 rounded-xl p-4 h-320rpx flex flex-col justify-between card-zoom"
              @tap="navigateToSearch">
              <view>
                <view class="flex items-center mb-2">
                  <view class="bg-indigo-100 w-80rpx h-80rpx rounded-full flex items-center justify-center mr-2">
                    <IconFont name="camera" class="text-indigo-500" />
                  </view>
                  <text class="font-bold text-gray-800 text-32rpx">拍摄证件照</text>
                </view>
                <text class="text-24rpx text-gray-500 mt-1">一键生成标准证件照</text>
              </view>
              <!-- 功能图标预览 -->
              <view class="flex justify-between mt-2">
                <view class="text-24rpx text-indigo-500 font-medium flex items-center">
                  <text>点击开始</text>
                  <IconFont name="chevron-right" class="ml-1" />
                </view>
                <view class="flex space-x-1">
                  <view class="w-40rpx h-40rpx bg-indigo-100 rounded-full flex items-center justify-center">
                    <IconFont name="id-card" class="text-indigo-500 text-24rpx" />
                  </view>
                  <view class="w-40rpx h-40rpx bg-indigo-100 rounded-full flex items-center justify-center">
                    <IconFont name="user" class="text-indigo-500 text-24rpx" />
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 右侧 - 工具箱 -->
          <view class="w-1/2 pl-2">
            <view
              class="bg-purple-50 rounded-xl p-4 h-320rpx flex flex-col justify-between card-zoom"
              @tap="navigateToToolbox">
              <view>
                <view class="flex items-center mb-2">
                  <view class="bg-purple-100 w-80rpx h-80rpx rounded-full flex items-center justify-center mr-2">
                    <IconFont name="toolbox" class="text-purple-500" />
                  </view>
                  <text class="font-bold text-gray-800 text-32rpx">工具箱</text>
                </view>
                <text class="text-24rpx text-gray-500 mt-1">完美证件照所需的所有工具</text>
              </view>

              <!-- 工具图标预览 -->
              <view class="grid grid-cols-3 gap-1 mt-2">
                <view class="w-40rpx h-40rpx bg-purple-100 rounded-full flex items-center justify-center">
                  <IconFont name="image" class="text-purple-500 text-24rpx" />
                </view>
                <view class="w-40rpx h-40rpx bg-purple-100 rounded-full flex items-center justify-center">
                  <IconFont name="palette" class="text-purple-500 text-24rpx" />
                </view>
                <view class="w-40rpx h-40rpx bg-purple-100 rounded-full flex items-center justify-center">
                  <IconFont name="crop" class="text-purple-500 text-24rpx" />
                </view>
                <view class="w-40rpx h-40rpx bg-purple-100 rounded-full flex items-center justify-center">
                  <IconFont name="print" class="text-purple-500 text-24rpx" />
                </view>
                <view class="w-40rpx h-40rpx bg-purple-100 rounded-full flex items-center justify-center">
                  <IconFont name="ruler" class="text-purple-500 text-24rpx" />
                </view>
                <view class="w-40rpx h-40rpx bg-purple-100 rounded-full flex items-center justify-center">
                  <IconFont name="magic" class="text-purple-500 text-24rpx" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 热门尺寸 -->
      <view class="mx-4 mt-4">
        <text class="font-bold text-gray-800 text-32rpx mb-3 block">热门尺寸</text>
        <view class="grid grid-cols-2 gap-3">
          <view
            v-for="type in photoTypes"
            :key="type.id"
            class="bg-white rounded-xl p-3 shadow-sm card-zoom"
            @tap="navigateToDetail(type.id)">
            <view class="flex items-center">
              <view
                :class="`bg-${type.backgroundColor}-100 w-80rpx h-80rpx rounded-lg flex items-center justify-center mr-3`">
                <IconFont :name="type.icon" :class="`text-${type.backgroundColor}-500`" />
              </view>
              <view>
                <text class="font-medium text-28rpx">{{ type.name }}</text>
                <text class="text-24rpx text-gray-500 block">{{ type.size }}</text>
              </view>
            </view>
            <view class="text-24rpx text-gray-400 mt-2 flex justify-between items-center">
              <text>标准尺寸</text>
              <text
                v-if="type.isPopular"
                :class="`bg-${type.backgroundColor}-50 text-${type.backgroundColor}-500 px-2 py-0.5 rounded-full text-24rpx`">
                热门
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { useConfigStore } from "@/store/modules/config";
import { useHistoryStore } from "@/store/modules/history";

// 初始化stores
const configStore = useConfigStore();
const historyStore = useHistoryStore();
const photoTypes = computed(() => configStore.getPopularPhotoTypes);

// 初始化历史记录
onLoad(() => {
  historyStore.initHistory();
});

// 导航函数
const navigateToSearch = () => {
  uni.navigateTo({
    url: "/pages/search/index",
  });
};

const navigateToToolbox = () => {
  uni.switchTab({
    url: "/pages/toolbox/index",
  });
};

const navigateToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/detail/index?id=${id}`,
  });
};
</script>

<style lang="scss" scoped>
.home-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.status-bar {
  height: 88rpx;
  background-color: #f7f7f7;
  position: relative;
  z-index: 10;
}

.banner {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card-zoom {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
  }
}
</style>
