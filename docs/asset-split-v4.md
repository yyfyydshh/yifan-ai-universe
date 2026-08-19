# v4 素材拆分清单 — 全球舆情工作流讲解动效

锁定参考：`references/locked/v4/01-global-opinion-workflow-explainer.png`

## 交互假设

该 section 位于项目详情的简介与视频槽之后。进入视口时，证据路径只推进一次；随后用户可通过 hover、focus 或触摸聚焦单个阶段。质量门的两条分支表达条件规则，不显示虚构的当前运行结果。移动端改为纵向证据链。`prefers-reduced-motion` 下直接显示完整路径与条件分支。

## 总判断

当前生产用图片素材 0 个。整张讲解图均属于实时语义内容和简单几何，必须由代码高保真实现。未来项目视频是 1 个独立媒体槽，当前状态为 `replace-later`；参考图本身不进入生产页面。

## Reference-to-build map

| 可见区域 | A 轴边界 | B 轴媒介 | C 轴层级 | Owner / 状态 | 响应式与动效 | 裁决理由 |
| --- | --- | --- | --- | --- | --- | --- |
| 项目定位、典型输入、我的角色、状态 | `live-content` | HTML / CSS | none | code / `code-native` | 桌面三列，移动端单列；一次性淡入 | 全部是需要编辑、搜索和无障碍读取的事实文本 |
| 五步工作流 | `live-content + interaction` | React + SVG + Lucide | none | code / `code-native` | 桌面水平路径，移动端纵向路径；路径推进 | 节点、箭头、环和标准图标均在 code whitelist 内 |
| 正式报告质量门 | `live-content + state explanation` | HTML / SVG | none | code / `code-native` | 当前焦点可切换，但不模拟真实运行 | 100 / 5 / 2 是已确认事实，绝不能烘进图片或动画成假状态 |
| 条件分流 | `live-content` | HTML / SVG | none | code / `code-native` | 使用“若达到 / 若未达到”；reduced-motion 直接呈现 | 这是规则说明，不是当前通过/失败状态 |
| 交付物堆栈 | `live-content` | HTML / CSS + Lucide | none | code / `code-native` | 桌面右列，窄屏落到路径之后 | 文件名称、格式与说明需要真实、可维护和可访问 |
| 深空底纹 | `static-decor` | CSS radial gradients / tiny pattern | none | code / `code-native` | 固定低对比，不逐帧随机 | 不承载语义，现有 CSS 能高保真复现且无需新增 raster |
| 项目视频 | `independent-media` | video / poster source | `independent-media` | media / `replace-later` | 16:9；无视频时显示代码占位；不自动播放 | 后续案例、脚本和脱敏边界尚未共同确认，不能生成假演示 |

## Asset manifest

| Asset | Role | Placement | Reuse | Provenance | Aspect ratio | Responsive mode | Status | Final path |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `global-opinion-demo` | 真实案例演示视频及 poster | independent-media | section | 后续用户与 Codex 共创 | 16:9 | 宽度自适应，保持比例 | `replace-later` | `public/demos/global-opinion/` |

## Code-native 清单

- 所有标题、正文、阈值、状态说明、按钮与无障碍标签。
- 五个流程节点、连接路径、质量门、条件分支与文件堆栈。
- 进入视口的一次性路径推进、节点聚焦和 reduced-motion 静态状态。
- 全站既有深空背景、细规则线、焦点描边与流体标题系统。

## 真实来源 / Replace-later / 风险

- 视频不得使用生成的假业务结果冒充案例。后续先确认案例类型为真实、脱敏或明确标记的模拟案例。
- 视频 poster 必须来自最终分镜或真实输出，不从锁定参考图裁切。
- 参考图中绿色与红色只表达条件分支；实现文案统一改为“若达到 / 若未达到”，避免表现成当前运行状态。
- 不需要新生成背景、图标、流程图或文件 mock；为这些区域生成图片会降低可访问性和响应式质量。

## 当前结论

本 section 无需进行图片素材生成。用户确认本清单后，第四步只需整理 `code-native` / `replace-later` 状态，并提交复刻执行 brief；仍不会立刻编辑页面代码。
