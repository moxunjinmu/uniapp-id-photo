视觉风格提示词：

复制

1. 设计系统基准：

- 采用与现有证件照小程序一致的移动端优先设计
- 使用Tailwind CSS工具类构建布局
- 图标库：Font Awesome 6.4.0
- 字体栈：-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial

2. 色彩规范：

- 主色调：#6366f1 (indigo-500)
- 次要色：#8b5cf6 (purple-400)
- 背景色：#f7f7f7
- 卡片底色：white
- 文字色阶：
  • 标题：#333333
  • 正文：#666666
  • 辅助文字：#999999
  • 交互元素：#6366f1

3. 间距系统：

- 基础单位：4px
- 容器内边距：15px
- 卡片外边距：8px
- 元素间距：8px/16px/24px
  组件样式提示词：

复制

1. 状态栏(Status Bar)：

- 高度：44px
- 背景色：#f7f7f7
- 文字样式：text-sm
- 固定定位在顶部

2. 输入框(Input Field)：

- 圆角：rounded-full
- 背景色：#f0f0f0
- 内边距：py-2 px-4
- 聚焦状态：去除默认outline
- 占位文字颜色：text-gray-400
- 图标间距：mr-2

3. 操作按钮(Primary Button)：

- 基础样式：bg-indigo-500 text-white
- 圆角：rounded-full
- 内边距：px-6 py-2
- 悬停效果：bg-indigo-600
- 激活效果：scale-95变换
- 文字样式：text-sm font-medium

4. 卡片容器(Card)：

- 圆角：rounded-xl
- 阴影：shadow-lg
- 背景色：white
- 交互效果：
  • 默认状态：transition-all duration-300
  • 点击效果：transform scale-95 + 内阴影
  • 激活状态：scale-105 + 增强阴影

交互动效提示词：

复制

1. 按压效果：
   .card-zoom {
   transition: transform 0.15s ease, box-shadow 0.15s ease;
   }
   .card-zoom:active {
   transform: scale(0.95);
   box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
   }

2. 按钮反馈：
   button {
   transition: all 0.2s ease;
   }
   button:active {
   transform: scale(0.98);
   }

3. 表单聚焦：
   input:focus {
   box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
   }
   无障碍设计提示：

复制

1. 颜色对比度：

- 文字与背景至少满足WCAG AA标准
- 主按钮文字与背景对比度 ≥ 4.5:1

2. 交互尺寸：

- 可点击元素最小尺寸：40×40px
- 输入框高度 ≥ 44px

3. 焦点管理：

- 为键盘操作保留可见焦点样式
- 使用aria-label标注图标按钮
  特别说明：

复制

1. 保持与现有页面一致的交互模式：

- 卡片点击的二级动画效果（按压→弹起）
- 底部导航栏的激活状态指示
- 表单元素的微交互反馈

2. 响应式处理：

- 考虑iPhone X+系列的安全区域
- 最大宽度限制：640px
- 左右安全边距：15px
