Linux Cheatsheet (Astro + TypeScript)

使用本地步骤
- 安装依赖：npm i（或 pnpm i / yarn）
- 开发启动：npm run dev（默认 http://localhost:4321）
- 构建：npm run build；预览：npm run preview

技术栈
- Astro + MDX + Tailwind + Shiki + View Transitions
- TypeScript 严格模式；内容集合使用 Zod 校验
- Motion One（入场/悬停微动效），Lenis（平滑滚动）

目录结构（关键）
- src/layouts/BaseLayout.astro：全局布局、背景网格渐变、主题切换
- src/pages/index.astro：首页卡片网格
- src/pages/commands/[slug].astro：命令详情页
- src/content/commands/*.mdx：命令文档（MDX）
- src/components/*：复用组件（卡片、复制按钮、危险提示）

搜索索引（简版）
- GET /search.json 返回命令列表，前端可用 FlexSearch 构建客户端索引。

