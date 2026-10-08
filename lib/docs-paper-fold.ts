type Point = { x: number; y: number };
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

/** Fold the outer corner around its perpendicular bisector; no rigid 3D board. */
export function paperFold(width: number, height: number, progress: number, bend: number) {
  const p = clamp(progress, .0001, .9999);
  const corner = { x: width, y: height };
  const pulled = { x: width * (1 - 2 * p), y: height - Math.sin(Math.PI * p) * height * bend };
  const mid = { x: (corner.x + pulled.x) / 2, y: (corner.y + pulled.y) / 2 };
  const length = Math.hypot(corner.x - pulled.x, corner.y - pulled.y);
  const nx = (corner.x - pulled.x) / length, ny = (corner.y - pulled.y) / length;
  const distance = (point: Point) => (point.x - mid.x) * nx + (point.y - mid.y) * ny;
  const rectangle = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }];
  function clip(keepFront: boolean) {
    const output: Point[] = [];
    for (let i = 0; i < rectangle.length; i++) {
      const a = rectangle[i], b = rectangle[(i + 1) % rectangle.length];
      const da = distance(a), db = distance(b);
      const insideA = keepFront ? da <= 0 : da >= 0, insideB = keepFront ? db <= 0 : db >= 0;
      if (insideA) output.push(a);
      if (insideA !== insideB) { const t = da / (da - db); output.push({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) }); }
    }
    return output;
  }
  const front = clip(true), back = clip(false);
  const polygon = (points: Point[]) => `polygon(${points.map(point => `${point.x / width * 100}% ${point.y / height * 100}%`).join(",")})`;
  const offset = nx * mid.x + ny * mid.y;
  const crease = front.filter(point => Math.abs(distance(point)) < .1);
  let curve = "";
  if (crease.length >= 2) {
    const [a, b] = crease;
    const bow = Math.sin(Math.PI * p) * Math.min(width * .055, 24);
    const middle = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const band = bow * .65;
    curve = `M ${a.x} ${a.y} Q ${middle.x - nx * bow} ${middle.y - ny * bow} ${b.x} ${b.y} L ${b.x - nx * band} ${b.y - ny * band} Q ${middle.x - nx * (bow + band)} ${middle.y - ny * (bow + band)} ${a.x - nx * band} ${a.y - ny * band} Z`;
  }
  return { front: polygon(front), back: polygon(back), matrix: `matrix(${1 - 2 * nx * nx},${-2 * nx * ny},${-2 * nx * ny},${1 - 2 * ny * ny},${2 * nx * offset},${2 * ny * offset})`, curve };
}
