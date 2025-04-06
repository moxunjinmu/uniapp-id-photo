<template>
  <!-- 内容区域 -->
  <view class="px-4 pt-8 pb-20 overflow-auto h-full">
    <!-- 图片展示卡片 -->
    <view class="image-card login-card mb-6">
      <view id="dynamic-bg" class="w-full aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden"></view>
    </view>

    <view class="login-card p-6">
      <view class="text-xl font-bold mb-6">手机号登录</view>

      <!-- 手机号输入 -->
      <view class="mb-4">
        <view class="input-field flex items-center">
          <IconFont name="mobile-alt" class="text-gray-400 mr-2" />
          <input
            v-model="phone"
            type="text"
            placeholder="请输入手机号"
            class="w-full bg-transparent focus:outline-none"
            maxlength="11"
            pattern="[0-9]*"
            inputmode="numeric" />
        </view>
      </view>

      <!-- 验证码输入 -->
      <view class="mb-6">
        <view class="flex gap-2">
          <view class="input-field flex-1 flex items-center">
            <IconFont name="sms" class="text-gray-400 mr-2" />
            <input
              v-model="smsCode"
              type="text"
              placeholder="验证码"
              class="w-full bg-transparent focus:outline-none"
              maxlength="6"
              pattern="[0-9]*"
              inputmode="numeric" />
          </view>
          <button class="countdown-btn text-sm font-medium" :disabled="isCounting" @click="getSmsCode">
            {{ countdownText }}
          </button>
        </view>
      </view>

      <!-- 登录按钮 -->
      <button
        class="w-full bg-indigo-500 text-white rounded-full py-3 font-medium hover:bg-indigo-600 active:scale-95 transition-all duration-200"
        @click="handleLogin">
        立即登录
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user";
import IconFont from "@/components/IconFont.vue";
import { onUnmounted, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

// 登录表单
const phone = ref("");
const smsCode = ref("");

// 验证码倒计时
const isCounting = ref(false);
const countdown = ref(60);
const countdownText = ref("获取验证码");
let timer: number | null = null;

// 使用 pinia
const userStore = useUserStore();

// 获取验证码
const getSmsCode = () => {
  // 验证手机号
  if (!phone.value || !/^1\d{10}$/.test(phone.value)) {
    uni.showToast({ title: "请输入正确的手机号", icon: "none" });
    return;
  }

  // 模拟发送验证码
  uni.showLoading({ title: "发送中" });

  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: "验证码已发送", icon: "success" });

    // 开始倒计时
    startCountdown();
  }, 1000);

  // TODO: 实际项目中应调用后端API发送验证码
  // const res = await AuthAPI.sendSmsCode(phone.value);
};

// 开始倒计时
const startCountdown = () => {
  isCounting.value = true;
  countdown.value = 60;
  countdownText.value = `${countdown.value}秒`;

  timer = setInterval(() => {
    countdown.value--;
    countdownText.value = `${countdown.value}秒`;

    if (countdown.value <= 0) {
      clearInterval(timer as number);
      isCounting.value = false;
      countdownText.value = "获取验证码";
    }
  }, 1000) as unknown as number;
};

// 登录处理
const handleLogin = async () => {
  // 表单验证
  if (!phone.value || !/^1\d{10}$/.test(phone.value)) {
    uni.showToast({ title: "请输入正确的手机号", icon: "none" });
    return;
  }

  if (!smsCode.value || smsCode.value.length !== 6) {
    uni.showToast({ title: "请输入6位验证码", icon: "none" });
    return;
  }

  // 显示加载中
  uni.showLoading({ title: "登录中" });

  try {
    // TODO: 实际项目中应调用手机号登录API
    // 这里暂时使用用户名密码登录API模拟
    await userStore.login("admin", "123456");

    if (userStore.token) {
      await userStore.getUserInfo(); // 登录成功后获取用户信息
      uni.hideLoading();
      uni.showToast({ title: "登录成功", icon: "success" });
      uni.navigateBack(); // 登录成功后返回上一页
    } else {
      uni.hideLoading();
      uni.showToast({ title: "登录失败", icon: "none" });
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: "登录失败，请稍后重试", icon: "none" });
    console.error(error);
  }
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

// 加载背景图
onLoad(() => {
  const bgContainer = document.getElementById("dynamic-bg");
  if (bgContainer) {
    const width = Math.floor(bgContainer.clientWidth * 2);
    const height = Math.floor((width * 9) / 16);
    bgContainer.style.backgroundImage = `url(https://picsum.photos/${width}/${height})`;
    bgContainer.style.backgroundSize = "cover";
    bgContainer.style.backgroundPosition = "center";
  }
});
</script>

<style scoped>
.status-bar {
  height: 44px;
  background-color: #f7f7f7;
  position: relative;
  z-index: 10;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-field {
  background: #f0f0f0;
  border-radius: 9999px;
  padding: 12px 20px;
}

.countdown-btn {
  background: #e0e7ff;
  color: #6366f1;
  border-radius: 9999px;
  padding: 8px 16px;
}

.countdown-btn[disabled] {
  background: #e5e7eb;
  color: #9ca3af;
}

.image-card {
  position: relative;
}

#dynamic-bg {
  transition: opacity 0.3s ease;
}

/* 移除输入框的默认样式 */
input {
  outline: none;
}

/* 移除数字输入框的上下箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
