**Project Decisions**

**Overview**
- 目标：做一个现代、清晰、可快速定位信息的 Linux 命令速查网站。
- 范式：按“单个命令”为单位呈现，突出常用 flag 与常见用法，便于复制。

**Audience**
- 主要用户：初学者与开发者（无需系统级运维背景）。
- 使用场景：本地开发与日常命令速查。

**Language**
- 语言：中文优先（当前仅中文）。

**Scope**
- 内容形态：每页一个命令（如 `grep`、`sed`、`tar`）。
- 信息层次：用途一句话 → 最短语法 → 常用 flag → 常见示例 → 注意事项。
- 不包含：原理/长篇教程/实现细节；跨发行版差异；包管理器差异。
- 安全：对可能破坏性的命令/选项明确“危险”标识，并提供更安全的替代或 dry-run 示例。

**Page Structure (per command)**
- 用途：一句话定位该命令解决什么问题。
- 语法：最短可用语法，避免冗长 `--help` 式罗列。
- 常用选项：5–12 个高频 flag，短句解释（按实际使用频率排序）。
- 常见用法：3–6 个一行示例，可直接复制。
- 注意事项：易错点与“危险标识”（如 `-rf`, `-delete`, 就地修改等）。
- 相关：相近命令或常见组合（可选）。

**Danger Policy**
- 标识：以明显“危险/破坏性”文案标注涉及数据删除、覆盖、批量改写等风险的命令/选项。
- 优先展示：先给非破坏性/预览类示例（如 dry-run、`-print`、不加 `-f`）。
- 复制安全：危险示例不默认暴露 `sudo` 与 `-f`，需用户主动选择。

**Distros**
- 发行版差异：当前不覆盖（如包管理、`sed -i` 差异等一律不区分）。

**MVP Content Policy**
- 命令清单：采用“滚动扩充”策略，先从高频基础命令开始，再逐步新增。
- 初始建议（可随时调整，不视为锁定）：
  - 文件/目录：`ls`, `cp`, `mv`, `rm`, `find`, `chmod`, `chown`, `tar`
  - 文本处理：`grep`, `sed`, `awk`, `cut`
  - 系统与网络：`ps`, `df`, `curl`

**Non-goals (此阶段不做)**
- 原理性讲解与长文教程。
- 跨发行版映射与包管理器差异对照。
- 深度运维主题（systemd、内核调优、容器编排等）。

**Editorial Style**
- 优先短句与短命令；行宽控制，可读性优先。
- 示例以“能直接运行、风险可控”为第一原则。
- 统一术语与格式：命令、flag、参数顺序保持一致性。

**Open Decisions**
- 成功度量：是否需要明确“3 秒找到答案”等指标。

**Next**
- 已选技术栈（标准版，TypeScript 全面启用）
  - 框架：Astro（静态优先，加载快，内容站点友好）
  - 语言：TypeScript（`strict` 模式、内容集合 schema 校验）
  - 内容：MDX（文档可插入组件）
  - 样式：Tailwind（统一留白/层次/响应式；自定义设计令牌）
  - 代码高亮：Shiki（构建时上色，无运行时抖动）
- 页面过渡：使用原生 View Transitions API + 轻量导航脚本（拦截站内链接，`document.startViewTransition` + fetch 替换 `<main>`）。不依赖外部库，不支持时回退为普通跳转。
  - 微交互：无依赖方案（IntersectionObserver + CSS 过渡），后续可按需替换为 Motion One
  - 平滑滚动：Lenis（柔和滚动、可控惯性）
  - 搜索：FlexSearch（离线搜索，`Cmd/Ctrl+K` 命令面板）
  - 图标与插画：Lucide/Tabler SVG；Lottie（可选）

**视觉与动效基线**
- 呼吸留白：`container max-w-[72ch]`、`space-y-10/16/24`。
- 渐变与氛围：多层 `radial-gradient` + `blur` + `opacity`；暗/亮主题适配。
- 深度层次：玻璃态（`backdrop-blur-md`, `bg-white/5`, `border-white/10`）+ 轻阴影。
- 动效令牌：160–240ms；缓动 `cubic-bezier(0.22,1,0.36,1)`；尊重 `prefers-reduced-motion`。
- 过渡：卡片网格 → 详情页使用 View Transitions 绑定 `data-view-transition-name`。

**动效微调（统一实现）**
- 变量：`--dur-fast:160ms`、`--dur-base:220ms`、`--dur-slow:420ms`、`--ease-smooth`。
- 卡片：`hover:-translate-y-0.5` + `hover:shadow-elevated`；按下 `active:scale(.995)` 与回落。
- Mesh 背景：CSS `drift`（28s、往返），在 `prefers-reduced-motion` 下禁用。
- 通用交互类：`.interactive` 统一过渡时长与缓动。

**品牌与配色**
- 选用：Mono Carbon（黑白系，暗色主导）。
- 令牌：
  - Light：`--bg: #f8f8f8; --fg: #171717; --fg-muted: slate-500; --brand: #171717`
  - Dark：`--bg: #0c0c0e; --fg: #ececf0; --fg-muted: slate-400; --brand: #ffffff`
- 背景渐变：彩色改为黑白低不透明度光斑（暗色用白、亮色用黑），已在布局实现。

**UI 组件策略**
- 优先自建轻组件（Card/Button/Badge/Dialog/CodeBlock/Toast）。
- 如需现成交互，仅点用 shadcn 的 Command/Dialog/Tooltip（作为 React 小岛，非必需）。

**接下来**
- 脚手架 Astro + Tailwind + MDX 项目结构，内置设计令牌与动效基线。
- 提供首页网格、命令详情模板、危险标识与复制按钮组件、2–3 个示例命令页。
- 搜索面板：FlexSearch 本地索引，Cmd/Ctrl+K 调出，箭头导航 + Enter 打开。
