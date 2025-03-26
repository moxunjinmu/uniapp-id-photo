import { ref } from "vue";

export interface CameraOptions {
  devicePosition?: "front" | "back";
  flash?: "auto" | "on" | "off" | "torch";
  frameSize?: "small" | "medium" | "large";
}

export function useCameraController() {
  const cameraContext = ref<UniApp.CameraContext | null>(null);
  const photoPath = ref<string>("");
  const isCameraReady = ref(false);
  const devicePosition = ref<"front" | "back">("front");
  const lastTakePictureTime = ref(0);

  // 初始化相机
  const initCamera = (cameraId: string, options: CameraOptions = {}) => {
    devicePosition.value = options.devicePosition || "front";

    cameraContext.value = uni.createCameraContext();

    if (cameraContext.value) {
      isCameraReady.value = true;
      console.log("相机初始化成功");
    } else {
      console.error("相机初始化失败");
    }
  };

  // 切换前后摄像头
  const toggleCameraPosition = () => {
    devicePosition.value = devicePosition.value === "front" ? "back" : "front";
  };

  // 拍照
  const takePicture = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!cameraContext.value) {
        reject(new Error("相机未初始化"));
        return;
      }

      // 防抖处理，限制拍照频率
      const now = Date.now();
      if (now - lastTakePictureTime.value < 500) {
        reject(new Error("拍照太频繁，请稍后再试"));
        return;
      }

      lastTakePictureTime.value = now;

      cameraContext.value.takePhoto({
        quality: "high",
        success: (res) => {
          photoPath.value = res.tempImagePath;
          resolve(res.tempImagePath);
        },
        fail: (err) => {
          console.error("拍照失败", err);
          reject(new Error("拍照失败"));
        },
      });
    });
  };

  // 从相册选择照片
  const chooseFromAlbum = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          photoPath.value = res.tempFilePaths[0];
          resolve(res.tempFilePaths[0]);
        },
        fail: (err) => {
          console.error("选择图片失败", err);
          reject(new Error("选择图片失败"));
        },
      });
    });
  };

  return {
    cameraContext,
    photoPath,
    isCameraReady,
    devicePosition,
    initCamera,
    toggleCameraPosition,
    takePicture,
    chooseFromAlbum,
  };
}
