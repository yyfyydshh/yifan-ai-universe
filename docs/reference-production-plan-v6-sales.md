# Sales Copilot v6 Reference Production Plan

## Reference status

- Previous reference: `references/locked/v5/01-sales-decision-routing.png`
- Status: invalidated for the Sales Copilot case-study reading path only.
- Reason: the first viewport explains workflow terminology before product value, and the production layout forces an empty left column to match a longer right column.
- Candidate target: `references/candidates/v6/01-sales-action-brief-workbench.png`
- Lock target after approval: `references/locked/v6/01-sales-action-brief-workbench.png`

## Style fingerprint

- Visual family: deep-space evidence workbench.
- Background: near-black graphite with restrained violet atmosphere.
- Type roles: warm-ivory serif for product promise and result titles; neutral sans-serif for explanations; mono for evidence labels and states.
- Geometry: one-pixel rules, square or minimally rounded panels, no glass cards, no decorative bento grid.
- State color: muted violet for the current/interactive state; green only for a passed condition; warning colors only for blocked or incomplete paths.
- Motion intent: source-to-output evidence highlighting, state switching, and path progression only.

## Render contract

### Three-second message

`把零散销售沟通，转化为专业判断与下一步行动。`

The first viewport must answer three questions without interaction:

1. What goes in: sales chats, meeting notes, and customer materials.
2. What comes out: customer understanding, needs, MQL, one solution direction, verified materials, and a next-step action recommendation.
3. What controls reliability: fact/inference/unknown separation, evidence traceability, insufficient-information questioning, and human confirmation before sending.

### Main composition

- Compact product definition and three summary anchors at the top.
- Left: a small, explicitly anonymized communication sample.
- Middle: three reliability checkpoints that connect source evidence to results.
- Right and visually dominant: `客户判断与行动建议`, presented as the concrete deliverable of the sales professional assistant.
- A visible `信息充分 / 信息不足` mechanism switch.
- In the insufficient state, the design returns a priority question and leaves profile, score, and solution ungenerated.
- A shallow bottom strip explains why the result is reviewable; it must not force either column to stretch.

### Interaction meaning

- Selecting an analysis or action item highlights the source line and rule that support it.
- Switching to insufficient information changes the result area into a question-first state.
- Details are a second layer below the main workbench, not a permanently tall side panel.

### Content boundaries

- The public repository establishes the de-identified product boundary and overview.
- MQL A-D, strict JSON contracts, and sub-Skill orchestration remain labeled as user-provided internal project facts.
- All sample dialogue is a mechanism demonstration, not a real client record.
- Outbound content is always a draft requiring salesperson confirmation.
- No fake customer, live Agent state, KPI, completion status, or automation timer.

## Asset split

- Final implementation class: C0 code-only reference.
- UI, lines, labels, icons, state changes, and motion will be live DOM/CSS.
- No generated raster is intended for production use; the candidate image is a visual contract only.
