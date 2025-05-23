<template>
  <view class="camera-container">
    <view class="camera-content">
      <!-- 相机组件 -->
      <camera id="camera" class="camera" :device-position="devicePosition" flash="off" @error="handleCameraError">
        <!-- 人脸参考框 -->
        <view class="face-reference">
          <view class="face-outline"></view>
          <view class="face-guide-line horizontal-line top"></view>
          <view class="face-guide-line horizontal-line bottom"></view>
          <view class="face-guide-line vertical-line left"></view>
          <view class="face-guide-line vertical-line right"></view>
        </view>
      </camera>

      <!-- 拍照提示 -->
      <view class="photo-tips">
        <text class="photo-tips-text">请将脸部放在框内，保持光线充足</text>
      </view>

      <!-- 控制按钮区 -->
      <view class="camera-controls">
        <!-- 返回按钮 -->
        <view class="control-button" @tap="navigateBack">
          <view class="control-icon-container">
            <IcomoonFont name="arrow-left" size="50rpx" color="#fff" />
          </view>
        </view>

        <!-- 拍照按钮 -->
        <view class="shutter-button" @tap="handleTakePicture">
          <view class="shutter-inner"></view>
        </view>

        <!-- 切换摄像头按钮 -->
        <view class="control-button" @tap="toggleCamera">
          <view class="control-icon-container">
            <IcomoonFont name="sync" size="50rpx" color="#fff" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { useCameraController } from "@/hooks";
import { usePhotoStore } from "@/store/modules/photo";
import { useToast } from "@/hooks/useToast";

// 获取相机控制器
const { devicePosition, initCamera, toggleCameraPosition, takePicture, isCameraReady } = useCameraController();
const { showToast, showLoading, hideLoading } = useToast();
const photoStore = usePhotoStore();

// 初始化相机
onLoad(() => {
  initCamera();
});

// 切换摄像头
const toggleCamera = () => {
  toggleCameraPosition();
};

// 处理相机错误
const handleCameraError = (error: any) => {
  console.error("相机错误：", error);
  showToast("相机初始化失败，请检查权限设置");
};

// 拍照
const handleTakePicture = async () => {
  if (!isCameraReady.value) {
    showToast("相机未就绪，请稍后再试");
    return;
  }

  showLoading("处理中...");

  try {
    const imgPath = await takePicture();
    // 将图片路径保存到全局状态
    photoStore.setSourceImage(imgPath);
    hideLoading();
    navigateToPhotoResult();
  } catch (error) {
    hideLoading();
    console.error("拍照失败：", error);
    showToast("拍照失败，请重试");
  }
};

// 导航到结果页面
const navigateToPhotoResult = () => {
  console.log("导航到照片结果页");
  uni.navigateTo({
    url: "/package-index/pages/photo-result/index",
  });
};

// 返回上一页
const navigateBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.camera-container {
  height: 100vh;
  width: 100vw;
  background-color: #000;
  display: flex;
  flex-direction: column;
}

.camera-content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.camera {
  width: 100%;
  height: 100%;
  position: relative;
}

.face-reference {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500rpx;
  height: 500rpx;
  z-index: 10;
}

.face-outline {
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

.face-guide-line {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
}

.horizontal-line {
  width: 100%;
  height: 1px;
  left: 0;
}

.top {
  top: 33%;
}

.bottom {
  bottom: 33%;
}

.vertical-line {
  height: 100%;
  width: 1px;
  top: 0;
}

.left {
  left: 33%;
}

.right {
  right: 33%;
}

.photo-tips {
  position: absolute;
  bottom: 200rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 20;
}

.photo-tips-text {
  color: #fff;
  font-size: 28rpx;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
}

.camera-controls {
  position: absolute;
  bottom: 60rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 20;
}

.control-button {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-icon-container {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.shutter-button {
  width: 140rpx;
  height: 140rpx;
  border-radius: 70rpx;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.shutter-inner {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: #fff;
  border: 4px solid rgba(255, 255, 255, 0.8);
}
</style>
