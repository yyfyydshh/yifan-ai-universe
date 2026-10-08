# 文档站简短介绍

2026-09-30。保留 `/work/docs-system`，工作室书架上的书本仍是入口。

页面只用简短介绍、一本可翻阅的卡通手册和两个直接外链。三个书签分别介绍产品、采集教程与开放集成；右侧整页可点击或拖动到下一页，左页回翻，也可用书签方向键、Home、End 或页角 Enter 翻阅。去掉圆形箭头、页码与原翻页控制栏。手机改为上下排列的书页，减少动态偏好关闭切页动画。沿用现有成年人物、奶牛猫和文档书册素材，没有生成新图片。

正式入口：

- 文档站：https://www.bazhuayu.com/docs/zh/overview（移除用户消息中 URL 末尾的中文逗号）
- 仓库：https://github.com/bazhuayu-team/bazhuayu-docs

内容以这两个公开来源为准；关于迁移、栏目整理和链接核对的介绍来自站点已有项目与复盘。没有补充虚构指标。原视频、完整迁移方法与证据保留在底部折叠区。

验证：ESLint、构建（含 TypeScript）通过；32 项页面、键盘、真实链接、旧技术证据与视频回归通过。在 320、375、414、768、1440px 截图检查无横向溢出、无运行时错误，书签触控目标均超过 44px。入口与页面图案统一使用已有的 `tour-notebook.webp` 书本，房间背景与书架位置不变。

翻页更新：书页沿书脊正向／反向翻转，含正反页、纸张厚度和移动阴影；文字随纸页移动，落定后移除临时翻页层。连续选择会等待当前页落定后转到最后选择的章节，不在半空中重置纸页。手机把翻动限制在阅读区；减少动态偏好直接换页，偏好在运行途中改变也能结束动画。无新增依赖或生成素材。

翻页验收：ESLint、构建及类型检查通过，最终 33 项回归通过。桌面 1440px、手机 375px 抓取了翻起中与落定后的画面；正向／反向均确认实际书页变换，动画过程中没有横向页面溢出。测试包括快速连续选择、动画完成、运行中切换减少动态偏好、键盘和原外链。

book-v3 覆盖上述旧的刚性旋转：使用拖动位置驱动的二维折纸几何、局部细折痕与同色奶油纸面，松手后完成或回落；按 Escape、失焦、窗口变化可取消拖动。左页的标题、步骤、图标和说明随章节一起换。人物脚底、猫身下缘按素材的可见轮廓落在同一木台面，并收紧接触阴影；猫的两种状态保持同一承托位置。

v3 验证：ESLint、构建（含 TypeScript）通过，35 项 Playwright 回归通过。新增整页点击、手机触控拖动、正反纸面颜色一致、短拖回落、长拖完成、Escape 后键盘翻页与左右内容同步检查。320／375／414／768／1440px 截图无横向溢出或运行时错误，375／1440px 在拖动过程中也无横向溢出。QA 入口为 tests/e2e/qa/capture-docs-book.mjs 与 capture-docs-flip.mjs。

book-v4：替换盘腿人物为站立持书姿势，素材保存于 `public/world/docs-yifan-reader-v1.png`。固定三章共享书页尺寸：桌面双页 560px，中等屏幕 620px；手机左页 150px、右页 430px。左页插图禁止 flex 收缩，标题与描述预留统一高度，避免字数差异压缩插图或改变台面及按钮的位置。站立人物只用一个姿态，双脚落点固定，手机为其预留独立空间。

v4 验证：ESLint 与构建（含 TypeScript）通过，36 项回归通过；尺寸测试覆盖 320／375／768／1440px 下全部三章的翻动中和落定后，对比书本、纸面、木台、按钮区域的宽高与位置。五种尺寸截图及翻动中截图无横向溢出或运行时错误。

### 新人物生成记录

book-v5 人物动作：沿用站立读书素材，用重叠软遮罩分离头部、上半身和固定腿脚。平时轻微呼吸及低头阅读，翻页期间轻抬头；悬停时关注访问者，点击或键盘 Enter 时轻点头回应。双脚和接触阴影固定，减少动态偏好关闭这些动作。未生成额外人物素材。

动作验证：ESLint、构建及 TypeScript 通过，10 项项目交互回归通过。375／1440px 的动作截图与浏览器检查确认三种动作运行、脚部位置保持固定、减少动态后动画停止，页面没有横向溢出。验证脚本为 `tests/e2e/qa/capture-docs-reader.mjs`。

使用内置 image_gen 工具，未使用 API / CLI。参考素材为 `public/world/tender-yifan-guide-v1.webp`；生成后通过内置工具进行背景提取，保留人物。页面对低透明度的背景雾边进行 alpha 映射，避免灰色光晕出现在奶油底色上。

最终生成提示词：

> Create ONE clean transparent-background 2D cartoon character sprite for an existing Chinese personal portfolio website. Reference image is identity/style reference only. Preserve the same ADULT young Chinese man: tousled black hair, white loose T-shirt with small dark green chest emblem, necklace, olive cargo trousers, white gray sneakers, mature head/body proportions, bold warm dark outlines, soft hand-drawn cartoon shading. Change the pose to comfortably STANDING, both feet firmly and evenly planted on a horizontal surface, knees relaxed, body slightly facing right, holding ONE small open cream-paper green hardcover manual at chest/waist height with BOTH hands, gently looking down and right toward it with a friendly concentrated expression. Must be full body with both complete shoes, hands anatomically coherent, book coherent pages, no text. No seated pose, no pointing, no extra props, no ground plane, no shadow outside sprite, no scenery, no white rectangles, no colored outline halo. Isolated on genuine transparent alpha. Character occupies canvas with modest padding only, sharp consistent resolution.

背景提取提示词：

> Precise background-extraction edit. Preserve the standing reader character exactly, including entire body, both shoes, green open book, same pose, face, lineart, proportions and colors. Remove ALL the smoky gray glow / dark vignette / black backdrop / translucent background haze around his outline. Output a CLEAN isolated opaque character on 100% transparent zero-alpha background outside his silhouette. No shadow, no glow or halo anywhere. Preserve internal antialiasing at a narrow 1 pixel silhouette edge only. Do NOT redraw character. Keep complete shoes, full figure. Crop with small even transparent padding, not an oversized canvas.
