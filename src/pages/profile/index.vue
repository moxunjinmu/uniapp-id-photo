<template>
  <view class="profile-container pb-20 overflow-auto h-full">
    <!-- 顶部用户信息 -->
    <view class="user-info-section bg-white py-6 px-4 mb-4">
      <view class="flex items-center">
        <image class="avatar" :src="userInfo.avatarUrl || '/static/default-avatar.png'" @tap="handleLogin" />
        <view class="ml-4 flex-1">
          <view v-if="isLoggedIn">
            <text class="text-32rpx font-medium block mb-1">{{ userInfo.nickName || "游客" }}</text>
            <text class="text-24rpx text-gray-500">{{ userInfo.signature || "这个人很懒，还没有设置个性签名" }}</text>
          </view>
          <view v-else class="flex items-center" @tap="handleLogin">
            <text class="text-32rpx font-medium">点击登录</text>
            <IconFont name="chevron-right" class="text-gray-400 ml-1" />
          </view>
        </view>
      </view>
    </view>

    <!-- 常用功能 -->
    <view class="bg-white rounded-xl mb-4">
      <view class="px-4 py-3 border-b border-gray-100">
        <text class="text-30rpx font-medium">常用功能</text>
      </view>

      <view class="menu-item" @tap="mockFeature('我的订单')">
        <view class="flex items-center">
          <view class="menu-icon bg-blue-50">
            <IconFont name="shopping-bag" class="text-blue-500" />
          </view>
          <text class="ml-3">我的订单</text>
        </view>
        <IconFont name="chevron-right" class="text-gray-300" />
      </view>

      <view class="menu-item" @tap="handleFAQ">
        <view class="flex items-center">
          <view class="menu-icon bg-green-50">
            <IconFont name="question-circle" class="text-green-500" />
          </view>
          <text class="ml-3">常见问题</text>
        </view>
        <IconFont name="chevron-right" class="text-gray-300" />
      </view>

      <view class="menu-item" @tap="handleFollowAccount">
        <view class="flex items-center">
          <view class="menu-icon bg-purple-50">
            <IconFont name="qrcode" class="text-purple-500" />
          </view>
          <text class="ml-3">关注公众号</text>
        </view>
        <IconFont name="chevron-right" class="text-gray-300" />
      </view>
    </view>

    <!-- 关于我们 -->
    <view class="bg-white rounded-xl mb-4">
      <view class="px-4 py-3 border-b border-gray-100">
        <text class="text-30rpx font-medium">关于我们</text>
      </view>

      <view class="menu-item" @tap="mockFeature('关于产品')">
        <view class="flex items-center">
          <view class="menu-icon bg-amber-50">
            <IconFont name="info-circle" class="text-amber-500" />
          </view>
          <text class="ml-3">关于产品</text>
        </view>
        <IconFont name="chevron-right" class="text-gray-300" />
      </view>

      <view class="menu-item" @tap="mockFeature('用户协议')">
        <view class="flex items-center">
          <view class="menu-icon bg-gray-50">
            <IconFont name="file-alt" class="text-gray-500" />
          </view>
          <text class="ml-3">用户协议</text>
        </view>
        <IconFont name="chevron-right" class="text-gray-300" />
      </view>

      <view class="menu-item" @tap="mockFeature('隐私政策')">
        <view class="flex items-center">
          <view class="menu-icon bg-red-50">
            <IconFont name="shield-alt" class="text-red-500" />
          </view>
          <text class="ml-3">隐私政策</text>
        </view>
        <IconFont name="chevron-right" class="text-gray-300" />
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text class="text-24rpx text-gray-400">证件照小助手 v1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/store/modules/user";
import { useToast } from "@/hooks/useToast";

const userStore = useUserStore();
const { showToast } = useToast();

// 用户信息
const userInfo = ref({
  avatarUrl: "",
  nickName: "",
  signature: "",
});

// 登录状态
const isLoggedIn = computed(() => !!userStore.token);

// 登录
const handleLogin = () => {
  if (isLoggedIn.value) return;

  uni.navigateTo({
    url: "/pages/login/index",
  });
};

// 常见问题
const handleFAQ = () => {
  uni.navigateTo({
    url: "/pages/faq/index",
  });
};

// 关注公众号
const handleFollowAccount = () => {
  // 模拟公众号二维码
  const qrCodeUrl = "https://example.com/qrcode.jpg";

  uni.previewImage({
    urls: [qrCodeUrl],
    current: qrCodeUrl,
  });
};

// 模拟功能
const mockFeature = (name: string) => {
  showToast(`${name}功能开发中，敬请期待`);
};
</script>

<style lang="scss" scoped>
.profile-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.user-info-section {
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #f0f0f0;
}

.menu-item {
  padding: 24rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.version-info {
  text-align: center;
  padding: 30rpx;
}
</style>
