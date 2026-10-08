import fs from 'node:fs/promises';
import path from 'node:path';

// Next 16.3 export uses path.relative (backslashes on Windows), but its
// convertSegmentPathToStaticExportFilename replaces forward slashes only.
// Preserve the exports and add the flat filenames requested by the browser.
export async function normalizeStaticSegments(root) {
  let copied=0;
  async function visit(directory) {
    for(const item of await fs.readdir(directory,{withFileTypes:true})) {
      const source=path.join(directory,item.name);
      if(item.isDirectory()){await visit(source);continue;}
      const parts=path.relative(root,source).split(path.sep);
      const first=parts.findIndex(part=>part.startsWith('__next.'));
      if(first<0||first===parts.length-1||!item.name.endsWith('.txt'))continue;
      const target=path.join(root,...parts.slice(0,first),parts.slice(first).join('.'));
      const data=await fs.readFile(source);
      try{const existing=await fs.readFile(target);if(!existing.equals(data))throw Error(`Conflicting static segment: ${target}`);}
      catch(error){if(error.code!=='ENOENT')throw error;await fs.writeFile(target,data);copied++;}
    }
  }
  await visit(root);return copied;
}
if(process.env.GITHUB_PAGES==='true')console.log(`Static segment compatibility: ${await normalizeStaticSegments(path.resolve('out'))} files added.`);
