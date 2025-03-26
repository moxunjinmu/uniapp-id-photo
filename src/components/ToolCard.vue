<!--
 * @Author: moxunjingmu
 * @Date: 2025-03-25 05:28:05
 * @Description:
-->
<template>
  <view class="tool-card" @tap="handleTap">
    <view class="tool-icon" :class="[`bg-${color}-100`, `text-${color}-500`]">
      <IconFont :name="icon" size="48rpx" />
    </view>
    <view>
      <text class="font-medium text-gray-800 text-30rpx">{{ title }}</text>
      <text class="text-24rpx text-gray-500 block mt-1">{{ description }}</text>
    </view>
    <view class="ml-auto flex items-center h-full">
      <IconFont name="chevron-right" class="text-gray-300 text-lg" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from "@/hooks/useToast";

interface Props {
  title: string;
  description: string;
  icon: string;
  color: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: true,
});

// const emit = defineEmits<{
//   (e: "tap", title: string): void
// }>();

const { showToast } = useToast();

const handleTap = () => {
  if (props.disabled) {
    console.log(props.title);
    showToast(`${props.title}功能开发中，敬请期待`);
    return;
  }
  // emit("tap", "ceshi");
};
</script>

<style lang="scss" scoped>
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
}
</style>
