# v19 ImageGen prompt ledger

执行模式：Codex 内置 `image_gen`。未使用 CLI、API Key 或其他模型。

## 1. 透明 3D 人物基础候选

```text
Use case: identity-preserve
Asset type: transparent website hero character cutout for the Yang Yifan AI Capability Universe
Input images:
- Image 1 is the identity, face, body, clothing, pose, and accessory source of truth.
- Images 2 and 3 are style references only for the polished semi-realistic 3D cartoon rendering of the same person. Do not copy their website background, orbit system, project spheres, text, or layout.
Primary request: create one high-resolution transparent-background 3D cartoon character cutout of the same young Chinese man from Image 1.
Subject invariants: preserve his recognizable facial structure and naturally slightly rounded face; short black textured hair; looking downward with a calm focused expression; both hands resting at his waist in the same arms-akimbo pose; realistic body proportions; white oversized T-shirt with the small dark-green chest graphic preserved without inventing new branding; preserve the necklace and long black pendant.
Style/medium: premium semi-realistic 3D animated character render, realistic skin and cloth texture, refined but not plastic, not photorealistic, not anime, not chibi.
Composition/framing: isolated single figure, head to upper thighs, front three-quarter orientation matching Image 1, centered with generous transparent padding, no cropped hair, elbows, hands, shirt, or torso.
Lighting/mood: restrained cool studio light with a very subtle muted-violet rim light only on hair and shoulder edges; soft facial modeling; no dramatic glow.
Background: genuinely transparent alpha background.
Constraints: actual transparent background; clean antialiased edges and preserved fine hair edges; no stars, no orbit lines, no planets, no UI, no text, no frame, no floor, no shadow plate, no extra objects, no watermark; do not slim or lengthen the face or body; do not change pose, shirt, necklace, gaze, identity, age, or expression.
```

首次结果把棋盘格烘进 RGB，因此执行以下背景提取修正：

```text
Use case: background-extraction
Asset type: transparent website hero character cutout
Input images: Image 1 is the exact character to preserve and the edit target.
Primary request: remove only the white-and-light-gray checkerboard background and replace it with genuine transparent alpha.
Constraints: preserve the character exactly—same face, identity, hair, gaze, expression, body proportions, pose, arms, hands, white shirt, green chest graphic, necklaces, black pendant, pants, lighting, color, framing, and edge detail. Produce a clean antialiased cutout with preserved fine hair edges and no white fringe.
Background: actual transparency, not a drawn checkerboard.
Avoid: no restyling, no recoloring, no crop changes, no added shadow, no glow, no stars, no orbit, no planets, no text, no frame, no watermark.
```

## 2. Idle 参考

```text
Use case: ui-mockup
Asset type: v19 desktop homepage reference — IDLE state
Input images:
- Image 1 is the composition and project-readability base. Preserve its navigation, left copy, three-part capability rail, CTAs, four real project labels, dark-space design system, and overall 16:9 web screenshot structure.
- Image 2 is only the restrained low-light atmosphere reference.
- Image 3 is the exact approved candidate character identity, pose, clothing, and proportion reference.
Primary request: create the coherent idle-state reference for the existing Yang Yifan AI Capability Universe homepage.
Composition: preserve the left information column and keep it fully unobstructed. On the right, keep four readable circular project planets arranged around one shared three-axis orbital system. Use Image 1's balanced four-project geometry, but enlarge all four project planets uniformly by about 15% and tighten the orbit radius slightly so the right side feels full without overlap.
Avatar: place the Image 3 character as a centered-right midground entity at about x 72%, y 55%, height about 68% of the hero. In this IDLE state the character must be almost imperceptible—only a subtle 2.5% ambient silhouette and faint violet edge presence, never the main focus.
Depth: project planets and orbit lines remain more visible than the avatar. Keep all large project planets out of the face-safe zone. Show only quiet back-orbits; no bright foreground waist arc in this idle state.
Text: preserve existing Chinese text and labels from Image 1 exactly; do not add or rewrite copy.
Style: premium restrained deep-space editorial website, muted violet focus accents, warm off-white type, no glassmorphism.
Constraints: no meaningless large foreground planet, no extra cards, no new projects, no fake metrics, no new labels, no modal, no browser chrome, no watermark; project titles and “查看项目” remain legible; the name “杨逸凡” remains the first focal point, project universe second, avatar third.
```

最终仅降低人物可见度：

```text
Change only the central-right character visibility. Reduce the entire character—including face, hair, shirt, arms, pants, rim light, and glow—to an extremely faint ambient presence around 2.5% perceived opacity. Preserve all navigation, text, projects, orbit geometry, stars, colors, and spacing unchanged.
```

## 3. Reveal 参考

```text
Use case: ui-mockup
Asset type: v19 desktop homepage reference — REVEAL state
Input images:
- Image 1 is the exact idle-state layout and site design to preserve.
- Image 2 is the exact character identity, pose, clothing, and proportion source.
- Image 3 is the spatial-occlusion and readable-project inspiration.
Primary request: create the matching revealed interaction state of Image 1, as if the pointer is over the character region.
Preserve: exact 16:9 canvas, navigation, all left copy, capability rail, CTAs, four real project names and icons, dark-space palette, typography hierarchy, and the same overall three-axis project universe.
Avatar reveal: show the Image 2 character clearly at about 72% perceived visibility, still restrained and lower priority than the four projects. Position center-right around x 72%, y 55%, height about 68% of the hero. Keep the face calm, looking down, with no project or bright line crossing the face.
Depth relationship: reposition only as much as a plausible three-axis rotation requires. At least one back project planet should pass partially behind a shoulder or upper arm and be naturally occluded by the character. At most one project planet may be in front, and it may overlap only a small expendable clothing or lower-arm area—never face, project text, icon, or CTA.
Signature orbit: one thin muted-violet main orbit approaches from the left rear, passes behind the torso, then emerges as a brighter foreground arc across the lower chest/waist zone before exiting. Other orbits remain low contrast behind the character.
Project priority: all four project planets remain fully identifiable and their title, icon, and “查看项目” stay readable.
Style: polished restrained deep-space editorial web interface; warm off-white text, muted violet accents, no glassmorphism.
Constraints: no meaningless large foreground planet, no additional project, no new copy, no fake metric, no face obstruction, no bright halo around the whole person, no hologram scan lines, no cyberpunk glitch, no modal, no browser chrome, no watermark.
```

最终仅修正舆情项目与肩膀的后景关系：

```text
Move only the upper-left “全球舆情分析” project planet slightly right and down so a small portion of its lower-right rim passes behind and is naturally occluded by the character’s left shoulder. Keep its icon, category, title, and “查看项目 →” fully readable. Preserve everything else unchanged.
```

## 4. 脸型校正与参考同步

基于真实照片尝试执行“只增加少量面颊饱满度、弱化下颌收尖”的身份校正。生成结果均把透明棋盘格烘进 24-bit RGB，因此未直接采用。为避免再次生成导致身份、服装或姿势漂移，最终以已验证透明候选为源，执行约 3.8% 的头部局部柔性横向塑形；作用在头部、面颊和下颌，颈部平滑归零，身体保持不变。

Reveal 参考同步提示：

```text
Edit the desktop homepage REVEAL reference. Image 1 is the exact approved UI composition and must remain unchanged. Image 2 is the corrected slightly-rounder transparent character identity. Replace only the character identity and face shape in Image 1 with Image 2, preserving the exact existing character position, scale, pose, clothing, necklaces, visibility, restrained low-light purple integration, shoulder occlusion, and waist-level foreground orbit relationship. Preserve all UI and spatial content exactly: navigation, every Chinese label, typography, left copy, capability rail, buttons, all four project planets, icons, titles, 查看项目 links, planet positions, orbit geometry, star field, colors, spacing, and 16:9 canvas. Keep the face unobstructed and all project labels readable. Do not add, delete, move, rewrite, brighten, or restyle anything except the character's slightly rounder face identity. No new text, browser chrome, or watermark.
```

新生成的 Idle 同步稿错误提高了人物可见度，未采用。Idle 中人物仅约 2.5% 感知可见度，脸型不可辨认，因此继续沿用原 `01-home-idle.png`，避免为了不可见差异破坏既有层级。
