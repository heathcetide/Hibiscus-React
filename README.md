# Hibiscus-React

一个现代化、功能丰富的 React UI 模板项目，提供高质量的组件库、动画效果和多种布局方案。

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-38B2AC.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ 特性

### 🎨 丰富的组件库
- **50+ 高质量组件** - 覆盖各种使用场景
- **无障碍支持** - 基于 Radix UI 构建
- **TypeScript 支持** - 完整的类型定义
- **主题系统** - 支持多主题和暗色模式

### 🎭 强大的动画系统
- **页面过渡动画** - fade, slide, scale, flip, glitch, morph
- **水波涟漪效果** - 多种水波动画效果
- **磁性按钮** - 鼠标跟随交互效果
- **粒子系统** - 可交互的粒子动画
- **滚动显示** - 元素进入视口动画
- **故障效果** - Glitch 动画效果
- **打字机效果** - 逐字显示文本

### 📱 多种布局方案
- **侧边栏布局** - 传统管理后台风格
- **顶部导航布局** - 现代网站风格
- **网格布局** - 响应式网格系统
- **卡片布局** - 卡片式展示
- **仪表板布局** - 数据可视化
- **电商布局** - 购物网站风格
- **作品集布局** - 展示类网站
- **博客布局** - 内容展示
- **看板布局** - 项目管理
- **时间线布局** - 事件展示

### 🤖 AI 功能集成
- **AI 写作助手** - 智能建议、重写、扩展、总结
- **文本分析** - 质量分析、情感分析
- **写作统计** - 字数统计、进度跟踪

### ⚡ 性能优化
- **代码分割** - 懒加载非关键页面
- **虚拟列表** - 大数据量渲染优化
- **无限滚动** - 分页加载优化
- **性能监控** - 实时性能指标
- **图片优化** - 懒加载和压缩

### 🔐 用户认证系统
- **完整的用户管理** - 注册、登录、登出
- **用户资料管理** - 头像上传、信息更新
- **密码管理** - 修改密码功能
- **Token 管理** - 自动刷新、持久化存储

### 📱 PWA 支持
- **离线功能** - Service Worker
- **安装提示** - 原生应用体验
- **响应式设计** - 移动端适配

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build

# 或使用 pnpm
pnpm build
```

### 预览生产版本

```bash
# 使用 npm
npm run preview

# 或使用 yarn
yarn preview

# 或使用 pnpm
pnpm preview
```

## 📁 项目结构

```
src/
├── components/          # 组件库
│   ├── UI/             # 基础UI组件
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── Animations/     # 动画效果组件
│   │   ├── PageTransition.tsx
│   │   ├── WaterRipple.tsx
│   │   ├── MagneticButton.tsx
│   │   └── ...
│   ├── Layout/         # 布局组件
│   │   ├── LayoutFactory.tsx
│   │   ├── layouts/
│   │   └── ...
│   ├── AI/             # AI助手组件
│   ├── Data/           # 数据展示组件
│   ├── Performance/    # 性能优化组件
│   └── PWA/            # PWA相关组件
├── pages/              # 页面组件
│   ├── Home.tsx
│   ├── ComponentLibrary.tsx
│   ├── AnimationShowcase.tsx
│   ├── Profile.tsx
│   └── ...
├── api/                # API接口
│   ├── auth.ts
│   └── profile.ts
├── stores/             # 状态管理
│   ├── authStore.ts
│   ├── themeStore.ts
│   └── uiStore.ts
├── hooks/              # 自定义Hooks
│   ├── useAsync.ts
│   ├── useDebounce.ts
│   └── ...
├── utils/              # 工具函数
│   ├── request.ts
│   ├── validation.ts
│   └── ...
└── styles/             # 样式文件
    └── theme.css
```

## 🎯 主要页面

### 首页 (`/`)
项目介绍和特性展示，包含：
- 项目概述
- 核心特性介绍
- 统计数据展示
- 快速开始指南

### 组件库 (`/component-library`)
完整的组件展示和文档，包含：
- 50+ 组件的详细演示
- 代码示例和用法说明
- 分类浏览和搜索功能
- 复制代码功能

### 高级展示 (`/advanced-showcase`)
高级组件和功能演示，包含：
- 统计卡片
- 滑块组件
- 步骤器
- 工具提示和弹出框
- 时间线组件
- 进度条
- 无限滚动
- 虚拟列表

### 动画展示 (`/animation-showcase`)
各种动画效果展示，包含：
- 水波涟漪效果
- 磁性按钮
- 故障效果
- 粒子效果
- 页面过渡效果
- 引导动画
- 滚动显示效果

### 用户资料 (`/profile`)
用户信息管理页面，包含：
- 个人信息编辑
- 头像上传
- 密码修改
- 偏好设置

### 关于页面 (`/about`)
项目介绍和团队信息，包含：
- 项目使命
- 核心价值观
- 发展历程
- 团队介绍

## 🛠️ 技术栈

### 核心框架
- **React 18.2.0** - 用户界面库
- **TypeScript 5.2.2** - 类型安全的 JavaScript
- **Vite 5.0.8** - 下一代前端构建工具

### UI 框架
- **Tailwind CSS 3.3.6** - 原子化 CSS 框架
- **Radix UI** - 无障碍组件基础
- **Lucide React** - 图标库

### 动画和交互
- **Framer Motion 10.16.16** - 动画库
- **React Hook Form 7.48.2** - 表单处理
- **React Router DOM 6.20.1** - 路由管理

### 状态管理
- **Zustand 4.4.7** - 轻量级状态管理

### 网络请求
- **Axios 1.12.2** - HTTP 客户端

### 开发工具
- **ESLint** - 代码质量检查
- **TypeScript ESLint** - TypeScript 代码检查
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - CSS 前缀自动添加

## 🎨 主题系统

项目支持多种主题，包括：

- **默认主题** - 现代简洁风格
- **暗色主题** - 深色模式
- **樱桃主题** - 粉色系
- **海洋主题** - 蓝色系
- **自然主题** - 绿色系
- **清新主题** - 青绿色系
- **日落主题** - 橙色系
- **薰衣草主题** - 紫色系

## 📱 响应式设计

项目完全支持响应式设计，适配各种设备：

- **移动端** - 手机和平板
- **桌面端** - 电脑和笔记本
- **大屏设备** - 4K 显示器

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件：

```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:8080

# 应用名称
VITE_APP_NAME=Hibiscus React

# 是否启用开发工具
VITE_DEV_TOOLS=true
```

### Vite 配置

项目使用 Vite 作为构建工具，配置文件为 `vite.config.ts`：

- 支持路径别名 `@` 指向 `src` 目录
- 开发服务器端口 3000
- 支持热模块替换 (HMR)
- 生产环境代码分割和压缩

### TypeScript 配置

项目使用 TypeScript，配置文件为 `tsconfig.json`：

- 严格模式启用
- 路径映射支持
- 现代 ES 模块支持

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

构建完成后，`dist` 目录包含所有静态文件。

### 部署到静态托管

项目可以部署到任何静态托管服务：

- **Vercel** - 推荐，支持自动部署
- **Netlify** - 支持表单处理
- **GitHub Pages** - 免费静态托管
- **阿里云 OSS** - 国内访问速度快

### 部署到服务器

```bash
# 构建项目
npm run build

# 将 dist 目录上传到服务器
# 配置 Nginx 或其他 Web 服务器
```

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 编写清晰的提交信息
- 添加必要的测试
- 更新相关文档

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [Radix UI](https://www.radix-ui.com/) - 无障碍组件
- [Lucide](https://lucide.dev/) - 图标库

## 📞 联系我们

- **项目地址**: [GitHub Repository](https://github.com/your-username/hibiscus-react)
- **问题反馈**: [Issues](https://github.com/your-username/hibiscus-react/issues)
- **功能建议**: [Discussions](https://github.com/your-username/hibiscus-react/discussions)

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！
