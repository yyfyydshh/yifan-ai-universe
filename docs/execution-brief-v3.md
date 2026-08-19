# v3 复刻执行 brief — 三轴作品宇宙

## Build owner

`identity-skill` 内置 `frontend-app-builder` fallback，受项目根目录 `design.md` 与 Hallmark atmospheric / Spatial Canvas 约束。

## 视觉与内容基线

- Active reference：`references/locked/v3/01-home.png` 与 `02-project-universe.png`。
- 保留现有导航、定位、项目数据、语义图标、分类和 URL；不添加可见主张。
- 色彩、字体、间距、CTA 与移动端规则继续读取 `tokens.css` / `design.md`。

## 实现边界

- 目标文件：`components/project-universe.tsx`、`app/globals.css`、`design.md` 与证据文档。
- Career 焦点修复保留在 `components/career-trajectory.tsx`；不改变其版式。
- 0 个生产 raster 素材；参考图不进入运行时 bundle。
- 使用 React state/refs、原生 pointer/keyboard events、`requestAnimationFrame`、`IntersectionObserver` 与 CSS transform/opacity；不新增 Three.js/WebGL/动效库。

## 必需交互

- 7 个确定性球面初始点；共享三维旋转矩阵与透视投影。
- 自动巡航是稳定方向上的三轴旋转，叠加幅度受限的确定性进动，不使用 `Math.random()`。
- 横向拖动映射 yaw，纵向拖动映射 pitch，对角拖动提供受限 roll。
- 松手后惯性平滑衰减到巡航速度，并沿最后拖动方向持续旋转。
- 小于 6px 的 pointer 位移保留普通点击；超过阈值只旋转并抑制一次 click。
- 左右键改变 yaw，上下键改变 pitch；hover/focus/页面隐藏/离开视口暂停。
- 48rem 以下与 reduced-motion 关闭三维巡航和惯性，内容完整可读。

## QA

- lint、生产构建、全部项目 href 静态检查与 `/work`、`/career` 路由检查。
- 目标视口：1440×900、1920×1080、390×844；如果自动浏览器仍受本地 URL 策略阻塞，证据状态保持 `not verified`，不得伪写 pass。
- 重点比较：三秒空间感、近大远小、文字不被遮挡、拖动后方向继承、链接可点击、Career rail 同步。

