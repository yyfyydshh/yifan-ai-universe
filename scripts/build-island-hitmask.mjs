import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const source = 'public/world/island-complete-v4.webp';
const destination = 'public/world/island-hitmask-v4.bin';
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const pixelCount = info.width * info.height;
const bits = Buffer.alloc(Math.ceil(pixelCount / 8));
for (let pixel = 0; pixel < pixelCount; pixel++) {
  if (data[pixel * 4 + 3] > 40) bits[pixel >> 3] |= 1 << (pixel & 7);
}
if (process.argv.includes('--check')) {
  const saved = await readFile(destination);
  if (!saved.equals(bits)) throw new Error(`${destination} no longer matches ${source}`);
  console.log(`${destination}: current`);
} else {
  await writeFile(destination, bits);
  console.log(`${destination}: ${info.width}×${info.height}, ${bits.length} bytes`);
}
