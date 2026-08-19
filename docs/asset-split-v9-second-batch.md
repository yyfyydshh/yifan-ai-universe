# Asset Split v9｜第二批项目

## 决策

采用 C0 纯代码模式，不切分或生成生产位图素材。

| 页面区域 | 实现方式 |
|---|---|
| 字段合同、时间雷达、保护回路 | React + CSS Grid / SVG-lite CSS 线条 |
| 项目、阶段与状态图标 | 现有 `lucide-react` |
| 路径推进与状态转换 | CSS transform / opacity |
| 参考图 | 仅存于 `references/locked/v9/`，不进入页面资源 |

没有新增字体、纹理、插画或远程图片依赖。
