import { ref } from "vue";
import { usePrivacyStore } from "@/store/modules/privacy";

interface PrivacyResult {
  event: "agree" | "disagree";
  buttonId?: string;
}

export const usePrivacy = () => {
  const privacyStore = usePrivacyStore();
  const privacyComponentRef = ref();

  // 检查并显示隐私弹窗
  const checkAndShowPrivacy = (): Promise<PrivacyResult> => {
    return new Promise((resolve) => {
      // 如果用户已经同意过隐私协议，直接返回同意结果
      if (!privacyStore.needShowPrivacyDialog()) {
        resolve({ event: "agree" });
        return;
      }

      // 显示隐私弹窗
      if (privacyComponentRef.value) {
        privacyComponentRef.value.init(resolve);
      } else {
        console.error("隐私弹窗组件引用不存在");
        resolve({ event: "disagree" });
      }
    });
  };

  // 强制显示隐私弹窗（用于设置页面等场景）
  const forceShowPrivacy = (): Promise<PrivacyResult> => {
    return new Promise((resolve) => {
      if (privacyComponentRef.value) {
        privacyComponentRef.value.init(resolve);
      } else {
        console.error("隐私弹窗组件引用不存在");
        resolve({ event: "disagree" });
      }
    });
  };

  // 重置隐私状态
  const resetPrivacyStatus = () => {
    privacyStore.resetPrivacyStatus();
  };

  return {
    privacyComponentRef,
    checkAndShowPrivacy,
    forceShowPrivacy,
    resetPrivacyStatus,
    hasAgreedPrivacy: privacyStore.hasAgreedPrivacy,
    needShowPrivacyDialog: privacyStore.needShowPrivacyDialog,
  };
};
