# 热点快报卡通交互页

当前路由：`/work/hot-news-brief`。工作室继续使用木色收音机作为入口。

主操作为「拖动旋钮调台 → 收听 → 把消息拖进查证托盘」。也可选频道并点击旋钮、直接点击原文入口，或通过键盘箭头键调台、Enter 收听。聆听时人物侧耳，完成后拿起快报；拖动消息时人物和猫也回应。人物、收音机、猫的轮廓彼此分开并锁定桌面落点。手机拿起消息后，托盘出现在屏幕下方，避免长距离拖动。筛选原因和新闻／决策／选题视角作为结果后的可选操作，不再显示通用三步流程。

示例日期固定为 2026-09-30，资料全部虚构，不执行检索，不输出虚构数据的正式下载文件。AI 工具和新消费样本各留下三条；冷门样本为空，只解释时间过旧和缺失日期。新闻编号、来源、日期和完整示例原文在同一类型化数据中绑定。`.example` 地址仅为校验数据，不渲染为真实媒体链接。

事实来源为本地 `hot-news-brief-skill` 仓库，origin 与用户给定的 GitHub 地址一致。README、输出契约和 source-policy 对数量上限与 SKILL 存在口径差异，所以页面不宣称统一的真实检索上限。演示按 source-policy 和 compact_search_result 的每域名两条规则展示来源平衡；原有完整技术资料和视频仍在页面末尾的折叠区。

当前生成素材：`public/world/news-desk-v1.webp`（干净桌面背景）、`public/world/news-radio-clean-v2.webp`（删除附带报纸的收音机）、`public/world/news-yifan-listen-v2.webp`（成年人物聆听姿态）。通过内置 Imagegen 生成、目视检查后仅作无损 WebP 格式转换。人物持纸姿态和奶牛猫状态沿用现有站点素材。原 v1 素材和参考图保留；v1 视觉审查的 fix 已按用户反馈改进为 v2。精确提示词在 [v1 提示词](./hot-news-radio-prompts.json) 和 [v2 提示词](./hot-news-radio-prompts-v2.json)。文字、频道、快报、托盘、原文抽屉和所有点击区由网页渲染。

验收运行：`D:/AI/CVme/.showcase-runs/yifan-ai-universe/hot-news-brief`。参考图、desktop / ultrawide / mobile 截图、独立视觉审查、来源核对及推广记录分别位于该目录的 `ui`、`qa`、`docs`、`delivery`。

验证结果（2026-09-30）：源码 ESLint、生产构建含 TypeScript 检查通过，55 项 Playwright 回归通过。回归覆盖三种频道、拖动调台、查证托盘放入和取消、原文对应、来源筛选、空结果、重播清理、键盘焦点、减少动态、实际触控、320–1920px 布局、工作室入口、全部项目 GitHub 出口及旧内容。最终结果见 run 目录内 qa/validation.json。IAB 内也实际拖动调台和查证；未把截图当成交互证明。
