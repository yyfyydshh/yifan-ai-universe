# 第一批项目详情页开发暂停点

记录时间：2026-08-15

## 当前状态

第一批参考图、参考图锁定、素材拆分和执行简报已经完成；第一批代码已进入实现阶段，但尚未完成 CSS、构建与浏览器验收。当前代码是开发中间态，不应视为可交付版本。

## 已完成

- 已锁定 v5 参考图：
  - `references/locked/v5/01-sales-decision-routing.png`
  - `references/locked/v5/02-docs-three-route-console.png`
  - `references/locked/v5/03-regulatory-applicability-desk.png`
- 已完成 Identity Skill 文档：
  - `docs/reference-production-plan-v5.md`
  - `docs/reference-review-v5.md`
  - `docs/asset-split-v5.md`
  - `docs/execution-brief-v5.md`
  - `docs/identity-evidence.json` 已建立 v5 待验收清单
- 已扩展 `lib/site-data.ts`：
  - 新增统一 `ProjectCaseStudy` 判别联合类型。
  - 全球舆情由 `evidence` 迁移为 `caseStudy`，保持原有交互语义。
  - Sales Copilot、文档站、金融监管已补充阶段、机制、证据产物、决策边界和来源状态。
- 已新增第一批交互组件：
  - `components/project-case-study.tsx`
  - `components/case-study-shared.tsx`
  - `components/sales-decision-case-study.tsx`
  - `components/docs-route-case-study.tsx`
  - `components/regulatory-case-study.tsx`
- `components/project-detail.tsx` 已改为根据 `caseStudy.visualKind` 路由项目专属界面。

## 当前交互设计

### Sales Copilot

- “信息充分 / 信息不足”机制切换。
- 事实、假设、未知三层账本。
- 七阶段方案路由；信息不足时只允许走到关键追问，不生成画像或评分。
- 右侧深度说明随阶段同步变化。

### Mintlify 文档站 SOP

- 从零搭建、旧站迁移、日常维护三条路径切换。
- 每条路径有独立阶段、目的、机制、证据产物和停止条件。
- 显式区分“本地可预览、线上已验收、正式可发布”。
- 已说明公开仓库是 SOP，不是八爪鱼生产站源码。

### 金融监管风险监测

- 八阶段证据流程导航。
- 地域、主体、业务活动、时间四轴适用性矩阵，可切换匹配状态。
- 全文审阅、证据覆盖、报告校验和投递防重四个阻断门。
- 显式说明处罚记录不等于目标企业违法，也不构成法律意见。

## 尚未完成，恢复后从这里开始

1. 为新增组件补充 `app/globals.css` 的 v5 样式和响应式规则。
2. 立即运行 TypeScript / lint，修复中间态可能存在的类型、导入或 JSX 问题。
3. 运行生产构建，确认全球舆情旧页没有因 `evidence → caseStudy` 迁移而回归。
4. 启动本地预览，逐页检查：
   - `/work/sales-copilot`
   - `/work/docs-system`
   - `/work/regulatory-risk`
   - `/work/global-opinion`
5. 完成 390、1280、1920px 三视口截图和交互验收，更新 `docs/identity-evidence.json`。
6. 第一批通过后，再生成第二批三个项目的参考图，不提前实现第二批。

## 重要提醒

- 当前尚未运行 lint 或生产构建。
- 新组件尚无对应 CSS，因此现在打开页面可能出现未排版内容。
- 不要删除全球舆情旧组件；它已由统一路由继续复用。
- 不制作项目视频，继续保留“案例共创中”的标准接口。
- 第一批校准完成前，不进入招投标、热点快报和 Humanizer 的代码阶段。
