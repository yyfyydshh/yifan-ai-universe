#!/usr/bin/env python3
"""Read-only raster alignment: asset pixels -> original reference pixels.

Only x_ref = scale * x_asset + tx, y_ref = scale * y_asset + ty is fitted.
No rotation, anisotropic scale, homography, image output, or layout mutation.
Requires numpy + opencv-python-headless. Run --help for optional dependency path.
Exit 0: every requested asset accepted; 2: missing/rejected assets; 1: fatal error.
Feature agreement validates visible anchors, not newly repaired hidden contours.
"""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DIR = ROOT / "references/drafts/world-v4"
# Source-only visible anchors, manually identified in the 1309 x 1201 reference.
# Do not auto-rescale these regions for another reference; provide --regions.
DEFAULT_REGIONS = {
    "reference_size": [1309, 1201],
    "regions": {
        "work": {"source_rect": [157, 270, 381, 441], "label": "original workshop roof, desk, chair, porch"},
        "writing": {"source_rect": [346, 37, 567, 255], "label": "original two-storey writing house"},
        "music": {"source_rect": [760, 80, 986, 270], "label": "original record, roof, speakers and porch"},
        "games": {"source_rect": [992, 197, 1224, 373], "label": "original games roof, table and porch"},
        "films": {"source_rect": [803, 375, 1013, 540], "label": "original cinema roof, screen and seats"},
        "stuff": {"source_rect": [1004, 475, 1227, 649], "label": "original storage roof, shelves and porch"},
        "thoughts": {"source_rect": [207, 632, 348, 711], "label": "original bench, not repaired underside"},
        "central": {
            "source_polygon": [[427, 503], [541, 466], [715, 454], [802, 484], [788, 552], [697, 584], [511, 562]],
            "label": "source-visible central lawn texture; low texture may correctly fail",
        },
    },
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_image(path):
    raw = cv2.imdecode(np.fromfile(str(path), dtype=np.uint8), cv2.IMREAD_UNCHANGED)
    if raw is None:
        raise ValueError(f"Cannot decode image: {path}")
    if raw.ndim == 2:
        gray, alpha = raw, np.full(raw.shape, 255, np.uint8)
    elif raw.shape[2] == 4:
        alpha = raw[:, :, 3]
        gray = cv2.cvtColor(raw[:, :, :3], cv2.COLOR_BGR2GRAY)
    elif raw.shape[2] == 3:
        gray = cv2.cvtColor(raw, cv2.COLOR_BGR2GRAY)
        alpha = np.full(gray.shape, 255, np.uint8)
    else:
        raise ValueError("Unsupported channel count")
    if gray.dtype != np.uint8:
        raise ValueError("Only 8-bit images are supported; no implicit conversion")
    # Hidden RGB and transparent canvas boundaries must not become features.
    gray = np.where(alpha >= 250, gray, 255).astype(np.uint8)
    mask = cv2.erode((alpha >= 250).astype(np.uint8) * 255, np.ones((5, 5), np.uint8))
    return gray, mask, alpha


def region_mask(shape, spec):
    mask = np.zeros(shape, np.uint8)
    if "source_polygon" in spec:
        polygon = np.asarray(spec["source_polygon"], np.float64)
    else:
        x0, y0, x1, y1 = spec["source_rect"]
        polygon = np.array([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], np.float64)
    if polygon.ndim != 2 or polygon.shape[1] != 2 or len(polygon) < 3:
        raise ValueError("Invalid source polygon")
    if not np.isfinite(polygon).all() or (polygon < 0).any():
        raise ValueError("Invalid region coordinates")
    if (polygon[:, 0] >= shape[1]).any() or (polygon[:, 1] >= shape[0]).any():
        raise ValueError("Source region outside reference")
    cv2.fillPoly(mask, [np.rint(polygon).astype(np.int32)], 255)
    return mask, polygon


def fit_uniform(p, q):
    pc, qc = p - p.mean(axis=0), q - q.mean(axis=0)
    denominator = float(np.sum(pc * pc))
    if denominator < 1e-9:
        return None
    scale = float(np.sum(pc * qc) / denominator)
    shift = q.mean(axis=0) - scale * p.mean(axis=0)
    return scale, shift


def residuals(p, q, model):
    return np.linalg.norm(model[0] * p + model[1] - q, axis=1)


def ransac_uniform(p, q, threshold, trials=5000, seed=72):
    if len(p) < 2:
        return None, np.zeros(len(p), bool)
    rng = np.random.default_rng(seed)
    best, best_inliers, best_key = None, None, (0, float("-inf"))
    for _ in range(trials):
        pair = rng.choice(len(p), 2, replace=False)
        if np.linalg.norm(q[pair[0]] - q[pair[1]]) < 8:
            continue
        model = fit_uniform(p[pair], q[pair])
        if model is None or not 0.05 <= model[0] <= 8.0:
            continue
        errors = residuals(p, q, model)
        selected = errors <= threshold
        if selected.sum() < 2:
            continue
        key = (int(selected.sum()), -float(np.median(errors[selected])))
        if key > best_key:
            best, best_inliers, best_key = model, selected, key
    if best is None:
        return None, np.zeros(len(p), bool)
    for _ in range(8):
        refined = fit_uniform(p[best_inliers], q[best_inliers])
        if refined is None:
            break
        selected = residuals(p, q, refined) <= threshold
        if selected.sum() < 2:
            break
        best = refined
        if np.array_equal(selected, best_inliers):
            best_inliers = selected
            break
        best_inliers = selected
    return best, best_inliers


def mutual_matches(source_kp, source_desc, asset_kp, asset_desc, ratio):
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    forward = matcher.knnMatch(source_desc, asset_desc, k=2)
    reverse = matcher.knnMatch(asset_desc, source_desc, k=2)
    reverse_good = {m.queryIdx: m.trainIdx for pair in reverse if len(pair) == 2
                    for m, n in [pair] if m.distance < ratio * n.distance}
    candidates = [m for pair in forward if len(pair) == 2 for m, n in [pair]
                  if m.distance < ratio * n.distance and reverse_good.get(m.trainIdx) == m.queryIdx]
    # Multiple SIFT orientations at the same corner must not inflate evidence.
    accepted, p, q = [], [], []
    for m in sorted(candidates, key=lambda item: item.distance):
        ap = np.array(asset_kp[m.trainIdx].pt)
        sp = np.array(source_kp[m.queryIdx].pt)
        if q and (np.min(np.linalg.norm(np.asarray(q) - sp, axis=1)) < 3
                  or np.min(np.linalg.norm(np.asarray(p) - ap, axis=1)) < 3):
            continue
        accepted.append(m)
        p.append(ap)
        q.append(sp)
    return np.asarray(p, np.float64).reshape(-1, 2), np.asarray(q, np.float64).reshape(-1, 2), accepted


def align_one(asset_id, path, source_gray, source_opaque, spec, args):
    result = {"id": asset_id, "asset": str(path), "status": "failed", "transform": None,
              "source_feature_region": spec, "reasons": []}
    if not path.is_file():
        result["reasons"] = ["missing_asset"]
        return result
    initial_hash = digest(path)
    gray, opaque, alpha = read_image(path)
    yy, xx = np.nonzero(alpha)
    result.update({"asset_sha256": initial_hash, "asset_size": [gray.shape[1], gray.shape[0]],
                   "asset_nontransparent_bbox": [int(xx.min()), int(yy.min()), int(xx.max()) + 1, int(yy.max()) + 1]
                   if len(xx) else None})
    roi, polygon = region_mask(source_gray.shape, spec)
    roi = cv2.bitwise_and(roi, source_opaque)
    detector = cv2.SIFT_create(nfeatures=10000, contrastThreshold=0.02, edgeThreshold=12)
    sk, sd = detector.detectAndCompute(source_gray, roi)
    ak, ad = detector.detectAndCompute(gray, opaque)
    result["feature_counts"] = {"source": len(sk), "asset": len(ak)}
    if sd is None or ad is None or min(len(sk), len(ak)) < 2:
        result["reasons"] = ["insufficient_features"]
        return result
    p, q, matches = mutual_matches(sk, sd, ak, ad, args.ratio)
    result["tentative_matches"] = len(p)
    result["matched_feature_pairs"] = [
        {"asset_xy": a.tolist(), "reference_xy": b.tolist(), "residual_px": None,
         "inlier": False, "descriptor_distance": float(match.distance)}
        for a, b, match in zip(p, q, matches)]
    if len(p) < args.min_inliers:
        result["reasons"] = ["insufficient_mutual_matches"]
        return result
    model, selected = ransac_uniform(p, q, args.ransac_px)
    if model is None:
        result["reasons"] = ["no_uniform_scale_translation_consensus"]
        return result
    errors = residuals(p, q, model)
    e, anchor = errors[selected], q[selected]
    lo, hi = polygon.min(axis=0), polygon.max(axis=0)
    span = np.ptp(anchor, axis=0) / np.maximum(hi - lo, 1)
    hull_area = float(cv2.contourArea(cv2.convexHull(anchor.astype(np.float32)))) if len(anchor) >= 3 else 0.0
    region_area = max(float(cv2.contourArea(polygon.astype(np.float32))), 1)
    cells = np.clip(((anchor - lo) / np.maximum(hi - lo, 1) * 3).astype(int), 0, 2)
    occupied = len(set(map(tuple, cells.tolist())))
    metrics = {"inliers": int(selected.sum()), "inlier_ratio": float(selected.mean()),
               "rmse_px": float(np.sqrt(np.mean(e * e))), "median_px": float(np.median(e)),
               "p95_px": float(np.percentile(e, 95)), "max_px": float(e.max()),
               "source_span_fraction": span.tolist(), "source_hull_fraction": hull_area / region_area,
               "source_grid_cells_of_9": occupied, "all_matches_median_px": float(np.median(errors))}
    result["metrics"] = metrics
    checks = {
        "insufficient_inliers": metrics["inliers"] < args.min_inliers,
        "low_inlier_ratio": metrics["inlier_ratio"] < 0.35,
        "high_rmse": metrics["rmse_px"] > args.max_rmse,
        "high_p95": metrics["p95_px"] > args.max_p95,
        "narrow_source_coverage": bool((span < 0.45).any()),
        "small_source_hull": metrics["source_hull_fraction"] < 0.10,
        "localized_source_features": occupied < 4,
    }
    result["reasons"] = [name for name, failed in checks.items() if failed]
    s, t = model
    candidate = {"scale": s, "tx": float(t[0]), "ty": float(t[1]),
                 "matrix": [[s, 0.0, float(t[0])], [0.0, s, float(t[1])]],
                 "canvas_in_reference": {"left": float(t[0]), "top": float(t[1]),
                                         "width": s * gray.shape[1], "height": s * gray.shape[0]}}
    result["diagnostic_candidate_not_for_layout"] = candidate
    result["matched_feature_pairs"] = [
        {"asset_xy": a.tolist(), "reference_xy": b.tolist(), "residual_px": float(err),
         "inlier": bool(ok), "descriptor_distance": float(match.distance)}
        for a, b, err, ok, match in zip(p, q, errors, selected, matches)]
    if digest(path) != initial_hash:
        result["reasons"].append("asset_changed_during_alignment")
    if not result["reasons"]:
        result["status"], result["transform"] = "accepted", candidate
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reference", type=Path, default=DEFAULT_DIR / "island-complete.png")
    parser.add_argument("--extract-dir", type=Path, default=DEFAULT_DIR)
    parser.add_argument("--pattern", default="extract-{id}.png")
    parser.add_argument("--output", type=Path, default=DEFAULT_DIR / "alignment.json")
    parser.add_argument("--regions", type=Path, help="JSON with reference_size and regions; source_rect or source_polygon per id")
    parser.add_argument("--ids", nargs="+", help="Only evaluate these region IDs; default all eight")
    parser.add_argument("--dependency-path", type=Path, help="Optional isolated pip --target directory")
    parser.add_argument("--ratio", type=float, default=0.70)
    parser.add_argument("--min-inliers", type=int, default=12)
    parser.add_argument("--ransac-px", type=float, default=2.5)
    parser.add_argument("--max-rmse", type=float, default=1.25)
    parser.add_argument("--max-p95", type=float, default=2.0)
    args = parser.parse_args()
    if args.dependency_path:
        sys.path.insert(0, str(args.dependency_path))
    global cv2, np
    try:
        import cv2
        import numpy as np
    except ImportError as exc:
        parser.exit(1, f"Missing dependency: {exc}. Install numpy + opencv-python-headless or use --dependency-path.\n")
    if not (0 < args.ratio < 1 and args.min_inliers >= 4 and args.ransac_px > 0
            and 0 < args.max_rmse <= args.ransac_px and 0 < args.max_p95 <= args.ransac_px):
        parser.error("Invalid thresholds")
    config = json.loads(args.regions.read_text(encoding="utf-8-sig")) if args.regions else DEFAULT_REGIONS
    report = {"schema_version": 1, "created_utc": datetime.now(timezone.utc).isoformat(),
              "status": "failed", "reference": str(args.reference), "model": "positive_uniform_scale_plus_translation",
              "mapping": "reference_xy = scale * asset_canvas_xy + [tx, ty]",
              "validation_scope": "Visible source-anchor geometry only; not pixel identity, repaired contours, occlusion order, or final visual fidelity. Failed transform is always null; diagnostic candidates must not be applied to layout.",
              "opencv_version": cv2.__version__, "source_regions": config,
              "thresholds": {"ratio": args.ratio, "min_inliers": args.min_inliers,
                             "ransac_px": args.ransac_px, "max_rmse_px": args.max_rmse, "max_p95_px": args.max_p95,
                             "min_inlier_ratio": 0.35, "min_span_fraction_each_axis": 0.45,
                             "min_hull_fraction": 0.10, "min_grid_cells_of_9": 4}, "assets": []}
    try:
        reference_hash = digest(args.reference)
        source_gray, source_opaque, _ = read_image(args.reference)
        report["reference_size"] = [source_gray.shape[1], source_gray.shape[0]]
        report["reference_sha256"] = reference_hash
        if report["reference_size"] != config["reference_size"]:
            raise ValueError("Reference size differs from source-region coordinates; supply a new --regions file")
        ids = args.ids or list(config["regions"])
        for asset_id in ids:
            if asset_id not in config["regions"]:
                raise ValueError(f"Unknown region ID: {asset_id}")
            path = args.extract_dir / args.pattern.format(id=asset_id)
            try:
                result = align_one(asset_id, path, source_gray, source_opaque, config["regions"][asset_id], args)
            except Exception as exc:
                result = {"id": asset_id, "asset": str(path), "status": "failed", "transform": None,
                          "source_feature_region": config["regions"][asset_id], "reasons": [f"alignment_error: {exc}"]}
            report["assets"].append(result)
        accepted = sum(a["status"] == "accepted" for a in report["assets"])
        if digest(args.reference) != reference_hash:
            for item in report["assets"]:
                item["status"], item["transform"] = "failed", None
                item["reasons"].append("reference_changed_during_alignment")
            accepted = 0
        report["summary"] = {"requested": len(ids), "accepted": accepted, "failed": len(ids) - accepted}
        report["status"] = "accepted" if accepted == len(ids) else "failed"
    except Exception as exc:
        report["fatal_error"] = str(exc)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(args.output), "status": report["status"],
                      "summary": report.get("summary"), "fatal_error": report.get("fatal_error")}, ensure_ascii=False))
    return 1 if "fatal_error" in report else (0 if report["status"] == "accepted" else 2)


if __name__ == "__main__":
    raise SystemExit(main())
