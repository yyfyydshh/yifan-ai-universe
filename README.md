# 杨逸凡 AI Capability Universe

面向求职场景的个人作品站，用来展示 AI Skill、Agent 工作流、Vibe Coding 交付、产品运营实践和方法论文章。

## 当前范围

- 首页：个人定位、项目入口与真实工作指标；
- 项目宇宙：7 个项目的空间化桌面视图与移动端卡片视图；
- 项目详情：问题、判断、系统、可靠性、产物、复用和统一 Demo 预留位；
- 职业轨迹、实验室、思考、个人档案；
- 两篇已定稿文章；
- PDF 简历下载。

视频暂未制作。后续将根据具体 Skill 地址、真实输入和演示目标逐个共创，接入方式见 [`docs/video-co-creation.md`](docs/video-co-creation.md)。

## 本地运行

```bash
pnpm install
pnpm dev
```

生产验证：

```bash
pnpm lint
pnpm build
```

## 内容入口

- 项目数据：`lib/site-data.ts`
- 文章原稿：`content/notes/`
- 演示插槽：`components/demo-slot.tsx`
- 视觉 token：`tokens.css`
- 真实性与参考图映射：`docs/restoration-plan.md`
- 视频共创契约：`docs/video-co-creation.md`

## 技术栈

Next.js App Router、TypeScript、Tailwind CSS v4、CSS 原生动效。首版不依赖视频和 3D 库，便于快速部署与后续渐进增强。
