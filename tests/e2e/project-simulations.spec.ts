import { expect, test } from "@playwright/test";
import { projects } from "../../lib/site-data";

test("every project exposes its dedicated preview, keyboard controls and repository exit", async ({ page }) => {
  test.setTimeout(120_000);
  const simulators: Record<string, string> = {
    "sales-copilot": ".sales-simulator", "docs-system": ".db-book",
    "regulatory-risk": ".regulatory-simulator", "tender-cleaner": ".tp-desk",
    "hot-news-brief": ".hn-desk", humanizer: ".writing-simulator",
    "global-opinion": ".op-play-desk",
  };
  for (const project of projects) {
    await page.goto(`/work/${project.slug}`);
    await expect(page.getByRole("heading", { level:1 })).toBeVisible();
    const preview = page.locator(simulators[project.slug]);
    await expect(preview).toBeVisible();
    const control = preview.getByRole("button").and(page.locator("button:not(:disabled)")).first();
    await control.focus(); await expect(control).toBeFocused();
    await expect(page.locator(`main a[href="${project.github}"]`).first()).toBeVisible();
  }
});

test("Sales simulation preserves all three source replies, context and MQL levels", async ({ page }) => {
  const study = projects.find(project => project.slug === "sales-copilot")!.caseStudy;
  if (study?.visualKind !== "sales-conversion") throw new Error("Sales facts are unavailable");
  await page.goto("/work/sales-copilot"); const sim = page.locator(".sales-simulator");
  await expect(sim.locator('.sales-note-dialog')).not.toBeVisible();
  await expect(sim.getByRole('button', {name:'查看需求笔记',exact:true})).toBeDisabled();
  expect((await sim.innerText()).length).toBeLessThan(120);
  await sim.getByRole('button', {name:'接起客户来电',exact:true}).focus(); await page.keyboard.press('Enter');
  for (const [index, turn] of study.turns.entries()) {
    if (index > 0) {
      await sim.locator('.sales-choices button').first().focus(); await page.keyboard.press('Enter');
    }
    expect((await sim.locator('.sales-current-reply').innerText()).length).toBeLessThan(30);
    await expect(sim.locator('.sales-note-dialog')).not.toBeVisible();
    await sim.getByRole('button', {name:'查看需求笔记',exact:true}).click();
    await expect(sim.locator('.sales-note-dialog')).toBeVisible();
    await expect(sim.locator(".sim-customer-card")).toContainText(turn.contextSummary);
    await expect(sim.locator(".sales-stage-judgment")).toContainText(turn.mql.level);
    await expect(sim.locator(".sales-stage-judgment")).toContainText(turn.mql.label);
    await expect(sim.locator(".sales-next-question")).toContainText(turn.outputs.find(output => output.id === "reply")!.value);
    for (const fact of turn.newFacts.slice(0, index === 2 ? 2 : undefined)) await expect(sim.locator(".sales-new-facts")).toContainText(fact);
    await sim.locator('.sales-new-facts button').first().click();
    await expect(sim.locator('.sales-source p')).toHaveText(turn.reply);
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await expect(sim.getByRole('button', {name:'查看需求笔记',exact:true})).toBeFocused();
  }
  await expect(sim.locator(".sim-customer-card")).toContainText("预算、采购与合规边界仍需人工确认");
  await expect(sim).toContainText("不是实时客户分析");
});

test('sales call explains premature promises, traces facts, summarizes and restores replay state', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/work/sales-copilot');
  const sim = page.locator('.sales-simulator');
  const scene = sim.locator('.sales-scene');
  const bounds = (await scene.boundingBox())!;
  await sim.getByRole('button', {name:'接起客户来电',exact:true}).click();
  expect((await scene.boundingBox())!.height).toBe(bounds.height);
  await sim.getByRole('button', {name:'直接推荐完整方案',exact:true}).click();
  await expect(sim.locator('.sales-choice-feedback')).toContainText('先问清需求');
  await expect(sim).toHaveAttribute('data-brief','false');
  const study = projects.find(project => project.slug === 'sales-copilot')!.caseStudy;
  if (study?.visualKind !== 'sales-conversion') throw new Error('Sales facts unavailable');
  await sim.getByRole('button', {name:'查看需求笔记',exact:true}).click();
  await sim.locator('.sales-new-facts button').first().click();
  await expect(sim.locator('.sales-source p')).toHaveText(study.turns[0].reply);
  expect((await scene.boundingBox())!.height).toBe(bounds.height);
  await page.keyboard.press('Escape');
  await expect(sim.locator('.sales-source')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(sim.locator('.sales-note-dialog')).not.toBeVisible();
  await sim.getByRole('button', {name:'问业务和数据范围',exact:true}).click();
  await expect(sim.locator('.sales-source')).toHaveCount(0);
  await sim.getByRole('button', {name:'现在承诺价格和工期',exact:true}).click();
  await expect(sim.locator('.sales-choice-feedback')).toContainText('暂时不能给出报价');
  await sim.getByRole('button', {name:'问规模和自动化范围',exact:true}).click();
  await sim.getByRole('button', {name:'整理沟通小结',exact:true}).click();
  await expect(sim).toHaveAttribute('data-brief','true');
  await expect(sim.locator('.sales-note-dialog')).not.toBeVisible();
  await sim.getByRole('button', {name:'查看沟通小结',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(sim.locator('.sales-note-dialog')).toBeVisible();
  await expect(sim.locator('.sales-note')).toContainText('这次通话的沟通小结');
  await expect(sim.locator('.sales-note')).toContainText('预算、采购与合规边界仍需人工确认');
  await expect(sim.locator('.sales-note')).toContainText('数据量、交付格式与系统接口');
  await expect(sim.locator('.sales-new-facts')).not.toContainText('主动进入适用方案与授权材料评估');
  for (let index = 0; index < 3; index++) {
    await sim.locator('.sales-new-facts button').nth(index).focus();
    await page.keyboard.press('Enter');
    await expect(sim.locator('.sales-source p')).toHaveText(study.turns[index].reply);
    await page.keyboard.press('Escape');
  }
  await page.keyboard.press('Escape');
  await expect(sim.getByRole('button', {name:'查看沟通小结',exact:true})).toBeFocused();
  await expect(sim.locator('.sales-still-life')).toHaveAttribute('data-action', 'summary');
  await expect(sim.locator('.sales-reader img')).toHaveAttribute('src', /tender-yifan-guide/);
  await sim.getByRole('button', {name:'摸摸小牛',exact:true}).click();
  await expect(sim.locator('.sales-cat')).toHaveAttribute('aria-pressed', 'true');
  expect((await scene.boundingBox())!.height).toBe(bounds.height);
  await sim.getByRole('button', {name:'查看通话记录',exact:true}).click();
  await expect(sim.locator('.sales-history p')).toHaveCount(3);
  await sim.getByRole('button', {name:'重新接一通电话',exact:true}).click();
  await expect(sim).toHaveAttribute('data-connected','false');
  await expect(sim).toHaveAttribute('data-brief','false');
  await expect(sim.locator('.sales-history')).toHaveCount(0);
  await expect(sim.locator('.sales-replies')).toHaveCount(0);
  await expect(sim.locator('.sales-note-dialog')).not.toBeVisible();
  await expect(sim.getByRole('button', {name:'查看需求笔记',exact:true})).toBeDisabled();
  await expect(sim.locator('.sales-still-life')).toHaveAttribute('data-action', 'listening');
  await expect(sim.locator('.sales-cat')).toHaveAttribute('aria-pressed', 'false');
  expect(await scene.evaluate(element => getComputedStyle(element).backgroundImage)).toBe('none');
});

test("documentation book can be read by keyboard and leads to the real site and repository", async ({ page }) => {
  await page.goto("/work/docs-system");
  const tabs = page.getByRole("tablist", { name: "手册章节" }).getByRole("tab");
  const chapter = page.getByRole("tabpanel");
  await expect(chapter).toContainText("产品概览");
  await expect(page.getByRole("button", { name: "上一页", exact: true })).toBeDisabled();
  await tabs.nth(0).focus(); await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused(); await expect(chapter).toContainText("采集学院");
  await page.keyboard.press("End"); await expect(chapter).toContainText("OpenAPI");
  await expect(page.locator('.db-left-sheet > .db-title-page')).toContainText("把采集接入你的工作流");
  await expect(page.getByRole("button", { name: "下一页", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "上一页", exact: true }).click();
  await expect(chapter).toContainText("采集学院");
  await expect(page.locator('.db-left-sheet > .db-title-page')).toContainText("照着步骤，走完一次采集");
  const links = page.getByRole("navigation", { name: "文档站项目链接" });
  await expect(links.getByRole("link", { name: "打开文档站" })).toHaveAttribute("href", "https://www.bazhuayu.com/docs/zh/overview");
  await expect(links.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/bazhuayu-team/bazhuayu-docs");
  await expect(links.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
});

test("book page turns land in both directions, coalesce rapid selections and respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/work/docs-system");
  const chapter = page.getByRole("tabpanel");
  await page.getByRole("tab", { name: "动手采集" }).click();
  await expect(page.locator('.db-flip-leaf[data-direction="forward"]')).toHaveCount(1);
  await expect(chapter).toHaveAttribute("aria-busy", "true");
  await page.getByRole("tab", { name: "连接应用" }).click();
  await page.getByRole("tab", { name: "认识产品" }).click();
  await expect(chapter).toHaveAttribute("aria-busy", "false");
  await expect(chapter).toContainText("产品概览");
  await expect(page.locator(".db-flip-leaf")).toHaveCount(0);
  await page.getByRole("tab", { name: "连接应用" }).click();
  await expect(chapter).toHaveAttribute("aria-busy", "false");
  await page.getByRole("button", { name: "上一页", exact: true }).click();
  await expect(page.locator('.db-flip-leaf[data-direction="backward"]')).toHaveCount(1);
  await expect(chapter).toHaveAttribute("aria-busy", "false");
  await expect(chapter).toContainText("采集学院");
  await page.getByRole("tab", { name: "认识产品" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(chapter).toHaveAttribute("aria-busy", "false");
  await expect(page.locator(".db-flip-leaf")).toHaveCount(0);
  await page.getByRole("tab", { name: "连接应用" }).click();
  await expect(chapter).toContainText("OpenAPI");
  await expect(page.locator(".db-flip-leaf")).toHaveCount(0);
});

test("dragged paper follows the hand, returns on a short pull and changes both pages on a long pull", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/work/docs-system");
  await page.locator('.db-book').scrollIntoViewIfNeeded();
  const next = page.getByRole('button', {name:'下一页',exact:true}), chapter = page.getByRole('tabpanel');
  let box = (await next.boundingBox())!;
  await page.mouse.move(box.x+25,box.y+25); await page.mouse.down();
  await page.mouse.move(box.x-45,box.y-25,{steps:8});
  await expect(page.locator('.db-flip-leaf')).toHaveAttribute('data-mode','dragging');
  const first = await page.locator('.db-paper-front').getAttribute('style');
  await page.mouse.move(box.x-75,box.y-45,{steps:5});
  expect(await page.locator('.db-paper-front').getAttribute('style')).not.toBe(first);
  await page.mouse.up();
  await expect(chapter).toHaveAttribute('aria-busy','false');
  await expect(chapter).toContainText('产品概览');
  box = (await next.boundingBox())!;
  const width = (await page.locator('.db-chapter-wrap').boundingBox())!.width;
  await page.mouse.move(box.x+25,box.y+25); await page.mouse.down();
  await page.mouse.move(box.x+25-width*.85,box.y-60,{steps:12}); await page.mouse.up();
  await expect(chapter).toHaveAttribute('aria-busy','false');
  await expect(chapter).toContainText('采集学院');
  await expect(page.locator('.db-left-sheet > .db-title-page')).toContainText('照着步骤，走完一次采集');
  const previous = page.getByRole('button',{name:'上一页',exact:true});
  box = (await previous.boundingBox())!;
  await page.mouse.move(box.x+25,box.y+25); await page.mouse.down();
  await page.mouse.move(box.x+25+width*.8,box.y-60,{steps:12}); await page.mouse.up();
  await expect(chapter).toHaveAttribute('aria-busy','false');
  await expect(chapter).toContainText('产品概览');
  box = (await next.boundingBox())!;
  await page.mouse.move(box.x+25,box.y+25); await page.mouse.down();
  await page.mouse.move(box.x-60,box.y-30,{steps:5}); await page.keyboard.press('Escape'); await page.mouse.up();
  await expect(chapter).toHaveAttribute('aria-busy','false');
  await next.focus(); await page.keyboard.press('Enter');
  await expect(chapter).toHaveAttribute('aria-busy','false'); await expect(chapter).toContainText('采集学院');
});

test("whole book pages turn on click, paper colors match and touch dragging commits on mobile", async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'}); await page.goto('/work/docs-system');
  const chapter = page.getByRole('tabpanel');
  await chapter.getByRole('heading',{level:2}).click();
  await expect(chapter).toHaveAttribute('aria-busy','false'); await expect(chapter).toContainText('采集学院');
  await page.locator('.db-left-sheet h2').click();
  await expect(chapter).toHaveAttribute('aria-busy','false'); await expect(chapter).toContainText('产品概览');
  await page.setViewportSize({width:375,height:844}); await chapter.scrollIntoViewIfNeeded();
  const rect = (await chapter.boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  const start = {x:rect.x+rect.width*.88,y:rect.y+rect.height*.55};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
  for(let i=1;i<=8;i++) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x-rect.width*.75*i/8,y:start.y-10*i/8}]});
  await expect(page.locator('.db-flip-leaf')).toHaveAttribute('data-mode','dragging');
  const colors = await page.evaluate(()=>[getComputedStyle(document.querySelector('.db-pages')!).backgroundColor,getComputedStyle(document.querySelector('.db-paper-back')!).backgroundColor]);
  expect(colors[0]).toBe(colors[1]);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(chapter).toHaveAttribute('aria-busy','false'); await expect(chapter).toContainText('采集学院');
  await expect(page.locator('.db-left-sheet')).toContainText('照着步骤，走完一次采集');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
});

test("book and platform geometry stay stable through every chapter and page turn", async ({ page }) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  for (const width of [320,375,768,1440]) {
    await page.setViewportSize({width,height:1000}); await page.goto('/work/docs-system');
    await page.locator('.db-book').scrollIntoViewIfNeeded();
    const measure = () => page.evaluate(() => ['.db-book','.db-pages','.db-left-sheet .db-left-illustration','.db-shelf','.db-exits'].map(selector => {
      const rect = document.querySelector(selector)!.getBoundingClientRect();
      return {width:rect.width,height:rect.height,top:rect.top+scrollY};
    }));
    const original = await measure();
    async function expectStable() {
      const current = await measure();
      current.forEach((rect, i) => {
        expect(rect.width).toBe(original[i].width);
        expect(rect.height).toBe(original[i].height);
        // Font rasterization can vary by a fraction of a CSS pixel.
        expect(Math.abs(rect.top-original[i].top)).toBeLessThan(.5);
      });
    }
    for (const name of ['动手采集','连接应用','认识产品']) {
      await page.getByRole('tab',{name}).click();
      await expect(page.locator('.db-flip-leaf')).toHaveCount(1);
      await expectStable();
      await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-busy','false');
      await expectStable();
    }
  }
});

test("regulatory scale exposes the mismatched condition and the pending next step", async ({ page }) => {
  await page.goto("/work/regulatory-risk"); const sim = page.locator(".regulatory-simulator");
  await sim.getByRole("button", { name: "放上天平：监管通知", exact: true }).click();
  await expect(sim.locator(".rs-instrument")).toHaveAttribute("data-state","obligation");
  await sim.getByRole("button", { name: "切换企业样本：仅线下", exact: true }).click();
  await expect(sim.locator('[data-check="business"]')).toHaveAttribute("data-state","mismatch");
  await sim.getByRole("button", { name: "切换企业样本：资料不全", exact: true }).click();
  await expect(sim.locator(".rs-instrument")).toHaveAttribute("data-state","pending");
  await sim.getByRole("button", { name: "看看下一步", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("不生成正式风险判断");
});

// The radio's source binding, exclusions and empty state are covered by
// hot-news-radio.spec.ts; this file retains the other projects' simulations.

test("writing simulation rejects plot changes while retaining the original text", async ({ page }) => {
  await page.goto("/work/humanizer"); const sim = page.locator(".writing-simulator");
  const original = await sim.locator(".he-protected").innerText();
  await sim.getByRole("button", { name: "试改受保护的句子", exact: true }).click();
  await expect(sim).toHaveAttribute("data-blocked", "true");
  await expect(sim.getByRole("status")).toContainText("不能换成别的物件");
  await expect(sim.locator(".he-protected")).toHaveText(original);
  await expect(sim.getByRole("button", { name: "改完后，看看对照" })).toBeDisabled();
  await sim.getByRole("button", { name: "删去多余解释", exact: true }).click();
  await expect(sim).toHaveAttribute("data-phase", "edited");
  await expect(sim.locator(".he-protected")).toHaveText(original);
  await expect(sim.locator(".he-extra")).toBeHidden();
  await sim.getByRole("button", { name: "看看改了哪里" }).click();
  await expect(page.getByRole("dialog")).toContainText("薄荷叶和原有留白仍在");
});

test("project detail disclosures mount only on demand and remove their content on close", async ({ page }) => {
  await page.goto("/work/global-opinion");
  const evidence = page.locator(".project-disclosure").filter({ has: page.locator("summary", { hasText: "项目视频与完整技术证据" }) });
  await expect(evidence.locator(".project-disclosure-content")).toHaveCount(0);
  await evidence.locator("summary").focus(); await page.keyboard.press("Enter");
  await expect(evidence.locator(".project-disclosure-content")).toBeVisible();
  await expect(page.locator(".evidence-quality-gate")).toBeVisible();
  await evidence.locator("summary").click();
  await expect(evidence.locator(".project-disclosure-content")).toHaveCount(0);
  await expect(page.locator(".evidence-quality-gate")).toHaveCount(0);
  await expect(page.locator(".op-demo")).toBeVisible();
});
