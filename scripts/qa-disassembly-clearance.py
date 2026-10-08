"""Check expanded drift envelopes against the actual exported alpha silhouettes."""
import json
import math
from pathlib import Path
from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "qa/world/disassembly-v4"
model = json.loads((OUT / "inspection.json").read_text(encoding="utf-8"))["full"]
scale = 0.5
canvas_size = (1500, 1300)
masks = []
for body in model["bodies"]:
    name = body["id"]
    x, y, w, h = body["rect"]
    dx, dy = body["delta"]
    suffix = "-clean" if name in ("work", "thoughts") else ""
    path = ROOT / f"public/world/v4-extract-{name}{suffix}.webp"
    alpha = Image.open(path).getchannel("A").resize((round(w*scale), round(h*scale)))
    alpha = alpha.point(lambda v: 255 if v > 180 else 0)
    layer = Image.new("L", canvas_size)
    layer.paste(alpha, (round((x+dx+400)*scale), round((y+dy+250)*scale)))
    amplitude = model["floatProfiles"][name][0]
    # A square envelope is deliberately broader than the 2.5px horizontal sway.
    radius = math.ceil((amplitude+2)*scale)
    masks.append((name, layer.filter(ImageFilter.MaxFilter(radius*2+1))))

pairs = []
for i, (a, mask_a) in enumerate(masks):
    for b, mask_b in masks[i+1:]:
        overlap = ImageChops.multiply(mask_a, mask_b).histogram()[255]
        pairs.append({"a":a, "b":b, "overlap_sample_pixels":overlap})
report = {
    "scope":"Expanded-state alpha silhouettes, conservative independent drift envelopes; not compact artistic occlusion or full-site QA",
    "sample_scale":scale,"alpha_threshold":180,"safety_margin_world_pixels":2,
    "pairs":pairs,"pass":all(p["overlap_sample_pixels"]==0 for p in pairs),
}
(OUT / "clearance.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps({"pairs":len(pairs),"pass":report["pass"]}))
if not report["pass"]:
    raise SystemExit("Expanded drift envelopes intersect; inspect clearance.json")
