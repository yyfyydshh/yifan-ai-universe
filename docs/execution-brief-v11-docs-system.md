# 第三阶段 / 复刻执行 Brief：文档站工程总览

Status: `awaiting-user-confirmation`

## 范围

把文档站详情页从旧的“从零搭建 / 旧站迁移 / 日常维护”多行步骤控制台，替换为一张可操作的文档工程总览。主语义是完整搭建、技术底座、内容系统和后续维护，而非具体 CLI 版本更新。

## 代码改动

- 新建 `components/docs-system-blueprint.tsx`。
- `components/project-case-study.tsx` 将文档站 visual kind 路由到新组件。
- `lib/site-data.ts` 为文档站更换为工程总览数据接口和经确认文案。
- `app/globals.css` 新增受 `docs-blueprint-*` 命名空间保护的桌面 / 移动端样式。
- 旧 `DocsRouteCaseStudy` 不服务该项目页面；其他项目不修改。

## 交互

- “完整搭建”与“便捷维护”是可访问 tab，不是装饰按钮。
- 模式切换更新路径高亮、右栏深度说明和当前技术关系；不触发假运行过程。
- 真实文档站与公开 SOP 均为明确外链。

## 回退

实现前备份 `lib/site-data.ts`、`components/project-case-study.tsx`、`app/globals.css` 与旧文档站组件到 `.showcase-runs/yifan-ai-universe/docs-site/backups/pre-v11/`。回退仅恢复这些文件、删除新组件，不触碰其他项目或视频。

## 验收

需要通过宽度、键盘、reduced-motion、外链、lint、production build 和本地浏览器检查。实现和 QA 结束前，`docs/identity-evidence.json` 里的 v11 条目保持 `not verified`。
