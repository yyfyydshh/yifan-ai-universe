# v19 首页人物 × 三轴项目宇宙素材拆分

## 第一步 / 素材拆分清单

### 【首页 Hero】

交互假设：桌面端人物由 Cursor Reveal 显现，项目宇宙继续巡航、拖动和点击；人物与项目依据实时深度进入前后层。移动端关闭空间交互并保留静态人物暗影。

总判断：生产页面需要 2 个同构独立人物素材（V4 Ambient / V5 Reveal）；背景 / 融合场景 0 个。两张 v19 状态图只用于参考和 QA，不进入生产页面。

| ID | 图片层级 | 复用范围 | 状态 | 内容与边界 | 代码覆盖 | 裁决理由 |
| --- | --- | --- | --- | --- | --- | --- |
| `yifan-avatar-v4-ambient` | `independent-media` | `section` | `approved` | 用户确认的 V4 人物，仅用于默认低透明环境态；不含星空、轨道、项目或文字 | Ambient opacity、移动端静态透明度与 reduced-motion 由 CSS 负责 | 默认态必须弱于姓名和项目，且能与 V5 无位移切换 |
| `yifan-avatar-v5-reveal` | `independent-media` | `section` | `approved` | 用户确认的 V5 强 3D 人物，仅用于探索 / Reveal 状态；不含星空、轨道、项目或文字 | Cursor mask、透明度、视差、导航退暗与深度层级由 React / CSS 负责 | 实体态需更强体积光与材质，同时保持项目入口优先 |

Code-native：

- 姓名、岗位定位、价值主张、三段能力 rail、CTA、导航。
- 四个真实项目的圆形外壳、图标、标题、类别和链接。
- 三轴投影、自动巡航、拖动、惯性、键盘控制和点击抑制。
- 后景轨道、前景腰线、星点、Halo、Face Safe Zone 与碰撞控制。
- `idle / exploring / pressing / dragging / settling / project-hover / project-focus / navigating` 状态机。

真实来源 / 风险：

- 上游照片由用户提供；人物候选是风格化身份衍生物，只有用户明确批准后才转为生产 `source`。
- 当前圆脸候选为 `yifan-avatar-3d-roundface-alpha-candidate-v3.png`，1024×1536、`Format32bppArgb`；四角 Alpha 已核验为 0，深色背景检查无白边，是真透明而非棋盘格。
- 当前圆脸候选 SHA-256：`F50384AE2402BD4E54C0E8284EDE78E9D48C8EBDC3CFB9EC9B4996B6E091C924`。
- 1024px 宽度低于计划中的 1600px 宽度，但页面预计最大实际显示宽约 500–650px，现候选仍可覆盖约 1.5×–2× 像素密度。是否接受该偏差随素材审核一并确认。
- `yifan-avatar-3d-candidate.png` 是被拒绝的棋盘格烘焙版本，不得进入后续参考或生产。
- `yifan-avatar-3d-roundface-candidate.png`、`yifan-avatar-3d-roundface-alpha-candidate.png` 和 `yifan-avatar-3d-roundface-v2-candidate.png` 均为棋盘格烘焙的 RGB 中间稿；`yifan-avatar-3d-roundface-alpha-final-candidate.png` 因轮廓错位出现白边，全部不得进入生产。
- 不得裁切两张 v19 页面参考图来获得人物，也不得把参考图中的星空、轨道或项目做成背景素材。

## 素材审核与复刻执行 brief

- 人物固定为右侧中景，桌面中心约 `x 72% / y 55%`，显示高度约 Hero 的 66%–70%。
- 默认人物近乎隐藏；Reveal 只改变人物 mask、opacity 与最多 6–10px 视差，不移动页面布局。
- 项目 hover/focus 始终压过人物显现；人物不接收 pointer，不成为独立 CTA。
- 同一时刻最多一颗项目球位于人物前景；面部安全区不可进入。
- 生产实现不得新增 WebGL、Framer Motion、假 KPI、无语义星球或项目说明卡。

当前状态：`implemented`。锁定媒体位于 `references/locked/v19/`，生产媒体位于 `public/media/home/`；项目球、星空、轨道、Reveal 与所有文案均保持 code-native。
