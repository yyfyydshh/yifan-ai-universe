# 杨逸凡的世界 · world-v1 执行记录
> 历史计划：后续迭代以 world-restoration-plan-v2.md 为准，包含连续底板、统一密度、一体房间与新的动作/导览规则。

## 授权与来源

用户已确认完整七区个人世界、依据五张参考图生成缺件、内容逐步上架，并明确要求实施修订计划。阶段审查由本轮执行完成后继续，不重复请求已授权的范围。原有作品、文章、简历、联系方式为事实来源；设定板上的数字、文案与小型UI仅为设计参考。

来源基线：references/locked/world-v1/01-world.png 至 05-character.png，复制保留原始文件，不覆盖。构图依01；区域建筑依02下方拆解；组件依据03简化；流程依据04修正为七区；人物依据05及02中的真实照片。

## Style fingerprint

- Name: 杨逸凡的世界 / YIFAN’S WORLD。
- Intent: 可探索的个人创作岛；首屏是本人和猫，区域第二层，物件第三层。
- Palette: sky #D8EDF6, paper #FFFDF5, paper-soft #F4F0E5, ink #253C3B, secondary #5D7067, green #47745C, wood #B88956, edge #D7D9C9, focus #27627B.
- Type: 标题采用中文楷体/衬线气质；导航、正文使用项目中文无衬线栈；代码与JSON保持等宽。
- UI: 1px细边框、8-16px轻圆角、轻纸面阴影，图标使用现有Lucide，文字和控件始终为DOM。
- Layout: desktop画布/独立内容页；mobile纵向插画路径。48rem以下或粗指针回退到DOM旅程。
- Motion: transform/opacity；reduced-motion关闭惯性、环境循环、视差；普通控件不会大幅弹跳。
- Identity: 短黑发、略圆自然脸型、宽松白T、橄榄工装裤、运动鞋、项链；奶牛猫圆润无衣服。

## Render contracts

| Slice | 三秒信息/主焦点 | 结构、留白与排除区 | 代码与图像归属 | Responsive |
|---|---|---|---|---|
| world-home | 杨逸凡的创作世界；中央人物 | 七区围绕连续山体；上左标题天空留白；人物脸和标牌独立安全区 | C3，用户批准的多层互动例外：背景、岛、七建筑、人物、猫、物件独立；DOM标题与标牌 | mobile改为人物引言+七区纵向旅程，不缩小桌面 |
| zone-preview | 这个区域是什么，可去哪里 | 右侧纸面面板，单一标题、摘要、状态、进入链接；不遮主导航 | C2，复用区域建筑；其余code-native | bottom/dialog适配小屏，Escape退出 |
| quick-profile | 本人经历和联系路径 | 纸面dialog，简介→经历→简历与联系；头像安全区 | C2，复用人物及原QR；真实内容DOM | 单列，原生dialog焦点隔离 |
| work-index | 七个可深入的项目 | 左侧介绍及小型工作室插画，下方开放式项目列表 | C2，复用workshop；项目数据与链接DOM | 单列完整标题 |
| project-detail | 项目如何工作与交付 | 原项目事实层级，示例工作台→视频→方法证据；局部图表保持语义 | C0，已有真实视频独立媒体；新交互样例DOM | 保留内容，表格局部横向滚动 |
| writing/thoughts | 可阅读的已发布文字 | 纸面开放式列表，标题和摘要；按现有conclusionType分流 | C2，复用区域缩略建筑，其余DOM | 单列 |
| article | 专心读完文章 | 约760px正文，导航与章节不进入正文；17-18px/1.85 | C0，原Markdown正文完整 | 适应320px |
| waiting-zones | 区域已建，作品尚未上架 | 建筑插画、明确待更新状态与返回已有内容入口 | C2，复用区域素材；无虚构作品和播放器 | 单列 |
| career/profile | 可核实的经历与个人介绍 | 原有信息与语义关系，统一纸面视觉 | C0，真实内容保留 | 单列 |

## 素材拆分与生产顺序

1. 设计稿：desktop日间anchor；随后夜间、mobile、项目页、阅读页、预览与profile界面在同一设计系统下补齐。
2. 样板所需：sky/远山背景，岛屿完整底板，workshop建筑，人物idle/look两态，猫idle/awake两态，一个文件夹物件。
3. 样板验证通过后：writing、music、games、cinema、thinking、stuff建筑及scanner/laptop等物件。非交互微细节合并在建筑；独立交互物件不得出现在建筑底图上。
4. 原始PNG保存至references/drafts/world-v1，最终项目资产保存public/world；透明度必须来自生成工具；不以设定板小图裁切冒充生产素材。
5. 每个物件记录素材尺寸、锚点、热区、图层、区域、路由。岛屿、建筑和附着物共享camera变换。装饰不参与hit-testing。

## 行为与公共接口

- Zone: id/title/description/route/status/asset/position/signPosition/size。
- WorldAsset: path/width/height/anchor/role/loadingGroup/source。
- InteractiveObject: id/zoneId/asset/position/size/interaction/previewKey/route。
- Camera帧状态在运行时更新，Zustand只管理主题、活动区域、预览、帮助与离散动作。
- 6px drag threshold；物件拖动锁camera；pointercancel、window blur释放；失去捕获后无click。
- 默认中心能看到人物与至少3个区域，zoom范围为基础比例的0.88–1.12；导航和复位确定性定位。
- 示例为固定演示样本，不接服务。Sales客户文件→电脑，Tender公告→扫描仪；键盘/点击等价。
- 首次拖动隐藏会话提示；离开/返回保存视角；昼夜仅用户选择且保存偏好。
- /work与既有slug保留；新增/writing /thoughts /music /games /films /stuff；旧notes保留兼容和新canonical。
- 现有resume和contact入口继续可用。canvas失败、粗指针、移动端使用可访问DOM目录。

## 验收与证据

不得复用旧v23的pass。每个新slice记录目标图、代码归属、三视口截图和对照结论；最终状态在build、lint、媒体检查、Playwright与实际截图审查完成前为not verified。帧率按测试设备测量报告，不假设所有设备60FPS。

Build owner: root integrator + identity-skill/references/frontend-app-builder.md fallback。依据该skill授权，在已确认边界内并行内容页、示例工作台和只读QA；root负责全局设计、生成素材、场景与最终验收。
