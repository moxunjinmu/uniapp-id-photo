import { defineStore } from "pinia";
import { ref } from "vue";

export const usePrivacyStore = defineStore("privacy", () => {
  // 用户是否已同意隐私协议
  const hasAgreedPrivacy = ref<boolean>(uni.getStorageSync("hasAgreedPrivacy") || false);

  // 设置隐私协议同意状态
  const setPrivacyAgreement = (agreed: boolean) => {
    hasAgreedPrivacy.value = agreed;
    uni.setStorageSync("hasAgreedPrivacy", agreed);
  };

  // 检查是否需要显示隐私弹窗
  const needShowPrivacyDialog = () => {
    return !hasAgreedPrivacy.value;
  };

  // 重置隐私状态（用于测试或用户主动重置）
  const resetPrivacyStatus = () => {
    hasAgreedPrivacy.value = false;
    uni.removeStorageSync("hasAgreedPrivacy");
  };

  return {
    hasAgreedPrivacy,
    setPrivacyAgreement,
    needShowPrivacyDialog,
    resetPrivacyStatus,
  };
});
