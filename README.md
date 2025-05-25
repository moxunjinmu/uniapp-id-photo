# UniApp 证件照制作应用

一个基于 Vue 3 + TypeScript + Vite + UnoCSS 的 uni-app 证件照制作应用，支持多端开发（小程序、H5、APP），提供证件照拍摄、背景色更换、排版等功能。

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg) ![Vite](https://img.shields.io/badge/Vite-4.x-646cff.svg) ![uni-app](https://img.shields.io/badge/uni--app-3.x-green.svg) ![UnoCSS](https://img.shields.io/badge/UnoCSS-latest-8D66FE.svg) ![Pinia](https://img.shields.io/badge/Pinia-latest-yellow.svg) ![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3.svg) ![Prettier](https://img.shields.io/badge/Prettier-3.x-F7B93E.svg) ![Sass](https://img.shields.io/badge/Sass-latest-CC6699.svg)

## 应用截图

<table>
  <tr>
    <td><img src="devUI3.0/cover/home.png" alt="首页" width="220"/></td>
    <td><img src="devUI3.0/cover/photo_result.png" alt="照片结果" width="220"/></td>
    <td><img src="devUI3.0/cover/camera.png" alt="相机页面" width="220"/></td>
  </tr>
</table>

## 特性

- 📸 证件照拍摄与处理
- 🎨 多种背景色选择与更换（白色、蓝色、红色等）
- 🖼️ 照片排版与预览功能（支持多种尺寸的证件照预览）
- 💾 照片下载与保存功能（支持保存到相册、文件系统）
- 📱 支持多端开发（微信小程序、H5、App）
- 🛡️ 图片自动缓存，提高性能
- 🧰 完整的代码规范与提交规范
- 🔍 ESLint + Prettier 代码质量控制
- 🔄 Git Hooks 自动化工作流
- 📦 Pinia 状态管理
- 🛠️ 请求封装和拦截器
- 🧩 自动导入 API 和组件
- 🎨 集成 UnoCSS 原子化 CSS 框架

## 环境要求

- Node.js >= 16.0.0（推荐使用 nvm 管理 Node 版本）
- Vue CLI >= 5.0.0
- 开发工具：VSCode 或 Cursor 编辑器
- 微信开发者工具（用于开发微信小程序）

## 快速开始

### 克隆项目

```bash
git clone https://gitee.com/your-username/uniapp-id-photo.git
cd uniapp-id-photo
```

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn
```

### 启动开发服务器

```bash
# 开发 H5
pnpm dev:h5

# 开发微信小程序
pnpm dev:mp-weixin

# 开发支付宝小程序
pnpm dev:mp-alipay

# 预览 H5
pnpm preview:h5
# 更多平台请参考 package.json 中的 scripts
```

### 构建生产版本

```bash
# 构建 H5
pnpm build:h5

# 构建微信小程序
pnpm build:mp-weixin

# 构建支付宝小程序
pnpm build:mp-alipay

# 更多平台请参考 package.json 中的 scripts
```

## 项目结构

```plaintext
uniapp-id-photo/
├── src/                     # 源代码
│   ├── api/                 # API 接口目录
│   ├── components/          # 公共组件
│   ├── hooks/               # 自定义钩子函数
│   │   ├── useImageBackground.ts  # 图片背景处理
│   │   ├── usePhotoProcessor.ts   # 照片处理
│   │   └── useToast.ts            # 提示消息
│   ├── pages/               # 页面
│   │   ├── photo-result/    # 照片结果页面
│   │   ├── camera/          # 相机页面
│   │   └── ...              # 其他页面
│   ├── static/              # 静态资源
│   │   └── tabbar/          # Tabbar 图标
│   ├── stores/              # Pinia 状态管理
│   │   ├── modules/         # 状态模块
│   │   │   ├── photo.ts     # 照片状态
│   │   │   └── config.ts    # 配置状态
│   │   └── index.ts         # 状态入口
│   ├── styles/              # 全局样式
│   ├── utils/               # 工具函数
│   │   ├── file.ts          # 文件处理
│   │   └── request.ts       # 请求封装
│   ├── App.vue              # 应用入口组件
│   ├── main.ts              # 主入口文件
│   ├── manifest.json        # 应用配置文件
│   ├── pages.json           # 页面配置文件
│   └── uni.scss             # uni-app 样式变量
├── devUI3.0/                # UI界面设计参考
├── eslint.config.mjs        # ESLint 配置
├── tsconfig.json            # TypeScript 配置
├── uno.config.ts            # UnoCSS 配置
├── vite.config.ts           # Vite 配置
└── package.json             # 依赖和脚本
```

## 功能详解

### 1. 证件照拍摄

- **相机控制**：应用提供相机界面，支持拍摄证件照
- **人脸检测**：自动检测人脸位置，辅助用户调整拍摄角度
- **照片裁剪**：根据不同证件照要求自动裁剪照片
- **多种类型**：支持护照、身份证、驾照等多种证件照类型和规格

### 2. 背景色更换

- **一键换色**：支持一键更换背景色，包括白色、蓝色、红色等多种颜色
- **实时预览**：背景色更改后可实时预览效果
- **图像缓存**：采用图像缓存机制，提高背景色切换效率
- **透明背景**：支持透明背景，便于用户根据需求自定义背景色

### 3. 照片排版

- **多种排版**：支持单张、多张、满版等多种排版方式
- **自定义大小**：可自定义照片尺寸和排版方式
- **排版预览**：提供排版预览功能，方便用户确认效果

### 4. 照片下载

- **多种格式**：支持JPG、PNG等多种格式下载
- **高清导出**：支持高清照片导出，满足打印需求
- **保存相册**：支持一键保存到手机相册
- **跨平台**：适配不同平台的文件系统，确保下载功能在各平台正常工作

## 部署指南

### 微信小程序部署

1. 在微信公众平台注册小程序账号
2. 构建微信小程序版本：`pnpm build:mp-weixin`
3. 将生成的 dist/build/mp-weixin 目录上传到微信开发者工具
4. 在开发者工具中点击"上传"按钮，填写版本号和描述
5. 在微信公众平台提交审核并发布

### H5部署

1. 构建H5版本：`pnpm build:h5`
2. 将生成的 dist/build/h5 目录部署到Web服务器
3. 配置服务器HTTPS（推荐）
4. 配置服务器缓存策略，优化静态资源加载

### App部署

1. 安装App打包环境：`HBuilderX`
2. 导入项目到 HBuilderX
3. 点击"发行" -> "原生App-云打包"
4. 配置证书和应用信息
5. 等待云打包完成，下载安装包进行发布

## 常见问题解答

### Q1: 微信小程序图片无法保存怎么办？

A1: 需要在小程序配置中添加相册访问权限，在 `manifest.json` 中的 `mp-weixin` 配置项下添加：

```json
"permission": {
  "scope.writePhotosAlbum": {
    "desc": "保存证件照到相册"
  }
}
```

### Q2: 背景色切换不生效怎么办？

A2: 可能是缓存导致的问题。请尝试以下方法：

1. 确保使用的是透明背景图片作为基础
2. 清除图片缓存：应用会在页面关闭时自动清除缓存
3. 检查网络连接是否正常
4. 重启应用

### Q3: iOS设备拍照后照片旋转了怎么办？

A3: 这是由于iOS设备拍照的EXIF信息导致的。应用已处理这一情况，自动纠正照片方向。如仍有问题，请确保使用最新版本。

### Q4: 怎样自定义证件照尺寸？

A4: 目前应用支持多种预设尺寸。自定义尺寸功能将在后续版本中提供。

## 代码规范

项目集成了 ESLint 和 Prettier 进行代码质量控制和格式化。

### ESLint 配置

ESLint 配置位于 `eslint.config.mjs` 文件，针对 JavaScript、TypeScript 和 Vue 文件提供了代码规范检查。

```bash
# 运行 ESLint 检查并修复
pnpm lint
```

### 提交规范

项目使用 commitlint 强制实施 Git 提交消息规范：

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `revert`: 回退
- `build`: 打包

提交示例：

```bash
git commit -m "feat: 添加用户登录功能"
```

## UnoCSS 集成

项目集成了 UnoCSS 提供原子化 CSS 解决方案：

```html
<!-- 示例用法 -->
<view class="flex justify-center items-center p-4 bg-blue-500 text-white">UnoCSS 示例</view>
```

## Pinia 状态管理

项目使用 Pinia 进行状态管理，示例文件位于 `src/stores/` 目录下。

```typescript
// 使用 store
const photoStore = usePhotoStore();

// 获取照片路径
const imgPath = computed(() => photoStore.photoState.processedImagePath);

// 更新照片路径
photoStore.setProcessedImage(newImagePath);
```

## HTTP 请求封装

项目对 uni.request 进行了封装，提供了拦截器和统一的错误处理：

```typescript
// 示例用法
import { request } from "@/utils/request";

const data = await request<ResponseType>({
  url: "/api/endpoint",
  method: "GET",
});
```

## 自动导入

项目配置了 unplugin-auto-import 和 unplugin-vue-components 实现 API 和组件的自动导入：

- Vue API 自动导入
- Vue 组件自动导入
- uni-app API 自动导入
- Pinia API 自动导入

## 组件使用

项目配置了 easycom，可以直接使用 `components` 目录下的组件，无需手动导入：

```html
<!-- 示例用法，无需导入 -->
<custom-component></custom-component>
```

## 贡献指南

欢迎贡献代码或提出建议！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'feat: 添加一些功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

[MIT](LICENSE)
