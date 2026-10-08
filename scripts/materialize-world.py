from PIL import Image
from pathlib import Path
import json, shutil
records=json.loads(r'''[{"name":"sky","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58 as C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-e36d5747-59f6-458b-98ed-96a2b3206a9f.png"},{"name":"island","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58 as C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-7c53d651-3c5d-4765-a4f2-633c5e828a95.png"},{"name":"workshop","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58 as C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-a4f99168-ead5-4935-8c43-eb162712c28c.png"},{"name":"yifan-idle","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58 as C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-2513e862-f3a4-47e8-8745-e8ae351bf047.png"},{"name":"07-mobile-design","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58 as C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-9b80f865-d6ec-4779-8b69-0bad168ae003.png"},{"name":"08-project-design","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58 as C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-180fdf5c-6fea-4a35-89d9-6b957150d5e4.png"},{"name":"09-article-design","path":"C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58 as C:\\Users\\16934\\.codex\\generated_images\\01a0e648-fc3f-7fc0-ab1b-daafec0d2a58\\exec-12bd07a3-676d-4321-9eea-6057e7d12117.png"}]''')
root=Path(r'D:/AI/CVme/yifan-ai-universe')
for r in records:
 p=Path(r['path'].split(' as ')[-1]); im=Image.open(p); name=r['name']
 dst=root/('references/locked/world-v1' if '-design' in name else 'references/drafts/world-v1')/(name+'.png')
 shutil.copy2(p,dst)
 print(name,im.size,im.mode,im.getextrema()[-1] if im.mode=='RGBA' else None)
 if '-design' not in name:
  im.thumbnail((1600,1200) if name in ['sky','island'] else (800,900))
  im.save(root/'public/world'/(name+'.webp'),'WEBP',quality=90,method=6)


