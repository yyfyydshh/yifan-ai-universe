# v3 素材拆分清单 — 三轴作品宇宙

## 首页首屏 / `home-hero`

交互假设：左侧身份与下方证据保持实时内容；右侧三项目球面可拖动、可点击、可键盘旋转，48rem 以下静态 restack。

总判断：生产用图片素材 0 个。三维空间、球面经纬线、项目球体、图标、文字、链接、焦点与运动全部可由代码高保真实现。

| 区域 | A 轴边界 | B 轴媒介 | C 轴层级 | 状态 | 裁决理由 |
| --- | --- | --- | --- | --- | --- |
| 三项目球面 | live-content + independent interaction | HTML/CSS perspective + SVG/Lucide | none | `code-native` | 项目必须独立点击、聚焦、reflow；全部图形属于简单球、线与 icon 白名单 |
| 深空纹理 | static-decor | 现有 CSS gradients/pattern | none | `code-native` | 不承载事实，也不需要新增 raster 才能保持已锁定气质 |
| 身份与证据 | live-content | HTML | none | `code-native` | 所有姓名、定位、CTA 与指标保持实时可访问 |

## 作品页 / `project-universe`

交互假设：七项目处于同一个三轴球面，近远关系随旋转变化；拖动阈值 6px，松手继承方向，移动端静态单列。

总判断：生产用图片素材 0 个。参考图只作为几何与层级基线，不裁切、不嵌入页面。

| 区域 | A 轴边界 | B 轴媒介 | C 轴层级 | 状态 | 裁决理由 |
| --- | --- | --- | --- | --- | --- |
| 七项目节点 | live-content + independent interaction | React + CSS transform + Lucide | none | `code-native` | 每个项目有独立链接、icon、深度、focus 与移动端重排 |
| 三轴球面骨架 | static-decor with semantic motion | CSS ring/meridian geometry | none | `code-native` | 弧线表达可旋转轴，不承载额外事实；无需 raster |
| 拖动方向提示 | live control affordance | HTML/CSS | none | `code-native` | 必须随输入模式和 reduced-motion 变化 |
| 背景星场 | static-decor | 现有 CSS pattern | none | `code-native` | 不新增随机粒子或生成素材 |

## 真实来源、替换与风险

- 项目名称、分类、URL 与语义图标来自 `lib/site-data.ts`，不得生成或烘焙进参考图。
- 没有头像、logo、产品截图或事实媒体需要 source/replace-later。
- 参考图中的空间材质不作为生产素材；不存在跨边界 raster fusion，也不存在 `redesign-required`。

