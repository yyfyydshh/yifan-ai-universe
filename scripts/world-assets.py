from PIL import Image
from pathlib import Path
import json,sys,shutil
root=Path(__file__).resolve().parents[1]
records=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
for r in records:
 name=r['name']; im=Image.open(r['path'])
 directory=root/('references/locked/world-v2' if r.get('reference') else 'references/drafts/world-v2')
 directory.mkdir(parents=True,exist_ok=True)
 target=directory/(name+'.png')
 if not target.exists(): shutil.copy2(r['path'],target)
 if not r.get('reference'):
  im.thumbnail((1536,1024) if name.startswith(('sky','island','studio-room','world-scene')) else (800,800))
  im.save(root/'public/world'/(name+'.webp'),'WEBP',quality=88,method=4)
 print(name,im.size,im.mode,flush=True)
