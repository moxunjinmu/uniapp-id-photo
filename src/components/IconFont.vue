<!--
 * @Author: moxunjingmu
 * @Date: 2025-03-25 05:27:56
 * @Description:
-->
<template>
  <text :class="['fas', `fa-${name}`]" :style="style" />
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  name: string;
  size?: string | number;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "32rpx",
  color: "",
});

const style = computed(() => {
  const styleObj: Record<string, string> = {};

  if (props.size) {
    styleObj.fontSize = typeof props.size === "number" ? `${props.size}rpx` : props.size;
  }

  if (props.color) {
    styleObj.color = props.color;
  }

  return styleObj;
});
</script>

<style>
/* 在App.vue中全局引入iconfont样式 */
</style>
