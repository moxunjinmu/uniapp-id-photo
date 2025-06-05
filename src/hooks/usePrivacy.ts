import { ref } from "vue";
import { usePrivacyStore } from "@/store/modules/privacy";

// 声明微信小程序API类型
declare const wx: {
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

export const usePrivacy = () => {
  const privacyStore = usePrivacyStore();
  const privacyComponentRef = ref();

  // 检查微信小程序隐私授权
  const checkWeixinPrivacy = (
    privacyList: string[] = ["chooseImage", "saveImageToPhotosAlbum", "camera"],
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      // #ifdef MP-WEIXIN
      if (typeof wx !== "undefined" && wx.requirePrivacyAuthorize) {
        wx.requirePrivacyAuthorize({
          privacyList,
          success: () => {
            console.log("微信隐私检查通过");
            resolve(true);
          },
          fail: (res) => {
            console.log("微信隐私检查失败", res);
            resolve(false);
          },
        });
      } else {
        console.log("微信API不可用，跳过隐私检查");
        resolve(true);
      }
      // #endif

      // #ifndef MP-WEIXIN
      console.log("非微信小程序环境，跳过微信隐私检查");
      resolve(true);
      // #endif
    });
  };

  // 检查并显示隐私弹窗
  const checkAndShowPrivacy = (): Promise<PrivacyResult> => {
    return new Promise((resolve) => {
      const handlePrivacyCheck = async () => {
        try {
          // 如果用户已经同意过隐私协议，直接返回同意结果
          if (!privacyStore.needShowPrivacyDialog()) {
            // 但仍需要检查微信小程序的隐私授权
            const weixinPrivacyOk = await checkWeixinPrivacy();
            if (weixinPrivacyOk) {
              resolve({ event: "agree" });
              return;
            }
          }

          // 显示隐私弹窗
          if (privacyComponentRef.value) {
            privacyComponentRef.value.init(resolve);
          } else {
            console.error("隐私弹窗组件引用不存在");
            resolve({ event: "disagree" });
          }
        } catch (error) {
          console.error("隐私检查过程中出错：", error);
          resolve({ event: "disagree" });
        }
      };

      handlePrivacyCheck();
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
    checkWeixinPrivacy,
    hasAgreedPrivacy: privacyStore.hasAgreedPrivacy,
    needShowPrivacyDialog: privacyStore.needShowPrivacyDialog,
  };
};
