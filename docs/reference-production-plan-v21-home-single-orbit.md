# v21 首页人物中心单轴公转参考计划

## 当前状态

- Section：`home-hero`
- 状态：`user-directed correction / implemented / verified`
- 用户锁定方向：取消三轴与三环，改为人物中心的一条斜向公转轨道；加入近大远小；全部项目信息不得截断。
- 锁定校准图：`references/locked/v21/04-user-approved-single-orbit-reference.png`
- 校准图 SHA-256：`CC5E37F055E1EC2837E0C92AF2AE579B27D2D0DE2A78D80F3988AB0D7B298A24`
- Ambient 人物：`public/media/home/yifan-avatar-v4-ambient.png`
- Reveal 人物：`public/media/home/yifan-avatar-v5-reveal.png`

本轮是用户对已实现 v20 几何结构的直接纠偏。v20 的人物资产、左右信息层级与深空视觉继续有效；“三条轨道 / 三轴拖动”被标记为历史方向，不再作为首页空间目标。没有生成、裁切或替换人物素材。

## Render contract

- `THREE_SECOND_MESSAGE`：人物是能力主体，四个真实项目沿同一条斜向轨道持续公转。
- `PRIMARY_FOCAL_POINT`：姓名与职业定位。
- `SECONDARY_ANCHOR`：固定人物与单轴项目环。
- `READING_PATH`：姓名 / 定位 → 能力闭环 → CTA → 四项目 → 人物发现。
- `GRAVITY_CENTER`：右侧画布 `x 55% / y 50%`；轨道环绕人物胸腹与腰部，不经过面部。
- `ORBIT_RULE`：四项目只共享一个相位状态；项目相对相位固定，拖动只改变共同相位和后续巡航方向。
- `PERSPECTIVE_RULE`：同一轨道 Z 值同时驱动投影、尺度、透明度和层级；后半圈项目位于人物下层，前半圈项目位于人物上层。远景位于人物上方、近景位于腰部两侧，近远尺度不依赖项目类型。
- `CONTENT_RULE`：每颗球在全部采样角度均完整显示语义图标、项目编号 / 类别、完整短标题与“查看项目”；不得使用行数截断或隐藏入口。
- `AVATAR_RULE`：V4 / V5 使用同一固定边界框；仅透明度切换，禁止位移、缩放和指针视差。
- `IDLE_DENSITY_RULE`：人物透明态的四颗项目球使用接近等距的均衡相位，并比实体态连续放大约 15%；最右侧项目保留安全边距，轨道带维持更清楚的基线亮度，人物显现后回到标准项目尺寸，避免透明人物留下无语义空洞。
- `ORBIT_VISUAL_RULE`：首页隐藏 SpaceField 的无关装饰轨道；中央主轨承载四项目，另用两条同平面回声线组成一个斜向轨道带。三条线共享中心、倾角、深度分层与共同相位，不能成为三条独立运动轴。
- `RESPONSIVE_RULE`：48rem 以下回退为静态纵向项目列表；人物仅作低透明背景。
- `REDUCED_MOTION_RULE`：停止巡航、惯性和 Reveal 跟随；内容与链接保持完整。

## QA 证据

- 静态：`references/qa/v21/home-desktop-idle.png`、`home-desktop-reveal.png`、`home-ultrawide-reveal.png`、`home-mobile.png`。
- 几何与内容：`references/qa/v21/single-orbit-geometry.json`。
- 运动：`references/qa/v21/motion-single-orbit-v21-final.json` 及 horizontal / vertical / diagonal / reverse-flick 姿态截图。
- 30 个键盘角度样本：单轨带前后各三条同平面路径、人物边界框零位移、每颗项目按真实 Z 值进入前半圈或后半圈且不受数量配额改写、全部内容在球体边界内、无控制台错误。
- 帧节奏：1440×900 目标为中位约 `16.7ms`、P95 约 `16.8ms`、无超过 `25ms` 的动画帧。

## 回退范围

- `components/project-universe.tsx`
- `app/globals.css`
- `design.md`
- `scripts/capture-home-qa.mjs`
- `scripts/qa-home-motion.mjs`
- `scripts/qa-home-single-orbit.mjs`
- v21 证据文档

不触碰 V4 / V5 人物媒体、项目数据、详情页、视频、文章、Career 或作品页球面宇宙。
