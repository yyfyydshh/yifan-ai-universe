from pathlib import Path
from PIL import Image
import shutil
root=Path.cwd()
source=Path(r'C:/Users/16934/.codex/generated_images/01a0e648-fc3f-7fc0-ab1b-daafec0d2a58/exec-b4e53a79-b5a5-4db3-b81c-94b3ef08e1dd.png')
target=root/'references/drafts/world-v2/world-scene-open.png'
if not target.exists(): shutil.copy2(source,target)
im=Image.open(target)
im.save(root/'public/world/world-scene-open.webp','WEBP',lossless=True,method=6)
# Mechanical web exports use the same 0.96 native texels per logical world unit.
# Original approved artwork remains untouched for portraits and future exports.
actors=[('yifan-cartoon-v2','yifan-scene-idle',389),('yifan-look','yifan-scene-look',389),('yifan-wave','yifan-scene-wave',389),('cat-cartoon','cat-scene-idle',197),('cat-awake','cat-scene-awake',197),('cat-stretch','cat-scene-stretch',197)]
for original,name,size in actors:
    raw=root/('references/drafts/world-v1' if original=='yifan-cartoon-v2' else 'references/drafts/world-v2')/(original+'.png')
    with Image.open(raw) as actor:
        actor.resize((size,size),Image.Resampling.LANCZOS).save(root/'public/world'/(name+'.webp'),'WEBP',lossless=True,method=6)
print('Scene native:',im.size,'bytes:',(root/'public/world/world-scene-open.webp').stat().st_size)
print('Actor exports:',[(a[1],a[2]) for a in actors])
