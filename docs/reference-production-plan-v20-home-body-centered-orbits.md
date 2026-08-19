# v20 首页人物中心三环公转参考计划

## 当前状态

- Section：`home-hero`
- 状态：`locked / implemented`
- 构图参考：`references/locked/v20/01-home-body-centered-concept.png`
- 构图参考 SHA-256：`CC5E37F055E1EC2837E0C92AF2AE579B27D2D0DE2A78D80F3988AB0D7B298A24`
- Ambient 人物：`references/locked/v20/yifan-avatar-v4-ambient.png`
- Reveal 人物：`references/locked/v20/yifan-avatar-v5-reveal.png`
- 人物素材继承 v19 锁定版本，SHA-256 未变化。

用户明确要求继续使用已锁定人物；本轮参考图只锁定“人物作为共同引力中心、三条轨道围绕胸腹、四项目分布于人物四周”的空间关系，不替换人物脸型、服装、姿势、比例来源或 V4 / V5 双态策略。

## Render contract

- `THREE_SECOND_MESSAGE`：人物代表能力主体，四个项目是围绕主体运行的真实能力证明。
- `PRIMARY_FOCAL_POINT`：姓名与职业定位。
- `SECONDARY_ANCHOR`：固定人物与四项目人体中心三环公转体。
- `READING_PATH`：姓名 / 定位 → 能力闭环 → CTA → 四项目 → 人物发现。
- `GRAVITY_CENTER`：右侧画布 `x 55% / y 54%`，对应人物胸腹区域。
- `ORBIT_PLANES`：三条固定、不同法向的真实轨道；项目只沿绑定轨道连续运行。
- `PROJECT_DISTRIBUTION`：初始状态为左上、右上、左下、右下；拖动后允许真实交会，但不得瞬移或脱离轨道。
- `DEPTH_RULE`：同一时刻最多一颗项目进入人物前层；其余项目在人物后层或侧景。
- `FACE_SAFETY`：进入面部椭圆区的项目与高亮轨道切入人物后层，由 RGBA Alpha 自然遮挡；不改坐标、不隐藏项目。
- `AVATAR_RULE`：V4 / V5 使用同一固定边界框；仅透明度切换，禁止位移、缩放和指针视差。
- `RESPONSIVE_RULE`：48rem 以下回退为静态纵向项目列表；人物仅作低透明背景。
- `REDUCED_MOTION_RULE`：停止巡航、惯性和 Reveal 跟随；内容与链接保持完整。

## 技术实现结论

- React DOM + CSS + SVG，无 WebGL、Three.js 或 Framer Motion。
- 三条 SVG 轨道与四个项目共享同一数学中心和同一组轨道基向量。
- 项目相位连续累计，不在 `±180°` 处重置，避免不同轴权重造成单帧跳变。
- 前后轨道按真实 `z` 深度分段；面部安全区内的前段被重分配到人物后层。
- 初始相位分别对应四象限，且三条轨道均有真实项目占用。
- 未加载动画时使用四象限静态回退位置，避免四个链接短暂堆叠在中心。

## QA 证据

- 静态：`references/qa/v20/home-desktop-idle.png`、`home-desktop-reveal.png`、`home-ultrawide-reveal.png`、`home-mobile.png`。
- 运动：`references/qa/v19/motion-body-centered-v20-final.json` 及 horizontal / vertical / diagonal / reverse-flick 姿态截图。
- 1440×900 帧节奏：中位 `16.7ms`，P95 `16.8ms`，0 帧超过 `25ms`。
- 巡航四项目最小球心距离 `203.712px`；常规拖动最大单步小于 `7.7px`，无非手势导致的瞬移。
- 1672、2200 与 390px 均无水平溢出；真实项目点击进入 `/work/global-opinion`。

