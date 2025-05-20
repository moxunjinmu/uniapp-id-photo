<template>
  <view class="search-container pb-20 overflow-auto h-full">
    <!-- 搜索区域 -->
    <view class="px-4 py-3 bg-white sticky top-0 z-10">
      <view class="flex items-center bg-gray-100 rounded-full px-4 py-2">
        <IcomoonFont name="search" class="text-gray-400 mr-2" />
        <input
          class="flex-1 text-28rpx bg-transparent"
          type="text"
          v-model="searchKeyword"
          placeholder="搜索证件照尺寸..."
          confirm-type="search"
          @input="onSearch"
          @confirm="onSearch" />
        <view v-if="searchKeyword" class="p-1" @tap="clearSearch">
          <IcomoonFont name="times-circle" class="text-gray-400" />
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="p-4">
      <view v-if="searchResults.length === 0" class="flex flex-col items-center justify-center py-10">
        <IcomoonFont name="search" size="80rpx" class="text-gray-300 mb-3" />
        <text class="text-28rpx text-gray-500">未找到相关证件照</text>
      </view>

      <view v-else class="grid grid-cols-1 gap-3">
        <view
          v-for="item in searchResults"
          :key="item.id"
          class="bg-white rounded-xl p-4 shadow-sm card-zoom"
          @tap="navigateToDetail(item.id)">
          <view class="flex items-center">
            <view
              :class="`bg-${item.backgroundColor}-100 w-100rpx h-100rpx rounded-lg flex items-center justify-center mr-4`">
              <IcomoonFont :name="item.icon" :class="`text-${item.backgroundColor}-500 text-40rpx`" />
            </view>
            <view class="flex-1">
              <view class="flex items-center">
                <text class="font-medium text-32rpx">{{ item.name }}</text>
                <text
                  v-if="item.isPopular"
                  :class="`ml-2 bg-${item.backgroundColor}-50 text-${item.backgroundColor}-500 px-2 py-0.5 rounded-full text-24rpx`">
                  热门
                </text>
              </view>
              <text class="text-26rpx text-gray-500 block mt-1">{{ item.size }}</text>
              <text class="text-24rpx text-gray-400 block mt-1">{{ item.description }}</text>
            </view>
            <IcomoonFont name="chevron-right" class="text-gray-300" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useConfigStore } from "@/store/modules/config";

const configStore = useConfigStore();
const searchKeyword = ref("");
const searchResults = ref(configStore.photoTypes);

// 搜索功能
const onSearch = () => {
  if (searchKeyword.value.trim()) {
    searchResults.value = configStore.searchPhotoTypes(searchKeyword.value);
  } else {
    searchResults.value = configStore.photoTypes;
  }
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = "";
  onSearch();
};

// 导航到详情页
const navigateToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages-index/detail/index?id=${id}`,
  });
};

// 初始加载默认显示所有类型
onLoad(() => {
  searchResults.value = configStore.photoTypes;
});
</script>

<style lang="scss" scoped>
.search-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.card-zoom {
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}
</style>
