import sharp from 'sharp';
import fs from 'node:fs/promises';

// Format conversion only: preserve every source pixel and the original alpha.
const ids=['central','writing','music','work-clean','games','films','thoughts-clean','stuff'];
const assets=[];
for(const id of ids){
  const source=`references/drafts/world-v4/extract-${id}.png`,path=`public/world/v6-native-${id}.webp`;
  await sharp(source).webp({lossless:true,effort:5}).toFile(path);
  const {width,height}=await sharp(path).metadata();
  assets.push({source,path,width,height,bytes:(await fs.stat(path)).size});
}
await fs.writeFile('docs/world-native-textures.json',JSON.stringify({encoding:'lossless WebP; no resize',assets},null,2)+'\n');
console.log(`Exported ${assets.length} native island textures`);
