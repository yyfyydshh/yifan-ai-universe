import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

await fs.mkdir('qa/world/density', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await page.goto('http://127.0.0.1:3011/', { waitUntil: 'networkidle' });
await page.locator('[data-renderer="ready"]').waitFor();
await page.screenshot({ path: 'qa/world/density/home-dpr2.png' });
await page.screenshot({ path: 'qa/world/density/contact-dpr2.png', clip: { x: 590, y: 285, width: 565, height: 460 } });
const zoom = page.getByRole('button', { name: '放大世界', exact: true });
await zoom.click(); await zoom.click(); await zoom.click();
await page.mouse.move(1, 1);
await page.screenshot({ path: 'qa/world/density/zoom-dpr2.png', clip: { x: 590, y: 270, width: 640, height: 650 } });
await fs.writeFile('qa/world/density/metrics.json', JSON.stringify({ dpr: 2, viewport: [1536, 1024], camera: await page.locator('.world-viewport').getAttribute('data-camera'), renderer: await page.locator('.world-viewport').getAttribute('data-renderer-kind'), nativeScene: [1536, 1024], note: 'Native screenshot pixels; screen DPR does not increase the source illustration detail.' }, null, 2));
await browser.close();
