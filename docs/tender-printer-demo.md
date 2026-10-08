# 招投标公告：卡通打印机体验

## 简单操作

拖动公告到进纸口 → 点击机身绿色键 → 纸张滑出并停在托盘上 → 点纸张查看字段。点结果字段，高亮原公告对应句子并解释提取或留空原因。默认显示五个例子，完整 29 字段按需展开。键盘 Enter 保留等价放纸路径，普通点击不会自动进纸。

拖动时人物起身伸手引导、猫抬头伸爪；完成时人物站着拿结果。所有状态按透明素材中的实际接触点校准落地，提前载入并短暂淡入切换。提示气泡移到机身下方，避免被打印机遮挡。

出纸使用与原打印机托盘一致的 SVG 仿射平面：纸张从纸槽向右下滑动，沿同一透视方向停稳。纸槽遮罩逐步露出固定形状纸张，不拉伸，也不自动飞到右侧；纸张停留直到访客主动点开阅读区，打开后仍保留在托盘上。计时和拖动滚屏在重播或卸载时清理；缩放窗口保持当前阅读状态。减少动态效果时直接切换并依次交接进纸、打印、查看纸张和字段的键盘焦点。

演示公告完全虚构，字段是预设结果；不上传文件，不调用采集或清洗服务，不提供虚构成果下载。视频、技术证据、原路由和 GitHub 入口保留。

## 仓库依据

核对本地同名仓库 `scripts/tender_clean.py` 的 FIELDS 和 `references/29-fields.md`：使用实际 29 个字段名和顺序，正文优先、缺失留空，标书费不当作预算，招标公告不推断中标人。GitHub URL 本轮读取返回 404，事实核对来自 origin 与该链接相同的本地仓库，未声称完成公开仓库验证。

## 打印机素材

沿用用户给出的工作室灰色打印机外形：后方进纸、前方出纸。使用内置 Imagegen，保存于 `public/world/tender-printer-gray-v2.webp`。1536×1024，RGBA，转换 WebP 时保留尺寸与透明通道；纸张由网页渲染，方便独立进出纸。

最终提示词：

> Use case: background-extraction / precise-object-edit. Asset: transparent 2D cartoon sprite for an interactive personal portfolio. Input image is a REFERENCE for the exact printer model and perspective; ignore the popup, table, plants, globe and all surroundings. Recreate ONLY the compact dark warm-gray rectangular printer shown at the bottom of the reference, with its rear upright paper support, slightly sloped broad top, thin inset seams, front output slot and front low extended receiving tray. Match the hand-drawn dark outlines, warm muted gray cel shading and three-quarter view (front and left side visible). Remove all paper sheets from the input support and output tray so web-rendered papers can animate independently. One small muted green rectangular physical print key on the upper-right corner of the top surface; keep it modest. Fully transparent background, clean alpha edges, no cast shadow beyond small contact shadow under machine, no text, labels, people, furniture or logos. Entire machine visible, centered with 10% transparent padding; crisp consistent linework, not photorealistic.

## 验证记录

2026-09-30 出纸体验再次修订：取消飞到阅读区的自动变形，纸张沿托盘透视滑出并等待主动查看。生产构建（含 TypeScript）和修改源码 ESLint 通过；打印机 11 项与 smoke 8 项共 19 项通过，覆盖纸张向右下移动、尺寸稳定、停稳后不会自动展开、窗口缩放保持状态、点击阅读、重播清理、键盘焦点交接及 320/390/768/1440px 昼夜布局。重新核对桌面和手机打印与托盘截图。

本轮新增站立引导、站立持纸、猫抬头伸爪三张透明素材，均为 1254×1254，保留原像素及 alpha 转为 WebP。保存路径及内置 Imagegen 的完整提示词见 `tender-printer-character-prompts.json`。

本轮拖拽修订验收：生产构建（含 TypeScript）、修改源码 ESLint 通过；打印机 11 项、smoke 8 项、工作室 6 项联合回归共 25 项通过。真实触屏按下/移动/松开、边缘自动滚屏、错误投放、Escape/blur/resize 取消、出纸几何尺寸稳定、交付阶段重播、键盘等价路径及 320/390/768/1440px 昼夜布局均包含在回归内。已重新检查拖动、打印、交付与手机截图；纸张由固定几何形状平移露出，人物与猫使用姿态图片切换，未声称制作骨骼动画。

已检查桌面与手机截图、打印键位置、字段原文对应、29 字段展开、费用排除、缺失留空、计时取消与重播、键盘焦点交接、减少动态效果及夜间文字可读性。截图位于 qa/tender-printer-*.png。

2026-09-30：TypeScript 检查、生产构建、源码范围 ESLint、7 个项目的视频与封面媒体检查通过。打印机专用 8 项回归全部通过；全球舆情、工作室、发布布局与 smoke 联合 35 项通过；其余通用项目交互 7 项通过。覆盖 320–1920px 页面布局。初次联合运行中的一个旧返回链接文案断言已按现有页面更新并在回归中通过。未将生成的 Playwright 报告脚本计入源码 lint 范围。
