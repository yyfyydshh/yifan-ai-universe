# v19 首页人物 × 三轴项目宇宙参考计划

## 当前状态

- Section：`home-hero`
- 状态：`locked / implemented`
- Idle 候选：`references/candidates/v19/01-home-idle.png`
- Idle SHA-256：`F6AE79AEEB9AD399F7D23D8865AB7D6D960BD51547E9D72CEBD7CE05FB8736DE`
- Reveal 候选：`references/candidates/v19/02-home-reveal-roundface.png`
- Reveal SHA-256：`AD26B85A73321D71B8098F47D6DD20E517847B4AAF20C923279F693A28AF5298`
- Ambient 人物：`references/locked/v19/yifan-avatar-v4-ambient.png`
- Ambient SHA-256：`6481F9006258110FDAD619507381EF588B7709871F792388CFB8F3A51449DC84`
- Reveal 人物：`references/locked/v19/yifan-avatar-v5-reveal.png`
- Reveal SHA-256：`63C3CC927E8BF1DC05B2391F0E927758B8265016FA85F9FFDDA5CD7CC11D1FB6`
- 上游真实来源：用户提供 `f5f9fb41a684d41929857ccd848012fd.jpg`。

用户最终确认双素材策略：低透明状态使用 V4，实体显现状态使用 3D 质感更强的 V5。两张素材均由深蓝背景源图重新分割为真实 RGBA，四角 Alpha 为 0；V4/V5 保持同一低头、叉腰、白色 T 恤与项链轮廓，避免状态切换时发生姿势漂移。

## 参考组合依据

- 采用用户图 1 的四项目构图、文字可读性、左右信息分工和人物位置。
- 采用用户图 2 的低亮度人物、深空纵深和隐藏感；删除无语义的大型前景星球。
- Idle 与 Reveal 使用同一个人物轮廓和同一组页面信息，避免状态切换时身份、比例和结构漂移。
- 四颗项目球保持同权重，视觉直径相对现站目标放大约 14%–16%；任何状态最多一颗进入人物前景。

## Render contract

- `THREE_SECOND_MESSAGE`：杨逸凡把业务问题封装成可运行、可验证、可复用的 AI 能力；四个项目是证明。
- `PRIMARY_FOCAL_POINT`：姓名与角色定位。
- `SECONDARY_ANCHOR`：四项目三轴宇宙。
- `TERTIARY_DISCOVERY`：默认隐藏、由指针揭示的 3D 卡通人物。
- `READING_PATH`：姓名 / 定位 → 价值主张 / 能力 rail → CTA → 四项目 → 人物发现。
- `IDLE_STATE`：人物约 2.5% 感知可见度，只保留暗轮廓；项目与文字优先。
- `REVEAL_STATE`：人物最高约 72% 感知可见度；面部不被项目或高亮轨道遮挡。
- `DEPTH_RULE`：后景项目可被肩膀或手臂遮挡；前景项目最多一颗，只能经过可牺牲的衣服或下臂区域。
- `SIGNATURE_ORBIT`：一条轨道从后景进入，在腰部 / 下胸安全区转到前景；其余轨道保持低对比。
- `EXCLUSION_ZONE`：人物面部相对人物框 `x 35%–65% / y 5%–38%`；任何前景大球、项目文字、强光点和高亮轨道禁止进入。
- `RESPONSIVE_RULE`：48rem 以下为静态单列项目；人物约 12% 静态可见，不启用 Cursor Reveal 或拖动。
- `REDUCED_MOTION_RULE`：停止巡航、惯性、Reveal 跟随和人物视差；人物约 15% 静态显示。

## 技术适配结论

- 现站的项目宇宙是 React + DOM + CSS 三维投影，不是 Three.js/R3F。
- 用户确认采用混合深度分层，不引入 WebGL 重构。
- 项目球继续是可访问的真实链接；`OrbitLayout.depth` 决定前后层级。
- 人物是独立透明媒体，轨道拆为后景层和受控前景弧线；所有页面文字和项目事实保持 code-native。
- v19.3 运动校正：四颗球使用一个归一化四元数姿态；每颗球的可见轨道由其当前三维位置和当前旋转轴实时计算。轨道不再与球体分别变形，屏幕空间碰撞推开、人物避让改坐标和硬边界夹取全部退出首页运动链。
- 横向输入保持主要公转权重；纵向与 roll 使用受限权重，既保留三轴方向，又避免一次纵拖把四项目压成同一投影线。松手角速度有上限并以无回弹曲线衰减到巡航速度。

## 参考审查

- 视觉意义：姓名、能力定位、四项目和人物发现均有明确职责；无新增指标和虚构状态。
- 构图：左栏保持完整安全区；右栏四项目没有聚集到同一侧；未使用无语义大前景球填空。
- 遮挡：Reveal 候选展示腰部前景轨道；舆情项目靠近左肩形成后景关系，生产实现须以实时 depth 而非固定截图复现。
- 可实施性：参考图中的导航、文字、项目球、轨道和星空均不作为生产图片使用。
- 当前结论：`implemented`。用户已确认 V4 Ambient / V5 Reveal 双素材，锁定参考与生产媒体均采用版本化路径；视觉、交互与响应式证据进入 v19 QA。
- 运动证据：`references/qa/v19/motion-quaternion-v3.json`、`motion-final-960.json`、`motion-final-1920.json` 与 `interaction-final.json`；覆盖横拖、纵拖、斜拖、反向甩动、惯性、巡航、键盘、点击、reduced-motion 和五档响应式。
