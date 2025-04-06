import { ref } from "vue";
import { useToast } from "./useToast";

export interface CameraOptions {
  devicePosition?: "front" | "back";
  flash?: "auto" | "on" | "off" | "torch";
  frameSize?: "small" | "medium" | "large";
}

export const useCameraController = () => {
  const { showToast } = useToast();
  const cameraContext = ref<UniApp.CameraContext | null>(null);
  const photoPath = ref<string>("");
  const isCameraReady = ref(false);
  const devicePosition = ref<"front" | "back">("front");
  // const lastTakePictureTime = ref(0);

  const initCamera = () => {
    try {
      // #ifdef H5
      // H5环境下使用原生相机API
      if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
        isCameraReady.value = true;
      } else {
        throw new Error("浏览器不支持相机功能");
      }
      // #endif

      // #ifdef MP-WEIXIN || APP-PLUS
      cameraContext.value = uni.createCameraContext();
      isCameraReady.value = true;
      // #endif
    } catch (error) {
      console.error("相机初始化失败：", error);
      showToast("相机初始化失败，请重试");
      isCameraReady.value = false;
    }
  };

  const takePicture = async (): Promise<string> => {
    if (!isCameraReady.value) {
      throw new Error("相机未初始化");
    }
    let res;

    // #ifdef H5
    res = new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.setAttribute("playsinline", "true");
      video.setAttribute("autoplay", "true");
      video.setAttribute("style", "display:none");
      document.body.appendChild(video);

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: devicePosition.value === "front" ? "user" : "environment" } })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
          video.onplay = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("无法创建画布上下文"));
              return;
            }
            ctx.drawImage(video, 0, 0);
            const imgPath = canvas.toDataURL("image/jpeg");
            stream.getTracks().forEach((track) => track.stop());
            document.body.removeChild(video);
            resolve(imgPath);
          };
        })
        .catch((err) => {
          document.body.removeChild(video);
          reject(err);
        });
    });
    // #endif
    // #ifdef MP-WEIXIN || APP-PLUS
    res = new Promise((resolve, reject) => {
      if (!cameraContext.value) {
        reject(new Error("相机上下文未初始化"));
        return;
      }

      cameraContext.value.takePhoto({
        quality: "high",
        success: (res) => {
          photoPath.value = res.tempImagePath;
          resolve(res.tempImagePath);
        },
        fail: (err) => {
          console.error("拍照失败：", err);
          reject(new Error("拍照失败"));
        },
      });
    });
    // #endif
    return res as Promise<string>;
  };

  const chooseFromAlbum = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album"],
        success: (res) => {
          photoPath.value = res.tempFilePaths[0];
          console.log("res.tempFilePaths[0]", res.tempFilePaths[0]);

          resolve(res.tempFilePaths[0]);
        },
        fail: (err) => {
          console.error("选择图片失败：", err);
          reject(new Error("选择图片失败"));
        },
      });
    });
  };

  const toggleCameraPosition = () => {
    devicePosition.value = devicePosition.value === "front" ? "back" : "front";
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
};
