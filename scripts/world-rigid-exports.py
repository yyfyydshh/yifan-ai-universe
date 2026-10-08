"""Mechanical density-matched exports. Original generated RGBA artwork is retained."""
from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parent.parent
sizes = {'work':780, 'writing':710, 'music':700, 'games':700,
         'films':660, 'thoughts':730, 'stuff':670, 'central':1070, 'stair':156}
rows=[]
for name, width in sizes.items():
    source=root/f'references/drafts/world-v3/rigid-{name}.png'
    with Image.open(source) as im:
        target_width=min(width,im.width)
        size=(target_width,round(im.height*target_width/im.width))
        output=root/f'public/world/rigid-{name}.webp'
        im.resize(size,Image.Resampling.LANCZOS).save(output,'WEBP',lossless=True,method=6)
        rows.append({'name':name,'source':str(source.relative_to(root)), 'native':im.size,'export':size,'bytes':output.stat().st_size})
for original,name,width in [('yifan-cartoon-v2','person-idle',704),('yifan-look','person-look',704),('yifan-wave','person-wave',704),('cat-cartoon','cat-idle',304),('cat-awake','cat-awake',304),('cat-stretch','cat-stretch',304)]:
    source=root/f'references/drafts/{"world-v1" if original=="yifan-cartoon-v2" else "world-v2"}/{original}.png'
    with Image.open(source) as im:
        size=min(width,im.width)
        output=root/f'public/world/rigid-{name}.webp'
        im.resize((size,size),Image.Resampling.LANCZOS).save(output,'WEBP',lossless=True,method=6)
        rows.append({'name':name,'source':str(source.relative_to(root)),'native':im.size,'export':[size,size],'bytes':output.stat().st_size})
for name in ['work','writing','music','games','films','thoughts','stuff']:
    source=root/f'references/drafts/world-v3/reaction-{name}.png'
    with Image.open(source) as im:
        output=root/f'public/world/reaction-{name}.webp'
        im.resize((790,790),Image.Resampling.LANCZOS).save(output,'WEBP',lossless=True,method=6)
        rows.append({'name':'reaction-'+name,'source':str(source.relative_to(root)),'native':im.size,'export':[790,790],'bytes':output.stat().st_size})
(root/'docs/world-rigid-assets.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(rows,ensure_ascii=False))
