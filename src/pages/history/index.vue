<template>
  <view class="history-container pb-20 overflow-auto h-full">
    <!-- 顶部标题 -->
    <view class="status-bar flex items-center justify-between px-4 py-3">
      <text class="text-32rpx font-medium">历史记录</text>
      <view v-if="photoRecords.length > 0" @tap="handleClearAll" class="text-26rpx text-gray-500">清空</view>
    </view>

    <!-- 历史记录列表 -->
    <view v-if="photoRecords.length > 0" class="px-4">
      <view class="text-24rpx text-gray-500 mb-3 bg-yellow-200 rounded-md p-2">照片将自动保存7天，过期后自动删除</view>

      <view class="grid grid-cols-1 gap-3">
        <view v-for="record in photoRecords" :key="record.id" class="photo-record-card">
          <view class="flex relative">
            <!-- 左侧缩略图 -->
            <view class="thumbnail-container mr-3">
              <image :src="record.thumbnailUrl" mode="aspectFill" class="thumbnail" />
            </view>

            <!-- 右侧信息 -->
            <view class="flex-1">
              <view class="flex items-center justify-between">
                <text class="text-30rpx font-medium">{{ record.typeName }}</text>
                <view class="delete-btn" @tap.stop="handleDelete(record.id)">
                  <IconFont name="trash" class="text-gray-400" />
                </view>
              </view>

              <text class="text-26rpx text-gray-600 block mt-1">{{ record.size }}</text>

              <view class="flex justify-between items-center mt-2">
                <text class="text-24rpx text-gray-500">{{ formatDate(record.createTime) }}</text>
                <view class="bg-indigo-500 text-white text-24rpx px-3 py-1 rounded-full" @tap="handleViewPhoto(record)">
                  查看
                </view>
              </view>

              <!-- 倒计时 -->
              <view class="bg-gray-100 rounded-full h-8rpx mt-2 overflow-hidden">
                <view
                  class="bg-indigo-500 h-full"
                  :style="{ width: getExpirationProgress(record.createTime, record.expireTime) + '%' }"></view>
              </view>
              <text class="text-22rpx text-gray-400 mt-1">剩余{{ getRemainingDays(record.expireTime) }}天过期</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <view class="empty-icon">
        <IconFont name="history" class="text-indigo-500" size="64rpx" />
      </view>
      <text class="text-36rpx font-bold text-gray-800 mb-2">暂无照片</text>
      <text class="text-30rpx text-gray-500 mb-6">您拍摄的照片将会在这里显示7天</text>
      <view class="bg-indigo-500 text-white px-6 py-2 rounded-full text-30rpx font-medium" @tap="goToCamera">
        立即拍摄
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { useHistoryStore } from "@/store/modules/history";
import { useToast } from "@/hooks/useToast";

const historyStore = useHistoryStore();
const { showToast } = useToast();

// 获取历史记录
const photoRecords = computed(() => historyStore.photoRecords);

// 格式化日期
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
};

// 补零
const padZero = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

// 计算剩余天数
const getRemainingDays = (expireTime: number) => {
  const now = Date.now();
  const remainingMs = expireTime - now;
  const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  return Math.max(0, remainingDays);
};

// 获取过期进度
const getExpirationProgress = (createTime: number, expireTime: number) => {
  const now = Date.now();
  const totalDuration = expireTime - createTime;
  const elapsedDuration = now - createTime;
  const progress = 100 - (elapsedDuration / totalDuration) * 100;
  return Math.min(100, Math.max(0, progress));
};

// 删除单条记录
const handleDelete = (id: string) => {
  uni.showModal({
    title: "确认删除",
    content: "确定要删除这条历史记录吗？",
    success: (res) => {
      if (res.confirm) {
        historyStore.deletePhotoRecord(id);
        showToast("删除成功");
      }
    },
  });
};

// 清空所有记录
const handleClearAll = () => {
  if (photoRecords.value.length === 0) return;

  uni.showModal({
    title: "确认清空",
    content: "确定要清空所有历史记录吗？",
    success: (res) => {
      if (res.confirm) {
        photoRecords.value.forEach((record) => {
          historyStore.deletePhotoRecord(record.id);
        });
        showToast("已清空所有记录");
      }
    },
  });
};

// 查看照片
const handleViewPhoto = (record: any) => {
  uni.previewImage({
    urls: [record.photoUrl],
    current: record.photoUrl,
  });
};

// 跳转到拍照页面
const goToCamera = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};

// 页面加载时初始化历史记录
onLoad(() => {
  historyStore.initHistory();
});

// 每次显示页面时清理过期记录
onShow(() => {
  historyStore.clearExpiredRecords();
});
</script>

<style lang="scss" scoped>
.history-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.status-bar {
  height: 88rpx;
  background-color: #f7f7f7;
  position: relative;
  z-index: 10;
}

.photo-record-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.thumbnail-container {
  width: 140rpx;
  height: 180rpx;
  border-radius: 10rpx;
  overflow: hidden;
  background-color: #f0f0f0;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  padding: 10rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  text-align: center;
  height: 60vh;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  background-color: #e0e7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  color: #6366f1;
  font-size: 64rpx;
}
</style>
