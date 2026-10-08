import { expect, test, type Page } from "@playwright/test";
import { cleanRegulatoryDemoBatch } from "../../lib/regulatory-balance-demo";
const place = async(page:Page,label="监管通知") => page.getByRole("button",{name:`放上天平：${label}`,exact:true}).click();
const profile = async(page:Page,label:string) => page.getByRole("button",{name:`切换企业样本：${label}`,exact:true}).click();
const close = async(page:Page) => page.getByRole("button",{name:"关闭演示纸页",exact:true}).click();

test("the first interaction puts a message on a meaningful scale without a quiz or sorting workflow", async({page})=>{
 await page.goto("/work/regulatory-risk");
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","idle");
 await expect(page.getByRole("button",{name:"看看下一步",exact:true})).toBeDisabled();
 await expect(page.locator(".rs-paper")).toHaveCount(5);
 const paper=page.getByRole("button",{name:"放上天平：监管通知",exact:true});await paper.focus();await page.keyboard.press("Enter");
 await expect(paper).toBeFocused();
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","obligation");
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-angle","0");
 await expect(page.locator(".rs-result")).toContainText("条件对上了");
 await expect(page.locator('.rs-checks > div[data-state="match"]')).toHaveCount(4);
 await expect(page.locator(".rs-meaning")).toContainText("不表示风险高低或违法认定");
});

test("changing the enterprise changes the beam and exposes the precise mismatched or missing condition", async({page})=>{
 await page.goto("/work/regulatory-risk");await place(page);
 await profile(page,"仅线下");
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-angle","-10");
 await expect(page.locator('[data-check="business"]')).toHaveAttribute("data-state","mismatch");
 await expect(page.locator(".rs-result")).toContainText("这条不适用");
 await profile(page,"资料不全");
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-angle","-5");
 await expect(page.locator('[data-check="business"]')).toHaveAttribute("data-state","missing");
 await expect(page.locator(".rs-result")).toContainText("先补证");
 await profile(page,"线上业务");
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-angle","0");
 await expect(page.locator(".rs-result")).toContainText("继续核验");
});

test("all five paper types preserve distinct applicability reasons and exact source binding", async({page})=>{
 await page.goto("/work/regulatory-risk");
 const expected=["obligation","signal","pending","excluded","excluded"];
 for(const [index,item] of cleanRegulatoryDemoBatch().entries()) {
  await place(page,item.label);await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state",expected[index]);
  await page.getByRole("button",{name:"回看这条原文",exact:true}).click();
  await expect(page.locator(".rb-full-body")).toHaveText(item.body);
  await expect(page.locator(".rb-source")).toContainText(item.id);
  await expect(page.locator(".rb-source")).toContainText(item.source);
  await close(page);await expect(page.getByRole("button",{name:"回看这条原文",exact:true})).toBeFocused();
 }
 await place(page,"草案");await expect(page.locator('[data-check="time"]')).toHaveAttribute("data-state","missing");
 await place(page,"旧版");await expect(page.locator('[data-check="time"]')).toHaveAttribute("data-state","mismatch");
 await profile(page,"资料不全");await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","excluded");
 await place(page,"异地");await expect(page.locator('[data-check="region"]')).toHaveAttribute("data-state","mismatch");
});

test("mouse dragging commits only over the left pan; cancelled or wrong-pan drags do not change the selection", async({page})=>{
 await page.goto("/work/regulatory-risk");await page.emulateMedia({reducedMotion:"reduce"});
 const paper=page.getByRole("button",{name:"放上天平：处罚案例",exact:true});const box=(await paper.boundingBox())!;
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+25,box.y+box.height/2,{steps:4});
 await expect(page.locator(".rs-drag-paper")).toBeVisible();
 await page.mouse.move(1300,200,{steps:5});await page.mouse.up();
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","idle");
 const target=(await page.getByRole("button",{name:"左盘：放入消息",exact:true}).boundingBox())!;
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:10});
 await expect(page.locator(".rs-drop")).toHaveAttribute("data-over","true");await page.mouse.up();
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","signal");
 await expect(page.locator(".rs-drag-paper")).toHaveCount(0);
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+25,box.y+box.height/2,{steps:4});
 await paper.dispatchEvent("pointercancel",{pointerId:1});await page.mouse.up();
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","signal");
 const notice=page.getByRole("button",{name:"放上天平：监管通知",exact:true});await notice.focus();await page.keyboard.press("Enter");
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","obligation");
});

test("the next step follows only the weighed record and keeps signals separate from obligations", async({page})=>{
 await page.goto("/work/regulatory-risk");await place(page);
 await page.getByRole("button",{name:"看看下一步",exact:true}).click();
 await expect(page.locator(".rb-action-list article")).toHaveCount(1);
 await expect(page.locator(".rb-report")).toContainText("信息安全负责人");
 await expect(page.locator(".rb-report")).toContainText("非监管法定期限");
 await expect(page.locator(".rb-report")).not.toContainText("同业执法信号");
 await page.getByRole("button",{name:"清单依据：REG-DEMO-001",exact:true}).click();
 await expect(page.locator(".rb-source")).toContainText("REG-DEMO-001");
 await page.getByRole("button",{name:"回到跟进清单",exact:true}).click();await page.keyboard.press("Escape");
 await expect(page.getByRole("button",{name:"看看下一步",exact:true})).toBeFocused();
 await place(page,"处罚案例");await page.getByRole("button",{name:"看看下一步",exact:true}).click();
 await expect(page.locator(".rb-report")).toContainText("不把他人的处罚写成本企业的违规");
 await expect(page.locator(".rb-report")).toContainText("合规负责人");
 await expect(page.getByRole("button",{name:"清单依据：REG-DEMO-002",exact:true})).toBeVisible();
});

test("pending and excluded messages retain their reasons and never generate direct actions or a simulated delivery", async({page})=>{
 await page.goto("/work/regulatory-risk");
 for(const [label,biz,state] of [["草案","线上业务","pending"],["监管通知","资料不全","pending"],["旧版","线上业务","excluded"],["异地","线上业务","excluded"],["监管通知","仅线下","excluded"]]) {
  await profile(page,biz);await place(page,label);
  await page.getByRole("button",{name:"看看下一步",exact:true}).click();
  await expect(page.locator(".rb-action-list")).toHaveCount(0);await expect(page.locator(".rb-report-reason")).toHaveCount(1);
  if(state==="pending") await expect(page.locator(".rb-report")).toContainText("不生成正式风险判断");
  await page.getByRole("button",{name:"看看投递前的检查",exact:true}).click();
  await expect(page.getByRole("button",{name:"模拟投递（不发送）",exact:true})).toBeDisabled();await close(page);
 }
});

test("delivery remains local, deduplicates the same record and target, and replay restores the empty scale", async({page})=>{
 const remote:string[]=[];page.on("request",request=>{if(/^https?:/.test(request.url())&&!request.url().startsWith("http://127.0.0.1:3091"))remote.push(request.url());});
 await page.goto("/work/regulatory-risk");await place(page);
 const delivery=async()=>{await page.getByRole("button",{name:"看看下一步",exact:true}).click();await page.getByRole("button",{name:"看看投递前的检查",exact:true}).click();};
 await delivery();await expect(page.locator(".rb-delivery-preview")).toContainText("监管要求 1 · 执法信号 0");
 await page.getByRole("button",{name:"模拟投递（不发送）",exact:true}).click();await expect(page.locator(".rb-delivery-result")).toHaveAttribute("data-result","simulated");
 await page.getByRole("button",{name:"模拟投递（不发送）",exact:true}).click();await expect(page.locator(".rb-delivery-result")).toHaveAttribute("data-result","duplicate");
 await page.getByRole("button",{name:"邮件",exact:true}).click();await page.getByRole("button",{name:"模拟投递（不发送）",exact:true}).click();await expect(page.locator(".rb-delivery-result")).toHaveAttribute("data-result","simulated");
 await close(page);await place(page,"处罚案例");await delivery();await expect(page.locator(".rb-delivery-preview")).toContainText("监管要求 0 · 执法信号 1");
 await page.getByRole("button",{name:"模拟投递（不发送）",exact:true}).click();await expect(page.locator(".rb-delivery-result")).toHaveAttribute("data-result","simulated");await close(page);
 await page.getByRole("button",{name:"摸摸小牛",exact:true}).click();await profile(page,"资料不全");await page.getByRole("button",{name:"重新核对样本",exact:true}).click();
 await expect(page.locator(".rs-instrument")).toHaveAttribute("data-state","idle");await expect(page.getByRole("button",{name:"摸摸小牛",exact:true})).toHaveAttribute("aria-pressed","false");
 await expect(page.getByRole("button",{name:"切换企业样本：线上业务",exact:true})).toHaveAttribute("aria-pressed","true");
 await place(page);await delivery();await page.getByRole("button",{name:"模拟投递（不发送）",exact:true}).click();await expect(page.locator(".rb-delivery-result")).toHaveAttribute("data-result","simulated");expect(remote).toEqual([]);
});

for(const width of [320,375,414,768,1440]) test(`the scale and its controls fit ${width}px without profile-switch jumps`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:"reduce"});const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/work/regulatory-risk");await place(page);const box=(await page.locator(".rs-instrument").boundingBox())!;
 for(const biz of ["仅线下","资料不全","线上业务"]) {
  await profile(page,biz);const next=(await page.locator(".rs-instrument").boundingBox())!;expect(next).toEqual(box);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
 }
 const targets=await page.locator(".rs-layout button").evaluateAll(buttons=>buttons.filter(b=>!b.hasAttribute("disabled")).map(b=>({label:b.getAttribute("aria-label")||b.textContent,height:b.getBoundingClientRect().height,width:b.getBoundingClientRect().width})));
 for(const target of targets){expect(target.height,target.label!).toBeGreaterThanOrEqual(44);expect(target.width,target.label!).toBeGreaterThanOrEqual(44);}
 await page.getByRole("button",{name:"看看下一步",exact:true}).click();const dialog=(await page.getByRole("dialog").boundingBox())!;expect(dialog.x).toBeGreaterThanOrEqual(0);expect(dialog.x+dialog.width).toBeLessThanOrEqual(width);await page.keyboard.press("Escape");expect(errors).toEqual([]);
});
