export interface ToastHook {
  /**
   * 显示消息提示框
   * @param title 提示的内容
   * @param duration 提示的延迟时间，默认1500ms
   */
  showToast: (title: string, duration?: number) => void;

  /**
   * 显示成功提示框
   * @param title 提示的内容
   * @param duration 提示的延迟时间，默认1500ms
   */
  showSuccess: (title: string, duration?: number) => void;

  /**
   * 显示加载提示框
   * @param title 提示的内容，默认为"加载中"
   */
  showLoading: (title?: string) => void;

  /**
   * 隐藏加载提示框
   */
  hideLoading: () => void;
}

/**
 * Toast提示钩子函数
 */
export function useToast(): ToastHook {
  /**
   * 显示消息提示框
   * @param title 提示的内容
   * @param duration 提示的延迟时间，默认1500ms
   */
  const showToast = (title: string, duration = 1500) => {
    uni.showToast({
      title,
      icon: "none",
      duration,
    });
  };

  /**
   * 显示成功提示框
   * @param title 提示的内容
   * @param duration 提示的延迟时间，默认1500ms
   */
  const showSuccess = (title: string, duration = 1500) => {
    uni.showToast({
      title,
      icon: "success",
      duration,
    });
  };

  /**
   * 显示加载提示框
   * @param title 提示的内容，默认为"加载中"
   */
  const showLoading = (title = "加载中") => {
    uni.showLoading({
      title,
      mask: true,
    });
  };

  /**
   * 隐藏加载提示框
   */
  const hideLoading = () => {
    uni.hideLoading();
  };

  return {
    showToast,
    showSuccess,
    showLoading,
    hideLoading,
  };
}
