# 第四步 / 素材审核与复刻执行 brief

## 素材审核

### 已准备

- 锁定参考组：`references/locked/v2/`，共 5 张 PNG。
- 新观测台参考：`05-project-observatory-sales-copilot.png`，1586 × 992。
- 新观测台 SHA256：`CD1289BEA24245958AB643E5B232A0F969213DF7151DC7EF9B092B234E6AF636`。
- render contract：`docs/reference-production-plan-v2.md`。
- 四向审查：`docs/reference-review-v2.md`。
- 素材拆分：`docs/asset-split-v2.md`。

### 审核结论

- 生产用 raster 素材：0。
- 全部已批准视觉可以由 React、CSS、SVG 和 Lucide 高保真实现。
- 项目视频媒体：`replace-later`；首版不得出现假封面、假播放进度、假运行状态或不可复现结果。
- 参考图只作为 QA 基线，不会被裁切、转码或导入页面。
- 素材阻塞：无。
- Redesign-required：无。

## Hallmark 系统锁定

- Genre：`atmospheric`，但信息层级采用 evidence-first editorial 纪律。
- Theme：现有 custom deep-space evidence archive；继续使用深石墨、暖白和低饱和紫，不换主题。
- Marketing family：首页与作品页采用 `Marquee Hero / Spatial Canvas` 变体。
- App / case-study family：项目详情、Career 与关于我采用 `Workbench` 变体，每页拥有不同的语义图形。
- Content family：思考列表与文章采用 `Long Document` 变体，强调观点信号和阅读路径。
- Nav：保留现有 edge-aligned header，移除“实验室”，不改变 wordmark 与联系入口。
- Footer：保留现有轻量 footer，不新增多列导航。
- 动效原语上限：每页最多 3 类；只改变 `transform` 与 `opacity`，reduced-motion 停止空间运动。
- Hallmark pre-emit critique：Philosophy 5 / Hierarchy 5 / Execution 4 / Specificity 5 / Restraint 5 / Variety 5。

## 数据契约

### `Project`

- 新增 `icon: ProjectIconName`。
- 新增 `visualMode: ProjectVisualMode`。
- 新增可选 `demo?: ProjectDemo`。

`ProjectIconName` 固定为：

- `globe` → `Globe2`
- `target` → `Target`
- `book` → `BookOpenText`
- `shield` → `ShieldCheck`
- `table` → `TableProperties`
- `radio` → `Radio`
- `pen` → `PenLine`

`ProjectVisualMode` 固定为：

- `evidence-orbit`
- `routing-flow`
- `knowledge-system`
- `risk-gate`
- `schema-table`
- `broadcast-pulse`
- `editorial-audit`

`ProjectDemo` 仅包含：

- `src?: string`
- `poster?: string`
- `captions?: string`

字段为空时必须渲染“演示预留位 · 共创中”。

### 文章观点信号

为现有两篇文章补充结构化展示字段，不改文章正文：

- `conclusionType`：结论类型。
- `readingDirection`：阅读方向。

这些字段只从现有标题、摘要和文章结构提炼，不新增事实主张。

## 精确文件范围

### 创建

| 文件 | 职责 |
| --- | --- |
| `design.md` | 锁定全站字体、标题、间距、页面家族、动效语义和响应式边界 |
| `components/project-icon.tsx` | 集中映射 7 个 Lucide 项目图标 |
| `components/project-observatory.tsx` | 客户端章节观察、场景切换、ARIA 状态和移动端静态场景 |
| `components/career-trajectory.tsx` | 客户端职业轨迹推进与证据激活 |
| `components/notes-focus.tsx` | 客户端文章焦点与侧边观点信号 |
| `components/article-reader.tsx` | 阅读进度、当前章节和无位移的章节状态 |
| `components/capability-system.tsx` | 输入问题 → 方法 → 质量控制 → 交付沉淀系统图 |
| `components/metric-reveal.tsx` | 首页真实指标的一次性数字揭示 |

### 修改

| 文件 | 变更 |
| --- | --- |
| `tokens.css` | 增加五级流体标题、容器宽度、轨道时长和观测台 token |
| `app/globals.css` | 实现响应式标题、宇宙、观测台、Career、文章与能力系统样式 |
| `package.json` | 仅新增 `lucide-react` |
| `pnpm-lock.yaml` | 由依赖安装同步更新 |
| `lib/site-data.ts` | 扩展 `Project`、7 项目图标/visualMode、空 demo 接口和文章观点信号 |
| `components/site-header.tsx` | 从公开导航移除“实验室” |
| `app/lab/page.tsx` | 保留文件，改为服务端 `redirect("/work")` |
| `components/project-universe.tsx` | 改为客户端整盘巡航/拖动/惯性/键盘控制；48rem 以下静态卡片 |
| `app/page.tsx` | 接入 180 秒首页宇宙与一次指标揭示 |
| `app/work/page.tsx` | 接入作品宇宙说明和可访问控制提示，不改变项目 URL |
| `components/demo-slot.tsx` | 接受 `ProjectDemo`，实现 62rem 内 16:9 紧凑视频槽与空状态 |
| `components/project-detail.tsx` | 84rem 项目页、紧凑双栏 mast、视频槽、观测台与行动区 |
| `app/career/page.tsx` | 用 `CareerTrajectory` 替换静态经历列表 |
| `app/notes/page.tsx` | 用 `NotesFocus` 替换普通文章卡片列表 |
| `components/markdown-article.tsx` | 为二级标题生成稳定锚点，并交给 `ArticleReader` 管理阅读状态 |
| `app/notes/[slug]/page.tsx` | 传递文章元信息和章节状态所需属性 |
| `app/profile/page.tsx` | 用 `CapabilitySystem` 替换独立能力卡片堆 |
| `.hallmark/log.json` | 追加一次 `scope: "app"` 的全站重构记录 |
| `docs/restoration-plan.md` | 更新为 v2 section 拓扑、来源与实现映射 |
| `docs/fidelity-ledger.md` | 逐页面记录参考/渲染差异与修复 |
| `docs/fresh-review.md` | 写入最终逐页面视觉审查 |
| `docs/identity-evidence.json` | 写入三视口截图、门禁结果与最终状态 |

### 删除

无。实验室路由文件、现有内容文件、简历和 v1 参考图全部保留。

## 组件与行为边界

### 响应式标题系统

- `--text-display-xl: clamp(3.25rem, 8vw, 7rem)`
- `--text-page-title: clamp(2.75rem, 5vw, 5.25rem)`
- `--text-project-title: clamp(2.5rem, 4.5vw, 5rem)`
- `--text-section-title: clamp(1.75rem, 3vw, 2.75rem)`
- `--text-card-title: clamp(1.25rem, 1.7vw, 1.9rem)`

全部 `h1/h2` 使用 `text-wrap: balance`、`min-width: 0` 和 `overflow-wrap: anywhere`。Career 标题在 960px 以上单行，小屏自然两行。根元素使用 `overflow-x: clip`。

### 项目宇宙

- `/work` 150 秒一圈，首页 180 秒一圈。
- 拖动阈值 6px；整盘拖动；轻微惯性；停止 1.2 秒恢复。
- hover、focus、drag、页面隐藏和离开视口时暂停。
- 左右键每次旋转 12°。
- 48rem 以下关闭巡航、拖动和惯性，改为纵向项目卡片。
- 链接激活仅在拖动距离未超过阈值时发生。

### 项目观测台

- 左侧 sticky 场景最大约 30rem；右侧叙事最大约 34rem。
- 只激活当前章节；章节变化由 `IntersectionObserver` 驱动。
- 六个场景分别实现 signal、lens、flow、gate、stack、branch，不复用同一大方框。
- 当前场景通过 `aria-live="polite"` 和 `aria-current` 表达；视觉动画不承担唯一信息。
- 移动端取消 sticky，每段显示自己的静态图。

### 其他页面

- Career：进入视口的经历推进轨道并激活真实事实；非当前经历保持低对比。
- 思考列表：阅读焦点更新主题、结论类型与阅读方向；不做卡片放大。
- 文章页：顶部阅读进度和当前章节；正文不逐段飞入。
- 关于我：能力内容重新归并为四层系统，不删除现有五项能力事实。

## 分切片实施顺序

1. `design.md`、`tokens.css`、全局标题、导航和 `/lab` 重定向。
2. `/work` 项目宇宙；完成鼠标、触摸、键盘和移动端验收后再改首页。
3. 首页三项目宇宙与指标揭示。
4. Sales Copilot 项目详情 mast、视频槽和观测台；对照 v2 参考图验收。
5. 将同一观测台数据契约推广到其余六个项目，不共享项目专属内容结论。
6. Career 轨迹。
7. 思考列表观点信号。
8. 两篇文章阅读状态。
9. 关于我能力系统。
10. 全路由回归、保真账本和 Identity 证据。

每个切片先实现，再在浏览器验收；未通过的切片不会被标记完成，也不会把问题留到全站末尾。

## 验证矩阵

- 标题宽度：320、375、414、768、960、1280、1440、1920px。
- 关键视觉截图：desktop 1440×900、ultrawide 1920×1080、mobile 390×844。
- 路由：`/`、`/work`、7 个项目详情、`/career`、`/notes`、2 篇文章、`/profile`、`/lab`。
- 交互：鼠标拖动、触摸拖动、键盘左右键、drag-link 阈值、暂停/恢复、章节观察、reduced-motion。
- 技术：`pnpm lint`、`pnpm build`、控制台错误检查。
- 保真：同时使用 `view_image` 检查锁定参考和最新浏览器截图；记录至少文案、布局、排版、配色、图标、间距、响应式和动效八项。
- 最终证据：运行 Identity Skill `verify_identity_run.py`；缺证据时保持 `not verified`。

## 明确不做

- 不制作项目视频、配音或虚拟对话。
- 不接在线 Agent、API 或实时模型结果。
- 不新增实验室公开入口。
- 不新增 WebGL、GSAP、Framer Motion、Lenis 或重型依赖。
- 不新增自定义光标、装饰性视差、假 KPI、假计时或未标记模拟数据。
- 不改变现有项目 URL、文章正文、经历事实、联系方式或简历文件。

## 代码入口条件

参考图已确认，素材拆分已确认，所有必需素材均为 `code-native` 或明确的 `replace-later`。本 brief 获用户接受后，即满足代码实现入口条件。

