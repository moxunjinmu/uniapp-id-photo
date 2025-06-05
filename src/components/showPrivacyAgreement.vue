<template>
  <!-- 遮罩层 -->
  <view v-if="isVisible" class="privacy-mask" @tap="handleMaskClick">
    <!-- 弹窗内容 -->
    <view class="privacy-popup" @tap.stop>
      <view class="title">
        <view class="title-circle"></view>
        <view>证件照莫循版</view>
      </view>
      <view class="content-privacy">
        <text>在你使用【证件照莫循版】服务之前，请仔细阅读</text>
        <text class="privacy-link" @click="goToPrivacy">《证件照莫循版隐私保护指引》</text>
        。
        <text>如你同意证件照莫循版隐私保护指引，请点击"同意"开始使用【证件照莫循版】。</text>
      </view>
      <view class="privacy-buttons">
        <button class="refuse-btn" @click="handleRefusePrivacy">拒绝</button>
        <!-- 微信小程序环境使用特殊的隐私授权按钮 -->
        <!-- #ifdef MP-WEIXIN -->
        <button
          class="agree-btn"
          id="agree-btn"
          open-type="agreePrivacyAuthorization"
          @agreeprivacyauthorization="handleAgreePrivacyAuthorization"
          @click="handleAgreeClick">
          同意
        </button>
        <!-- #endif -->
        <!-- 非微信小程序环境使用普通按钮 -->
        <!-- #ifndef MP-WEIXIN -->
        <button class="agree-btn" id="agree-btn" @click="handleAgreeClick">同意</button>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePrivacyStore } from "@/store/modules/privacy";
import { useToast } from "@/hooks/useToast";

// 声明微信小程序API类型
declare const wx: {
  openPrivacyContract: (options: { success?: () => void; fail?: () => void }) => void;
  requirePrivacyAuthorize: (options: {
    privacyList: string[];
    success?: () => void;
    fail?: (res: any) => void;
  }) => void;
};

interface PrivacyResult {
  event: "agree" | "disagree";
  buttonId?: string;
}

// 弹窗显示状态
const isVisible = ref(false);

// 状态管理
const privacyStore = usePrivacyStore();
const { showToast } = useToast();

// 内部状态
let resolvePrivacyAuthorization: ((result: PrivacyResult) => void) | null = null;

// 初始化弹窗
const init = (resolve: (result: PrivacyResult) => void) => {
  console.log("隐私弹窗初始化");
  resolvePrivacyAuthorization = resolve;
  isVisible.value = true;
};

// 关闭弹窗
const closePopup = () => {
  console.log("关闭隐私弹窗");
  isVisible.value = false;
};

// 遮罩点击处理（不允许点击遮罩关闭）
const handleMaskClick = () => {
  console.log("点击了遮罩层");
  // 不做任何操作，防止点击遮罩关闭弹窗
};

// 打开隐私协议
const goToPrivacy = () => {
  // #ifdef MP-WEIXIN
  if (typeof wx !== "undefined" && wx.openPrivacyContract) {
    wx.openPrivacyContract({
      success: () => {
        console.log("隐私协议打开成功");
      },
      fail: () => {
        showToast("打开失败，稍后重试");
      },
    });
  } else {
    showToast("请在微信小程序中查看隐私协议");
  }
  // #endif

  // #ifndef MP-WEIXIN
  showToast("请在微信小程序中查看隐私协议");
  // #endif
};

// 拒绝隐私协议
const handleRefusePrivacy = () => {
  console.log("用户拒绝隐私协议");
  closePopup();
  privacyStore.setPrivacyAgreement(false);

  if (resolvePrivacyAuthorization) {
    resolvePrivacyAuthorization({ event: "disagree" });
  }
};

// 微信小程序隐私授权事件
const handleAgreePrivacyAuthorization = () => {
  console.log("微信隐私授权事件触发");
  handleAgreeAction();
};

// 普通点击事件处理
const handleAgreeClick = () => {
  console.log("用户点击同意按钮");

  // #ifdef MP-WEIXIN
  // 在微信小程序中，如果有隐私授权事件，优先使用授权事件
  // 这里添加一个短暂延时，让隐私授权事件有机会触发
  setTimeout(() => {
    if (isVisible.value) {
      console.log("隐私授权事件未触发，使用普通点击逻辑");
      handleAgreeAction();
    }
  }, 100);
  // #endif

  // #ifndef MP-WEIXIN
  // 非微信小程序环境直接处理
  handleAgreeAction();
  // #endif
};

// 统一的同意处理逻辑
const handleAgreeAction = () => {
  console.log("执行同意隐私协议逻辑");
  closePopup();
  privacyStore.setPrivacyAgreement(true);

  if (resolvePrivacyAuthorization) {
    resolvePrivacyAuthorization({
      buttonId: "agree-btn",
      event: "agree",
    });
  }
};

// 暴露给父组件的方法
defineExpose({
  init,
});
</script>

<style lang="scss" scoped>
.privacy-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.privacy-popup {
  width: 520rpx;
  background-color: #fff;
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  margin: 0 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 20rpx 0;
  font-size: 38rpx;
  font-weight: 600;
}

.title-circle {
  width: 60rpx;
  height: 60rpx;
  background-color: #efefef;
  border-radius: 50%;
  margin-right: 20rpx;
}

.content-privacy {
  width: 480rpx;
  margin: 0 auto;
  font-size: 34rpx;
  line-height: 1.5;
}

.privacy-link {
  color: #1793ee;
}

.privacy-buttons {
  width: 100%;
  height: 158rpx;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.refuse-btn,
.agree-btn {
  width: 200rpx;
  height: 90rpx;
  border-radius: 20rpx;
  font-size: 34rpx;
  border: none;
}

.refuse-btn {
  background-color: #eee;
  color: #52bf6b;
}

.agree-btn {
  background-color: #52bf6b;
  color: #fff;
}
</style>
