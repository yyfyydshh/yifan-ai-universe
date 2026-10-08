#!/usr/bin/env python3
"""Sample actual rigid-world geometry and intersect alpha silhouettes.

Run from anywhere: python scripts/qa-rigid-clearance.py
Requires Pillow, Node and the project's existing TypeScript dependency. No
browser, production changes, source-image edits, NumPy, or network is needed.
JSON reports are numerical evidence for visual review, not a semantic verdict
that a floor/edge is safe. Overlapping leaves and intentional occlusion count.
"""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageChops


# Execute the live TS modules rather than copying their layout/motion formulae.
# The stub implements only geometry used by createWorldMotion, and deliberately
# throws on any new external import so a changed production API cannot go stale.
NODE_SNAPSHOT = r"""
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = process.argv[1];
const options = JSON.parse(process.argv[2]);
class Container {
  constructor(options = {}) {
    this.label = options.label; this.x = 0; this.y = 0;
    this.rotation = 0; this.scale = {x: 1, y: 1};
    this.children = []; this.destroyed = false;
    this.position = {set: (x, y) => {this.x=x; this.y=y;}};
  }
  addChild(...nodes) { this.children.push(...nodes); return nodes[0]; }
  destroy() { this.destroyed=true; this.children=[]; }
}
class Sprite extends Container {
  constructor(options) {super(options); this.texture=options.texture;}
  set width(value) {this._width=value; this.scale.x=value/this.texture.width;}
  get width() {return this._width;}
  set height(value) {this._height=value; this.scale.y=value/this.texture.height;}
  get height() {return this._height;}
}
function readModule(relative, imports) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const js = ts.transpileModule(source, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022
  }, fileName: relative}).outputText;
  const module={exports:{}};
  const localRequire=(key)=>{
    if (!(key in imports)) throw new Error('Unexpected module dependency: '+key);
    return imports[key];
  };
  new Function('exports','require','module',js)(module.exports,localRequire,module);
  return module.exports;
}
const layout=readModule('lib/world-layout.ts',{});
const {createWorldMotion}=readModule('lib/world-motion.ts', {
  'pixi.js': {Container, Sprite}, './world-layout': layout
});
const textures=Object.fromEntries([...layout.islandBodies.map(x=>x.asset),'rigid-step']
  .map(asset=>[asset,{width:1,height:1,destroyed:false}]));
const scenarios=[];
for (const spread of options.spreads) {
  const motion=createWorldMotion(textures);
  motion.setSpread(spread);
  motion.update(0,true);
  let current=0;
  const frames=[];
  for (let index=0; index<=options.count; index++) {
    const target=index*options.intervalMs;
    // Production clamps frame deltas to 100ms. Advancing at 60Hz preserves
    // the real activeTime/entrance behavior between our coarser observations.
    while (current < target-1e-7) {
      current=Math.min(target,current+1000/60);
      motion.update(current,true);
    }
    frames.push({timeMs:target,...motion.snapshot()});
  }
  scenarios.push({spread,frames});
  motion.destroy();
}
process.stdout.write(JSON.stringify({
  islands:layout.islandBodies,steps:layout.floatingSteps,scenarios
}));
"""


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_geometry(root: Path, spreads: list[float], seconds: float, interval: float) -> dict:
    options = {"spreads": spreads, "count": math.floor(seconds / interval),
               "intervalMs": interval * 1000}
    result = subprocess.run(["node", "-e", NODE_SNAPSHOT, str(root), json.dumps(options)],
                            cwd=root, text=True, encoding="utf-8", capture_output=True)
    if result.returncode:
        raise RuntimeError("Could not execute current TS geometry:\n" + result.stderr)
    return json.loads(result.stdout)


def mask_for(image: Image.Image, width: float, height: float, scale: int, alpha: int) -> Image.Image:
    return image.getchannel("A").resize((round(width * scale), round(height * scale)),
                                       Image.Resampling.BILINEAR).point(
                                           lambda value: 255 if value > alpha else 0)


def placed(snapshot: dict, definition: dict, mask: Image.Image, scale: int) -> dict:
    if snapshot["rotation"] != 0:
        raise RuntimeError("Rotating sprites need a different rasterizer")
    if abs(snapshot["width"] - definition["width"]) > 1e-7 or abs(
            snapshot["height"] - definition["height"]) > 1e-7:
        raise RuntimeError("Animated sprite size needs a different rasterizer")
    left, top = round(snapshot["x"] * scale), round(snapshot["y"] * scale)
    return {"snapshot": snapshot, "definition": definition, "mask": mask,
            "box": (left, top, left + mask.width, top + mask.height)}


def intersection(a: dict, b: dict) -> tuple[Image.Image | None, tuple[int, int]]:
    ax, ay, ar, ab = a["box"]
    bx, by, br, bb = b["box"]
    left, top, right, bottom = max(ax, bx), max(ay, by), min(ar, br), min(ab, bb)
    if right <= left or bottom <= top:
        return None, (left, top)
    first = a["mask"].crop((left-ax, top-ay, right-ax, bottom-ay))
    second = b["mask"].crop((left-bx, top-by, right-bx, bottom-by))
    return ImageChops.multiply(first, second), (left, top)


def collision_detail(mask: Image.Image, origin: tuple[int, int], a: dict, b: dict,
                     scale: int, sources: dict) -> dict:
    """Return only confirmed occupied points, never an empty bbox center."""
    bounds = mask.getbbox()
    if bounds is None:
        raise ValueError("Expected a nonempty alpha intersection")
    raw, width = mask.tobytes(), mask.width
    occupied = [index for index, value in enumerate(raw) if value]
    points = []
    for fraction in (0, .1, .25, .5, .75, .9, 1):
        index = occupied[round((len(occupied)-1) * fraction)]
        x, y = (origin[0]+index % width+.5)/scale, (origin[1]+index//width+.5)/scale
        point = {"world": [round(x, 4), round(y, 4)], "sourcePixels": {}}
        for node in (a, b):
            snap, definition = node["snapshot"], node["definition"]
            image_width, image_height = sources[definition["asset"]]["sourceSize"]
            point["sourcePixels"][snap["id"]] = [
                round((x-snap["x"])/snap["width"]*image_width, 2),
                round((y-snap["y"])/snap["height"]*image_height, 2)]
        if point not in points:
            points.append(point)
    world_box = [(origin[0]+bounds[0])/scale, (origin[1]+bounds[1])/scale,
                 (origin[0]+bounds[2])/scale, (origin[1]+bounds[3])/scale]
    return {"worldBBox": world_box, "occupiedPoints": points,
            "centroid": [round(sum(origin[0]+i % width+.5 for i in occupied)/len(occupied)/scale, 4),
                         round(sum(origin[1]+i//width+.5 for i in occupied)/len(occupied)/scale, 4)],
            "poses": {node["snapshot"]["id"]: {
                key: node["snapshot"][key] for key in ("x", "y", "width", "height", "offsetX", "offsetY")}
                for node in (a, b)}}


def make_pair(a: dict, b: dict, paint_order: list[str]) -> dict:
    first, second = a["id"], b["id"]
    a_island, b_island = a["kind"] == "island", b["kind"] == "island"
    kind = "island_island" if a_island and b_island else "step_step" if not a_island and not b_island else "step_island"
    record = {"ids": [first, second], "kind": kind, "peak": None, "overlapSamples": 0,
              "perSpread": {}, "intentionalOcclusionCandidate": set((first, second)) == {"central", "films"}}
    if kind == "step_island":
        island, step = (a, b) if a_island else (b, a)
        record["stepRelation"] = "route_endpoint_island" if island["id"] in (step["from"], step["to"]) else "unrelated_island"
        record["paintedInFront"] = island["id"]
    else:
        record["paintedInFront"] = max((first, second), key=paint_order.index)
    return record


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--seconds", type=float, default=30)
    parser.add_argument("--interval", type=float, default=.25)
    parser.add_argument("--scale", type=int, default=2, help="Analysis pixels per world unit")
    parser.add_argument("--alpha", type=int, default=128)
    parser.add_argument("--spreads", default="0,.125,.25,.375,.5,.625,.75,.875,1")
    parser.add_argument("--output", default="qa/world/rigid/clearance.json")
    args = parser.parse_args()
    if args.seconds < 30 or not 0 < args.interval <= .5 or args.scale < 1 or not 0 <= args.alpha < 255:
        parser.error("Use >=30 seconds, interval <=.5s, scale >=1, and valid alpha threshold")
    spreads = [float(value) for value in args.spreads.split(",")]
    if not all(0 <= value <= 1 for value in spreads) or 0 not in spreads or 1 not in spreads:
        parser.error("Spreads must include compact 0 and expanded 1, all within [0,1]")
    root, started = args.root.resolve(), time.perf_counter()
    code_paths = [root / "lib/world-layout.ts", root / "lib/world-motion.ts"]
    source_hashes = {str(path.relative_to(root)).replace("\\", "/"): digest(path) for path in code_paths}
    geometry = read_geometry(root, spreads, args.seconds, args.interval)
    definitions = [{**item, "kind": "island"} for item in geometry["islands"]] + [
        {**item, "kind": "step", "asset": "rigid-step"} for item in geometry["steps"]]
    by_id = {item["id"]: item for item in definitions}
    paint_order = [item["id"] for item in geometry["steps"] + geometry["islands"]]
    sources, masks, opaque = {}, {}, {}
    for definition in definitions:
        asset = definition["asset"]
        source = root / "public/world" / (asset + ".webp")
        if asset not in sources:
            with Image.open(source) as opened:
                if "A" not in opened.getbands():
                    raise RuntimeError(f"Missing alpha channel: {source}")
                image = opened.convert("RGBA")
            sources[asset] = {"path": str(source.relative_to(root)).replace("\\", "/"),
                              "sourceSize": list(image.size), "sha256": digest(source), "image": image}
        mask = mask_for(sources[asset]["image"], definition["width"], definition["height"], args.scale, args.alpha)
        masks[definition["id"]] = mask
        opaque[definition["id"]] = mask.histogram()[255]
    pairs = [make_pair(a, b, paint_order) for a, b in itertools.combinations(definitions, 2)]
    scenario_summary = []
    for scenario in geometry["scenarios"]:
        spread, frames = scenario["spread"], scenario["frames"]
        state_key = str(spread)
        for record in pairs:
            record["perSpread"][state_key] = {"samples": len(frames), "overlapSamples": 0, "peak": None}
        for frame in frames:
            snapshots = frame["islands"] + frame["steps"]
            current = {snap["id"]: placed(snap, by_id[snap["id"]], masks[snap["id"]], args.scale) for snap in snapshots}
            for record in pairs:
                first, second = record["ids"]
                a, b = current[first], current[second]
                overlap, origin = intersection(a, b)
                if overlap is None:
                    continue
                pixel_count = overlap.histogram()[255]
                if not pixel_count:
                    continue
                record["overlapSamples"] += 1
                state = record["perSpread"][state_key]
                state["overlapSamples"] += 1
                new_global = record["peak"] is None or pixel_count > record["peak"]["overlapPixels"]
                new_state = state["peak"] is None or pixel_count > state["peak"]["overlapPixels"]
                if new_global or new_state:
                    peak = {"spread": spread, "timeSeconds": frame["timeMs"]/1000,
                            "overlapPixels": pixel_count, "areaWorldUnitsSquared": pixel_count/args.scale**2,
                            "fractionOfOpaque": {name: round(pixel_count/opaque[name], 6) for name in record["ids"]},
                            **collision_detail(overlap, origin, a, b, args.scale, sources)}
                    if new_global:
                        record["peak"] = peak
                    if new_state:
                        state["peak"] = peak
        collisions = [record for record in pairs if record["perSpread"][state_key]["peak"]]
        categories = {}
        for kind in ("island_island", "step_island", "step_step"):
            relevant = [record for record in collisions if record["kind"] == kind]
            categories[kind] = {"overlappingPairs": len(relevant), "worstPair": None}
            if relevant:
                worst = max(relevant, key=lambda record: record["perSpread"][state_key]["peak"]["overlapPixels"])
                peak = worst["perSpread"][state_key]["peak"]
                categories[kind]["worstPair"] = {"ids": worst["ids"], "areaWorldUnitsSquared": peak["areaWorldUnitsSquared"],
                                               "timeSeconds": peak["timeSeconds"], "worldBBox": peak["worldBBox"]}
        scenario_summary.append({"spread": spread, "frames": len(frames), "categories": categories})
        print(json.dumps({"spread": spread, "categories": categories}), flush=True)
    changed = [str(path.relative_to(root)) for path in code_paths
               if source_hashes[str(path.relative_to(root)).replace("\\", "/")] != digest(path)]
    for source in sources.values():
        if digest(root / source["path"]) != source["sha256"]:
            changed.append(source["path"])
    overlapping = sorted((record for record in pairs if record["peak"]),
                         key=lambda record: record["peak"]["overlapPixels"], reverse=True)
    output = root / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    report = {"generatedAt": datetime.now(timezone.utc).isoformat(), "runtimeSeconds": round(time.perf_counter()-started, 3),
              "method": {"source": "Executed actual TypeScript layout and motion with geometry-only Pixi stubs",
                         "durationSeconds": args.seconds, "intervalSeconds": args.interval, "spreads": spreads,
                         "framesPerSpread": len(geometry["scenarios"][0]["frames"]), "simulationHz": 60,
                         "analysisPixelsPerWorldUnit": args.scale, "opaqueRule": f"bilinear-resampled alpha > {args.alpha}",
                         "translationRoundingMaxWorldUnits": .5/args.scale,
                         "areaMeaning": "Intersection pixel count / analysisPixelsPerWorldUnit^2, in world-space square units",
                         "scope": "All island-island, step-island and step-step pairs; actors, signs and toys excluded",
                         "limits": ["Finite time/progress samples cannot prove zero overlap between observations",
                                    "No semantic masks identify floor, platform, foliage or vines; inspect occupiedPoints in original artwork",
                                    "Actual alpha overlap can be legitimate foreground occlusion; it is not automatically a defect",
                                    "Subpixel GPU texture filtering may differ within the recorded grid/rounding precision"]},
              "inputs": {"codeSha256": source_hashes, "assets": {key: {k: v for k, v in value.items() if k != "image"}
                                                                  for key, value in sources.items()},
                         "islands": geometry["islands"], "steps": geometry["steps"], "changedDuringRun": changed},
              "summary": {"islands": len(geometry["islands"]), "steps": len(geometry["steps"]),
                          "testedPairs": len(pairs), "testedFrames": sum(len(s["frames"]) for s in geometry["scenarios"]),
                          "overlappingPairs": len(overlapping), "scenarios": scenario_summary},
              "overlaps": overlapping, "neverOverlapped": [{"ids": item["ids"], "kind": item["kind"]} for item in pairs if not item["peak"]]}
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    main_report = {key: value for key, value in report.items() if key not in ("overlaps", "neverOverlapped", "inputs")}
    main_report["codeSha256"] = source_hashes
    main_report["changedDuringRun"] = changed
    main_report["mainIslandOverlaps"] = [record for record in overlapping if record["kind"] == "island_island"]
    main_report["stepIslandOverlaps"] = [{key: value for key, value in record.items() if key != "perSpread"}
                                        for record in overlapping if record["kind"] == "step_island"]
    main_report["stepStepOverlaps"] = [record for record in overlapping if record["kind"] == "step_step"]
    main_output = output.with_name(output.stem + "-main.json")
    main_output.write_text(json.dumps(main_report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"report": str(output), "mainReport": str(main_output), "runtimeSeconds": report["runtimeSeconds"],
                      "mainIslandPairs": [{"ids": item["ids"], "peak": item["peak"]} for item in main_report["mainIslandOverlaps"]],
                      "changedDuringRun": changed}), flush=True)
    if changed:
        raise SystemExit("Inputs changed during analysis; rerun before using this report")


if __name__ == "__main__":
    main()
