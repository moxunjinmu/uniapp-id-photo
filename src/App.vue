<!--
 * @Author: moxunjingmu
 * @Date: 2025-03-24 22:17:04
 * @Description:
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style>
/* 引入iconfont图标 */
@import "./common/iconfont/iconfont.wxss";

/* 全局样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f7f7f7;
}

/* 隐藏滚动条但保持可滚动功能 */
/* ::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.global-scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-auto,
.overflow-y-auto,
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
} */
</style>
