# Portfolio (Next.js + Tailwind + Markdown Blog)

## 简介 / Overview
- 一个基于 **Next.js 14 App Router** 的双模式（GUI / Terminal）个人主页与博客。
- Tailwind CSS 驱动的界面，保留原有动画与多语言切换（中/英）。
- 博客内容来自根目录 `posts/` 下的 Markdown 文件（静态生成），可在构建期自动解析 frontmatter 与正文。
- 内置 Docker 多阶段构建与 GitHub Actions CI（lint/test/build）。

## 技术栈 / Tech Stack
- Next.js 14 (App Router, SSG)
- React 18 + TypeScript
- Tailwind CSS + @tailwindcss/typography
- Markdown 解析：gray-matter + remark + remark-html
- Docker (multi-stage, node:20-alpine)
- GitHub Actions CI

## 目录结构 / Project Structure
```
.
├─ posts/                 # Markdown 博客源文件（slug.md）
├─ public/                # 静态资源
├─ src/
│  ├─ app/                # App Router 入口
│  │  ├─ blog/[slug]/     # 博客详情页
│  │  ├─ globals.css      # Tailwind 全局样式与动画
│  │  └─ page.tsx         # 首页 (GUI/Terminal 单页)
│  ├─ components/         # UI 组件拆分（Navbar/Hero/Blog 等）
│  ├─ data/               # 固定文案与导航文案 (中/英)
│  ├─ lib/markdown.ts     # Markdown 解析、读取、静态生成工具
│  └─ types/              # 基础类型 (Mode/View)
├─ next.config.mjs        # Next.js 配置 (standalone 输出)
├─ tailwind.config.js     # Tailwind 配置
├─ postcss.config.js      # PostCSS 配置
├─ tsconfig.json          # TypeScript 配置
├─ Dockerfile             # 多阶段构建镜像
├─ .dockerignore
├─ .gitignore
└─ .github/workflows/ci.yml
```

## 本地开发 / Local Development
1. 安装 Node.js 18.18+。
2. 安装依赖：`npm install`（使用 npm，也可自行改用 pnpm/yarn，但 CI/Docker 默认 npm）。
3. 开发启动：`npm run dev`，访问 http://localhost:3000。

## 构建与运行 / Build & Run
- 生产构建：`npm run build`
- 启动生产：`npm start`

## Docker 使用 / Docker Usage
```bash
docker build -t my-portfolio .
docker run -p 3000:3000 my-portfolio
```
可选 docker-compose 示例：
```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
```

## Markdown 博客说明 / Markdown Blog Guide
- 目录：`posts/`
- 文件命名：`<slug>.md` 对应路由 `/blog/<slug>`。
- Frontmatter 示例：
  ```markdown
  ---
  title: "我的第一篇博客"
  date: "2024-01-01"
  lang: "zh"        # 当前语言 (zh/en)，列表会按语言过滤
  summary: "一句话摘要"
  tags: ["nextjs", "portfolio"]
  ---
  正文内容支持 Markdown 语法（段落、列表、代码块等）。
  ```
- 新增/修改文章：
  1) 在 `posts/` 下新增 `<slug>.md`，写好 frontmatter 与正文。
  2) 构建时自动解析，无需改代码。
  3) 博客列表会按 `date` 倒序展示，并按 `lang` 过滤当前语言。

## CI / GitHub Actions
- 触发：`main` 分支的 push 与 pull_request。
- 步骤：Checkout → setup-node@v4 (Node 20, npm cache) → `npm install` → `npm run lint` → `npm test` → `npm run build`。
- 可选：工作流内已附带注释示例，可将构建好的镜像推送到 GHCR。

## 脚本 / Scripts
- `npm run dev`：开发模式
- `npm run build`：生产构建
- `npm start`：生产启动
- `npm run lint`：ESLint (next/core-web-vitals)
- `npm test`：当前占位（可替换为实际测试）

## 架构与实现要点 / Notes
- 使用 App Router 与静态生成：`app/page.tsx` 拉取 Markdown 数据后交给客户端组件 `PortfolioPage`，在前端保持 GUI/Terminal 双模式与多语言状态机。
- 博客详情页：`app/blog/[slug]/page.tsx` 静态生成，使用 frontmatter `title/summary` 作为 SEO `title/description`。
- Tailwind 动画：在 `globals.css` 中复刻了原有 `animate-in / fade-in / slide-in` 等效果与终端光标动画。
- Docker 采用多阶段构建，产出 `next build` 结果后用 `next start` 运行。
