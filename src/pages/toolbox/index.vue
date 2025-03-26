<template>
  <view class="toolbox-container pb-20 overflow-auto h-full">
    <!-- 顶部标题 -->
    <view class="status-bar flex items-center justify-between px-4 py-3">
      <text class="text-32rpx font-medium">工具箱</text>
    </view>

    <!-- 工具列表 -->
    <view class="p-4">
      <view class="grid grid-cols-1 gap-4">
        <ToolCard
          v-for="tool in toolList"
          :key="tool.title"
          :title="tool.title"
          :description="tool.description"
          :icon="tool.icon"
          :color="tool.color"
          :disabled="tool.disabled" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { useToast } from "@/hooks/useToast";
import ToolCard from "@/components/ToolCard.vue";

interface Tool {
  title: string;
  description: string;
  icon: string;
  color: string;
  disabled?: boolean;
}

// const { showToast } = useToast();

// 工具列表数据
const toolList = ref<Tool[]>([
  {
    title: "背景色更换",
    description: "更换证件照背景颜色",
    icon: "palette",
    color: "purple",
    disabled: true,
  },
  {
    title: "智能美颜",
    description: "一键美颜，让照片更好看",
    icon: "magic",
    color: "pink",
    disabled: true,
  },
  {
    title: "证件照裁剪",
    description: "精准裁剪各种尺寸证件照",
    icon: "crop",
    color: "blue",
    disabled: true,
  },
  {
    title: "证件照打印",
    description: "在线下单，快递到家",
    icon: "print",
    color: "green",
    disabled: true,
  },
  {
    title: "尺寸调整",
    description: "自定义调整照片尺寸",
    icon: "crop-alt",
    color: "amber",
    disabled: true,
  },
  {
    title: "证件照合成",
    description: "多张证件照合成排版",
    icon: "magic",
    color: "indigo",
    disabled: true,
  },
]);

// 工具点击处理
// const handleToolTap = (toolName: string) => {
//   console.log(`${toolName} 被点击了`, toolName);

//   showToast(`${toolName}功能开发中，敬请期待`);
// };
</script>

<style lang="scss" scoped>
.toolbox-container {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.status-bar {
  height: 88rpx;
  background-color: #f7f7f7;
  position: relative;
  z-index: 10;
}

.tool-card {
  background-color: white;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.tool-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 32rpx;
  font-size: 48rpx;
}
</style>
