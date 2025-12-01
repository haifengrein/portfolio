# Repository Guidelines

## 项目结构与模块组织
- `src/app`：Next.js App Router 入口，主页 `page.tsx` 与博客详情 `blog/[slug]/page.tsx` 走静态生成，避免在服务器组件中引入浏览器专属 API。
- `src/components`：展示与交互组件，优先拆分为小型无状态函数组件，复用 `@/components/PortfolioPage`，将复用逻辑（列表、导航、语言切换）下沉到此目录。
- `src/lib/markdown.ts`：Markdown 解析与阅读时间计算的单一职责模块；如需扩展 frontmatter 或缓存策略，请在此集中处理并保持纯函数。
- `src/data` / `src/types`：固定文案、多语言配置与类型定义；保持中英对齐，新增文案时同步更新两种语言。
- `posts/`：博客源 Markdown (`<slug>.md`)，对应路由 `/blog/<slug>`；`public/`：静态资源；根层配置文件（`next.config.mjs`、`tailwind.config.js`、`tsconfig.json`、`Dockerfile`）集中于仓库根目录。`portfolio.jsx` 可用于外部快速预览或嵌入，保持与 `src/app` 视图一致。

## 架构概览
- 站点采用 Next.js 14 App Router + SSG，渲染时读取 `posts/` frontmatter 构建首页列表与详情页，减少运行时依赖。
- GUI/终端双模式与中英切换均在前端状态机中完成，服务器仅提供静态内容与元数据。
- Markdown 解析逻辑与 UI 解耦，便于后续替换渲染器或添加缓存而不影响组件树。

## 构建、测试与开发命令
- 环境：Node >= 18.18，推荐使用 npm（CI/Docker 同步）。
- 安装依赖：`npm install`
- 本地开发：`npm run dev`（默认 http://localhost:3000）
- 代码质量：`npm run lint`（Next/ESLint）
- 生产构建：`npm run build`；本地验证构建产物：`npm start`
- 测试：当前 `npm test` 为占位；新增测试后请更新脚本与 CI，以保持与 `lint → test → build` 顺序一致。

## 编码风格与命名约定
- 语言：TypeScript + React 18 函数组件；保持 2 空格缩进与分号，使用 `@/...` 绝对路径别名；组件文件与导出使用帕斯卡命名（`Hero.tsx`），工具函数使用驼峰。
- 数据：App Router 下的服务器组件只负责数据获取与组合，UI 逻辑下沉到客户端组件；避免在 `lib` 中引用 React 以维持可测试性。
- Tailwind：按“布局类在前、交互/动画在后”排序，避免内联样式；复用全局的动画与配色变量，常用模式可抽成 `className` 组合函数。
- 内容：Markdown frontmatter 至少包含 `title`、`date`、`lang`、`summary`；tags 使用小写英文数组；新增语言时在 `src/data/siteData.ts` 同步添加枚举和文案，确保过滤逻辑不变。

## 测试指南
- 尚未引入框架；如添加测试，建议：
  - 单元/组件：Vitest + @testing-library/react，文件放置于与源码同层的 `__tests__` 或 `.test.tsx`。
  - 集成：可考虑 Playwright，用于博客路由与多语言切换。
- 覆盖重点：Markdown 解析（异常 frontmatter）、多语言过滤、核心 UI 的交互状态；需要文件读写时使用内存 fs mock，避免污染 `posts/`。

## 提交与 Pull Request
- 提交信息：以祈使句简述变更（例：`add markdown read-time calc`、`fix blog locale filter`），保持小而清晰的提交粒度，避免“misc/调整”这类模糊描述。
- PR 要求：说明动机与结果，列出主要修改点，附带截图/录屏（UI 变更时），关联相关 issue/任务；如涉及内容更新，注明受影响的语言与 slug。
- 在提交前至少运行 `npm run lint`；涉及构建路径变更或依赖升级时本地执行 `npm run build` 以验证，并在描述中写明验证方式与结果。

## 安全与配置提示（可选）
- 不要提交 `.env*` 或个人密钥；Docker 构建默认多阶段且不包含 dev 依赖，可直接用于 CI，若需远程日志或分析请通过环境变量注入。
- 新增配置项时，将默认值集中在 `next.config.mjs` 或 `src/data`，避免分散魔法数字；路径处理统一使用 Node `path.join` 以兼容不同平台。
