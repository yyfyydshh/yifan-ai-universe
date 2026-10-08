import hashlib, json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
names = ['sky-v3','sky-night-v3','world-scene-open','workshop-v2','writing','music','games','cinema','thinking','stuff','yifan-cartoon-v2','yifan-look','yifan-wave','cat-cartoon','cat-awake','cat-stretch','folder-v2','mobile-ground']
names += ['tour-computer','tour-notebook'] + ['studio-'+name for name in ['globe','chat','docs','shield','scanner','radio','pen']]
names += ['studio-room-integrated']
derived = {'yifan-scene-idle':'yifan-cartoon-v2','yifan-scene-look':'yifan-look','yifan-scene-wave':'yifan-wave','cat-scene-idle':'cat-cartoon','cat-scene-awake':'cat-awake','cat-scene-stretch':'cat-stretch'}
names += list(derived)
assets = []
for name in names:
    path = root / f'public/world/{name}.webp'
    with Image.open(path) as im:
        alpha = im.getchannel('A') if im.mode == 'RGBA' else None
        item = dict(id=name, path=path.relative_to(root).as_posix(), width=im.width, height=im.height,
                    mode=im.mode, bytes=path.stat().st_size, decoded_rgba_bytes=im.width*im.height*4,
                    alpha_bbox=alpha.getbbox() if alpha else None,
                    sha256=hashlib.sha256(path.read_bytes()).hexdigest(), source='built-in image_gen; user references and approved adult cartoon direction')
    original = derived.get(name,name)
    source = root / f'references/drafts/world-v2/{original}.png'
    if original == 'yifan-cartoon-v2': source = root / 'references/drafts/world-v1/yifan-cartoon-v2.png'
    if not source.exists(): raise FileNotFoundError(source)
    item['source_path'] = source.relative_to(root).as_posix()
    if name in derived: item['export_method'] = 'Lanczos resize from preserved approved PNG; lossless WebP; 0.96 texels per logical world unit'
    if name == 'world-scene-open': item['export_method'] = 'Native 1536×1024 lossless WebP; no upscaling'
    assets.append(item)
manifest = dict(version='world-v2', assets=assets, total_bytes=sum(a['bytes'] for a in assets),
                decoded_rgba_bytes=sum(a['decoded_rgba_bytes'] for a in assets),
                note='Inventory spans all routes and states, not simultaneous loading. Decoded size is a base RGBA estimate, not measured GPU allocation. Desktop canvas loads only the integrated scene and six density-matched actor states. Sky/room/mobile/preview/project icons are DOM images. Native scene is 1536×1024, not 4K; originals remain preserved.')
(root/'docs/world-assets.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in manifest.items() if k!='assets'},ensure_ascii=False))
