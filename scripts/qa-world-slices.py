from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
source=root/'qa/world/final/mobile'
target=root/'qa/world/review-slices/final-mobile'
target.mkdir(parents=True,exist_ok=True)
count=0
for path in source.glob('*-full.png'):
    with Image.open(path) as im:
        for index,top in enumerate(range(0,im.height,1120),1):
            # Lossless analysis slices, never used as website artwork.
            im.crop((0,top,im.width,min(top+1200,im.height))).save(target/f'{path.stem.removesuffix("-full")}-{index:02}.png')
            count+=1
print(f'{count} original-scale mobile screenshot slices')
