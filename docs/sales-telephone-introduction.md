# 销售助手介绍与电话素材

## 2026-10-03 当前版本：画面为主，文字按需查看

人物、电话、奶牛猫和小纸页成为默认视觉中心，人物与电话放大。默认仅保留一句简短需求、追问选项和短提示；长段介绍、并列大笔记卡和重复说明不再默认显示。小纸页接听后可点击，使用原生对话框展开需求笔记；小结完成后仍默认收起。详细需求、推进判断、追问建议、未知项和每条事实对应的原话保留在笔记内，Esc 收起原话，再按 Esc 关闭笔记并恢复焦点。

背景采用淡草绿色地面、少量植物线条和轻风曲线，不增加房间或大场景框。人物、猫、电话继续复用已有素材，没有新增位图。纸页与点缀为网页原生图形。修复接听前后因提示段落外边距造成的 12px 页面跳动，并校正人物头部与气泡间距及手机小桌边线。

当前验证：lint、TypeScript、静态构建通过；两组回归 29 项通过，最终弹窗居中和手机版式调整后的两项销售回归也通过。五种尺寸（320／375／414／768／1440）没有横向溢出、图片加载失败或页面异常；笔记弹窗均在视口内，主操作目标至少 44px。测试涵盖默认文字量、笔记按需打开、原话回溯、Esc 与焦点恢复、累计小结、重播和高度稳定。截图含默认画面与笔记展开状态，保存于 `qa/sales-studio/`。前面的简洁双栏版保留为历史记录。

## 2026-10-03 前一版：功能优先的简洁介绍

按最新确认的方向，移除销售详情页的房间背景和场景外框，采用全站奶油纸色底。左侧用客户需求、两次追问及小幅人物／电话／奶牛猫辅助操作；右侧展示需求笔记和下一步建议。保留一张轻量纸页，不再放置整间房或大型场景模块。电话下只有简洁的支架，避免物件悬空。

人物改为完整站姿：倾听时使用 `public/world/news-yifan-listen-v2.webp`，补充需求时持笔记使用 `public/world/tender-yifan-receive-v1.webp`，完成小结后使用 `public/world/tender-yifan-guide-v1.webp` 作讲解动作。猫在睡眠、醒来和伸懒腰状态间切换，也可点击互动。以上均复用已有素材，不新增背景图。电话继续使用 `public/world/sales-phone-v2.png`，接通后标注免提示例，避免听筒仍在底座却被理解为手持接听。

小结累计三轮已提供的需求，三条摘要分别回到第一、第二、第三轮原话。移除客户已说明列表中缺乏直接原话支持的“主动进入适用方案与授权材料评估”；阶段判断保留为助手判断。第三轮只补充自动化和衔接方向，数据量、交付格式、系统接口、预算、采购与合规仍列为待确认。选择过早承诺仍会说明信息不足，不推进状态。

当前验证：lint、TypeScript 和静态构建通过；`project-simulations.spec.ts` 与 `release.spec.ts` 共 29 项通过，包括键盘追问、累计摘要到各轮原话、错误追问、状态重置及桌面高度稳定。320／375／414／768／1440 五种尺寸检查无横向溢出、图片加载失败或页面异常，主要交互目标均至少 44px。截图位于 `qa/sales-studio/`。

下面保留前一版素材与验证记录，房间背景和椅子坐姿素材已不用于当前销售详情页。生成的完整房间试稿也未接入页面。

## 前一版记录

销售助手详情页采用「接电话 → 追问 → 看小结」的短流程。两次追问会同步更新客户原话、需求画像、已确认事实和下一句建议；过早推荐方案或承诺报价时说明尚缺哪些信息。点击事实可对照客户原话，电话可回看本次通话，重新开始会清空本次状态。移除原来的三段切换按钮。样本来自已有的固定三轮脱敏资料，不发起实时分析、不发送客户回复；预算、采购及合规边界保留人工确认。视频和完整方法与证据继续保留在折叠区，GitHub 入口保持可用。

2026-09-30 视觉更新：生成独立工作室桌面，人物改成完整椅子坐姿，保留双腿与双脚，放在桌前；不再用桌面遮掉人物下半身。人物手持便笺，电话和猫在桌上。降低手机端电话尺寸、移除多余控制和空白。桌面场景在接通、回看原话和完成小结时保持相同高度。

新增素材均使用内置 image_gen，已复制到工作区：

- `public/world/sales-conversation-desk-v1.png`：工作室桌面背景，非透明。
- `public/world/sales-yifan-seated-v1.png`：完整坐姿人物，保留透明 alpha；网页采用 alpha 滤镜处理低透明度外沿，未编辑图像像素。

桌面提示词：

> Use case stylized-concept. Generate a wide 3:2 illustrated BACKGROUND for a 2D interactive telephone sales conversation corner of the pictured wooden workshop. Reference is STYLE ONLY: same warm brown ink outlines, cel shaded 2D anime storybook drawing, honey wood and sage plants, sky blue and cream. Composition must be spacious and quiet, zoomed into ONE corner, no busy room. Small arched window in upper left quarter reveals blue sky and soft floating islands. Light warm cream plaster wall across upper middle and all right two thirds, mostly BLANK for web-rendered conversation cards and paper notes. Subtle wooden beams only at top and outer edges. A broad EMPTY honey wood desk stretches horizontally across the LOWER THIRD of image, desk top surface begins precisely around 68% image height; front edge at 85%. Desk surface clean, unoccupied, no books, no pens, no telephone, no cat, no person, no chair, no writing, no icons. A small trailing plant only upper far right edge and potted foliage far bottom left edge, out of central workspace. Soft afternoon daylight from upper left, subtle natural painted shadows, no harsh outlines in central empty space. One continuous coordinated scene with foreground desk, warm cream wall, and window; not an object collage, not photorealistic, no text. Wide landscape clean composition.

坐姿提示词：

> Use case: identity-preserve cartoon character sprite. Reference image provides exact CHARACTER IDENTITY and clothing, not pose. Draw the same ADULT young East Asian man with tousled black hair, white short-sleeve shirt with small dark green chest monogram, olive cargo pants, white low-top sneakers, silver rectangular pendant. CHANGE POSE to sitting naturally on a simple honey-brown wooden chair with backrest, three-quarter view facing RIGHT, relaxed attentive expression looking up to right. His pelvis visibly rests on chair seat; knees bent naturally roughly 90 degrees; both shoes planted flat on same horizontal ground level. Proportions adult, no huge chibi head, no child body. FULL BODY, entire chair and all four legs visible, no cropping at waist, no hidden feet. He holds a small cream clipboard on his lap with left hand, right hand holds pencil resting on clipboard as if noting customer needs. Both elbows natural, fingers anatomically sensible, no raised arm. Chair is structurally realistic and body does not intersect chair. Match warm brown linework, crisp 2D cel-shaded cartoon style of reference. Only one person and his chair, no desk, no background, no phone, no cat, no shadows, no glow. Genuine clean transparent alpha. Tall portrait canvas, centered figure fills 90% of height with minimal uniform transparent padding.

本次验证：lint、TypeScript、静态构建通过；两组项目与发布回归 29 项通过，后续姿态与精简调整后的两项销售回归通过。新增检验包含事实到原话、错误追问不推进、Esc 收起原话、小结边界、通话记录、重播恢复和桌面高度稳定。320／375／414／768／1440 像素截图无横向溢出、图片失败及页面异常；主要触控目标至少 44px。

工作室入口仍为背景中原有的电话。详情页电话改为正常的两端听筒，横放在顶部托架上，下方为显示屏和十二键布局，避免先前听筒多出一条侧臂的问题。

工作室页面移除底部继续走走和全站页脚。其他页面仍显示页脚。宽屏两侧采用同一房间画面的模糊延展，边缘轻微羽化，随日夜背景切换；手机保留可横向移动的房间。

## 最终素材

- 保存位置：`public/world/sales-phone-v2.png`
- 生成模式：内置 image_gen，透明 PNG；保留原始 alpha，未进行像素编辑。
- 参考：用户提供的工作室电话截图。
- 旧的 v1 为废弃候选，页面引用 v2。
- 提示词：

> Use case: stylized-concept. Asset: transparent cartoon sprite for a website sales assistant. Reference image shows the small beige landline telephone on the wooden back desk inside a red rectangle; use only its warm cream colors and 2D workshop drawing style, ignore the tooltip, red outline and all scenery. Draw ONE physically sensible classic cream office desk telephone in front three-quarter view. A single separate U-shaped handset has exactly TWO rounded ends connected by ONE slender horizontal handle. Both ends rest firmly on the two cradle supports on the BACK TOP of the base; the entire handset runs LEFT TO RIGHT across the BACK edge. The handset does NOT run down the left edge of the keypad, and has no third end or extra arm. The base is a compact low trapezoid wedge, tilted toward viewer, with a small inset display below the handset and TWELVE small buttons in a regular 3-column by 4-row grid below the display. Short loosely coiled cord connects the left handset end to left base side. Clear separation between handset and base. Warm brown outlines, softly cel-shaded beige, pale sage display. 2D drawn cartoon, simple proportions close to the workshop telephone. Object sits level on an imaginary flat table. Full object occupies most of square canvas with 8% clean padding. Genuine transparent alpha background. No text, no scenery, no cast shadow, no glow, no surrounding haze. No giant receiver, no L-shaped receiver, no oversized floating parts.

## 前一版验证记录

- lint、TypeScript 和静态构建通过。
- Playwright 四组检查共 42 项：首次 41 项通过；首页目录一项超时，单独复跑通过。未修改首页业务代码，保留该偶发失败记录。
- 截图检查 320、375、414、768、1440 像素销售页面：无横向溢出、图片加载失败或页面异常；三个主交互目标高度至少 50px。
- 检查宽屏房间的日夜两种画面，底部区域及页脚均已移除，页面高度与视口一致。
- 截图及测量脚本：`tests/e2e/qa/capture-sales-studio.mjs`；输出：`qa/sales-studio/`。
