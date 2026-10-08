import { expect, test, type Page } from "@playwright/test";
import { curateRadioNews, newsRadioChannels } from "../../lib/hot-news-radio-demo";

async function listen(page: Page) {
  const desk=page.locator(".hn-desk");
  await desk.getByRole("button", {name:"拨动旋钮，整理七日快报",exact:true}).click();
  await expect(desk).toHaveAttribute("data-state","ready");
  return desk;
}

test("demo records obey dates, story dedupe and source balance without invented originals", () => {
  for (const channel of newsRadioChannels) {
    const {accepted,rejected}=curateRadioNews(channel.records);
    expect(accepted.length+rejected.length).toBe(channel.records.length);
    expect(accepted.length).toBe(channel.id==="quiet"?0:3);
    expect(new Set(accepted.map(n=>n.story)).size).toBe(accepted.length);
    for(const news of accepted) {
      expect(news.original).toContain("虚构演示原文");
      expect(new URL(news.url).hostname).toMatch(/\.example$/);
      expect(accepted.filter(n=>new URL(n.url).hostname===new URL(news.url).hostname).length).toBeLessThanOrEqual(2);
    }
  }
  const news=newsRadioChannels[0].records[0];
  for(const invalid of [{date:"2026-10-01"},{date:""},{url:"javascript:void(0)"},{title:""}]) {
    expect(curateRadioNews([{...news,...invalid}]).accepted).toHaveLength(0);
  }
});

test("turning the radio produces a brief with matching local originals and optional reading views",async({page})=>{
  await page.goto("/work/hot-news-brief");
  const desk=page.locator(".hn-desk");
  await expect(desk).toHaveAttribute("data-state","idle");
  await expect(desk).toContainText("固定虚构演示");
  await listen(page);
  const rows=desk.locator(".hn-brief-list li");
  await expect(rows).toHaveCount(3);
  for (const [index,news] of curateRadioNews(newsRadioChannels[0].records).accepted.entries()) {
    await rows.nth(index).getByRole("button").click();
    await expect(desk.locator(".hn-original h3")).toHaveText(news.title);
    await expect(desk.locator(".hn-original blockquote")).toHaveText(news.original);
    await expect(desk.locator(".hn-original")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(rows.nth(index).getByRole("button")).toBeFocused();
  }
  for(const [label,key] of [["决策","decision"],["选题","angle"]] as const) {
    await desk.getByRole("group",{name:"快报阅读视角"}).getByRole("button",{name:label,exact:true}).click();
    await expect(rows.first()).toContainText(newsRadioChannels[0].records[0][key]);
    await expect(rows).toHaveCount(3);
  }
  await desk.getByRole("button",{name:/没有留下的消息/}).click();
  const bin=desk.locator(".hn-bin");
  await expect(bin.locator("li")).toHaveCount(4);
  for(const text of ["不在最近七日内","没有明确的发布日期","同一消息已经留下","同一来源已有两条"]) await expect(bin).toContainText(text);
  await expect(desk.locator("a[download],a[href*='.example']")).toHaveCount(0);
});

test("channel changes and replay cancel old listening and clear prior evidence",async({page})=>{
  await page.goto("/work/hot-news-brief");
  const desk=page.locator(".hn-desk"), knob=desk.locator(".hn-knob");
  await knob.click();
  await desk.getByRole("button",{name:"新消费",exact:true}).click();
  await page.waitForTimeout(2400);
  await expect(desk).toHaveAttribute("data-state","idle");
  await expect(desk.locator(".hn-brief-list")).toHaveCount(0);
  await listen(page);
  await expect(desk.locator(".hn-brief-list")).toContainText("青岚门店");
  await desk.locator(".hn-brief-list button").first().click();
  await desk.getByRole("button",{name:"再收听一次",exact:true}).click();
  await expect(knob).toBeFocused();
  await expect(desk.locator(".hn-original")).toHaveCount(0);
  await knob.click();
  await desk.getByRole("button",{name:"再收听一次",exact:true}).click();
  await page.waitForTimeout(2400);
  await expect(desk).toHaveAttribute("data-state","idle");
});

test("empty news channel does not generate unsupported summaries or professional views",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/work/hot-news-brief");
  await page.getByRole("button",{name:"冷门样本",exact:true}).click();
  const desk=await listen(page);
  await expect(desk.locator(".hn-empty")).toContainText("近 7 天未发现合格新闻");
  await expect(desk.locator(".hn-views,.hn-brief-list")).toHaveCount(0);
  await expect(desk.locator(".hn-person")).toHaveAttribute("data-pose","read");
  await desk.getByRole("button",{name:"看看为什么没留下",exact:true}).click();
  await expect(desk.locator(".hn-bin li")).toHaveCount(2);
});

test("keyboard and reduced motion retain focus through tuning, original and replay",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/work/hot-news-brief");
  const desk=page.locator(".hn-desk"), knob=desk.locator(".hn-knob");
  await knob.focus(); await page.keyboard.press("Enter");
  await expect(desk.locator(".hn-brief")).toBeFocused();
  const original=desk.locator(".hn-brief-list button").first();
  await original.focus(); await page.keyboard.press("Enter");
  await expect(desk.locator(".hn-original")).toBeFocused();
  await page.keyboard.press("Escape"); await expect(original).toBeFocused();
  await desk.getByRole("button",{name:"再收听一次",exact:true}).focus();
  await page.keyboard.press("Enter"); await expect(knob).toBeFocused();
});

test("touch can select a channel, tune and inspect a local original",async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:"reduce"});
  const page=await context.newPage();
  await page.goto("/work/hot-news-brief");
  const desk=page.locator(".hn-desk");
  await desk.getByRole("button",{name:"新消费",exact:true}).tap();
  await desk.locator(".hn-knob").tap();
  await expect(desk).toHaveAttribute("data-state","ready");
  await desk.locator(".hn-brief-list button").first().tap();
  await expect(desk.locator(".hn-original")).toBeVisible();
  await expect(desk.locator(".hn-original")).toContainText("青岚门店开放自提预约");
  await context.close();
});

test("dragging the dial tunes another channel and dragging a news slip reveals its own evidence",async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/work/hot-news-brief");
  const desk=page.locator(".hn-desk"), knob=desk.locator(".hn-knob");
  const b=(await knob.boundingBox())!;
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2);
  await page.mouse.down();
  await page.mouse.move(b.x+b.width/2+50,b.y+b.height/2,{steps:10});
  await page.mouse.up();
  await expect(desk).toHaveAttribute("data-channel","consumer");
  await expect(desk).toHaveAttribute("data-state","ready");
  const source=desk.locator(".hn-brief-list button").nth(1);
  await source.evaluate(e=>e.scrollIntoView({block:"center",behavior:"instant"}));
  const from=(await source.boundingBox())!,target=(await desk.locator(".hn-check-tray").boundingBox())!;
  await page.mouse.move(from.x+from.width/2,from.y+from.height/2);
  await page.mouse.down();
  await page.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:16});
  await expect(desk.locator(".hn-check-tray")).toHaveAttribute("data-over","true");
  await expect(desk.locator(".hn-cat")).toHaveAttribute("data-pose","reach");
  await page.mouse.up();
  await expect(desk.locator(".hn-original")).toContainText("门店公布周末体验规则");
  await expect(desk.locator(".hn-original")).toBeFocused();
  await expect(desk.locator(".hn-drag-paper")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(source).toBeFocused();
});

test("cancelled and missed paper drops do not open evidence or leave a ghost",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/work/hot-news-brief");
  const desk=await listen(page),source=desk.locator(".hn-brief-list button").first();
  await source.scrollIntoViewIfNeeded();
  const b=(await source.boundingBox())!;
  await page.mouse.move(b.x+15,b.y+20);await page.mouse.down();
  await page.mouse.move(b.x-55,b.y+20,{steps:5});
  await expect(desk.locator(".hn-drag-paper")).toHaveCount(1);
  await page.keyboard.press("Escape");await page.mouse.up();
  await expect(desk.locator(".hn-drag-paper,.hn-original")).toHaveCount(0);
  await source.click();
  await expect(desk.locator(".hn-original")).toBeVisible();
});

test("on a narrow screen the evidence tray comes within reach while dragging",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/work/hot-news-brief");
  const desk=await listen(page),source=desk.locator(".hn-brief-list button").last();
  await source.evaluate(e=>e.scrollIntoView({block:"center",behavior:"instant"}));
  const b=(await source.boundingBox())!;
  await page.mouse.move(b.x+20,b.y+20);await page.mouse.down();
  await page.mouse.move(b.x+40,b.y+30,{steps:5});
  const tray=desk.locator(".hn-check-tray");
  await expect(tray).toHaveCSS("position","fixed");
  const t=(await tray.boundingBox())!;
  expect(t.y+t.height).toBeLessThan(844);
  await page.mouse.move(t.x+t.width/2,t.y+t.height/2,{steps:8});
  await expect(tray).toHaveAttribute("data-over","true");
  await page.mouse.up();
  await expect(desk.locator(".hn-original")).toContainText("社区分享引用核对体验");
  await expect(tray).toHaveCSS("position","relative");
});

for(const width of [320,375,414,768,960,1280,1440,1920]) test(`radio at ${width}px keeps its controls, images and night text readable`,async({page})=>{
  await page.setViewportSize({width,height:1000});
  await page.emulateMedia({reducedMotion:"reduce"});
  const errors:string[]=[]; page.on("pageerror",error=>errors.push(error.message));
  await page.goto("/work/hot-news-brief");
  const desk=await listen(page);
  const size=(await desk.locator(".hn-knob").boundingBox())!;
  expect(size.width).toBeGreaterThanOrEqual(44); expect(size.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await page.getByRole("button",{name:"切换到夜晚",exact:true}).click();
  await expect(desk.locator(".hn-brief-list h3").first()).toHaveCSS("color","rgb(45, 73, 59)");
  expect(await desk.locator("img").evaluateAll(async images=>await Promise.all(images.map(image=>(image as HTMLImageElement).decode().then(()=>true,()=>false))))).not.toContain(false);
  expect(errors).toEqual([]);
});
