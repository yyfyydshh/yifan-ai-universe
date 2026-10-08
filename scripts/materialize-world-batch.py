from PIL import Image
from pathlib import Path
import json, shutil
root=Path(__file__).resolve().parents[1]
rows=json.loads(r'''[{"name":"island-clean","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-7732d48b-b7e3-4b93-a215-479ebbc69983.png"},{"name":"cat-idle","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-9cdd574d-33b5-46bf-91c2-940ba8ab56d4.png"},{"name":"folder","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-6b58158e-0453-4b66-b5bf-cca63bd79c45.png"},{"name":"sky-night","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-a58e6a87-e078-4ad6-9c5b-ba9ea0ca7ca3.png"},{"name":"yifan-cartoon-v2","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-0bd12744-837c-4f91-b50c-3f71dcc5ede6.png"}]''')
for r in rows:
 im=Image.open(r['path']); dst=root/'references/drafts/world-v1'/(r['name']+'.png'); shutil.copy2(r['path'],dst)
 print(r['name'],im.size,im.mode,im.getpixel((0,0)),im.getpixel((800,100)))
 im.thumbnail((1536,1024) if r['name'].startswith(('island','sky')) else (800,800))
 im.save(root/'public/world'/(r['name']+'.webp'),'WEBP',quality=90,method=6)
