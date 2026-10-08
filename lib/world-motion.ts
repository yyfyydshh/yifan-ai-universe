import { Container, Sprite } from "pixi.js";
import type { Texture } from "pixi.js";
import { floatingSteps, islandBodies } from "./world-layout";
import type { ZoneId } from "./world-data";

const TAU = Math.PI * 2;
const ENTRANCE_MS = 1600;

export type WorldBodyId = "central" | ZoneId;
export type WorldOffset = { x: number; y: number };

export type RigidSnapshot = {
  id: string;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

export type WorldMotionSnapshot = {
  islands: RigidSnapshot[];
  steps: RigidSnapshot[];
};

export type WorldMotion = {
  view: Container;
  painted: Sprite[];
  /** Children use absolute base world coordinates; this node adds only offset. */
  body: (id: WorldBodyId) => Container;
  /** Current visible body translation, including spread and vertical drift. */
  offset: (id: WorldBodyId) => WorldOffset;
  /** External eased progress. This method applies the pose without animating it. */
  setSpread: (progress: number) => void;
  /** Monotonic milliseconds. Disabling freezes drift, not explicit setSpread. */
  update: (timeMs: number, enabled: boolean) => void;
  /** Actual sprite geometry, with camera/view transforms deliberately excluded. */
  snapshot: () => WorldMotionSnapshot;
  /** Destroys nodes and attached children; all supplied textures remain borrowed. */
  destroy: () => void;
};

type IslandDefinition = (typeof islandBodies)[number];
type StepDefinition = (typeof floatingSteps)[number];
type IslandNode = {
  definition: IslandDefinition;
  container: Container;
  sprite: Sprite;
  floatY: number;
};
type StepNode = {
  definition: StepDefinition;
  sprite: Sprite;
  from: IslandNode;
  to: IslandNode;
  floatY: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const smoothstep = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Independent rigid islands and stair modules. Only positions change over time:
 * no vertex deformation, offscreen rasterisation, scaling or rotation animation.
 * Layout periods are milliseconds and phases are radians.
 */
export function createWorldMotion(textures: Record<string, Texture>): WorldMotion {
  const textureFor = (asset: string) => {
    const texture = textures[asset];
    if (!texture || texture.destroyed) throw new Error("Missing world texture: " + asset);
    return texture;
  };
  // Validate borrowed assets before constructing a partial display tree.
  islandBodies.forEach(definition => textureFor(definition.asset));
  if (floatingSteps.length) textureFor("rigid-stair");

  const view = new Container({ label: "rigid-world" });
  view.eventMode = "none";
  const painted: Sprite[] = [];
  const islands = new Map<WorldBodyId, IslandNode>();
  const steps: StepNode[] = [];
  let spread = 0;
  let destroyed = false;
  let lastTime: number | null = null;
  let activeTime = 0;
  let wasEnabled = false;

  const makeSprite = (
    asset: string,
    definition: { id: string; x: number; y: number; width: number; height: number },
  ) => {
    const sprite = new Sprite({ texture: textureFor(asset), label: definition.id });
    sprite.position.set(definition.x, definition.y);
    sprite.width = definition.width;
    sprite.height = definition.height;
    sprite.eventMode = "none";
    return sprite;
  };

  for (const definition of islandBodies) {
    const container = new Container({ label: "island:" + definition.id });
    const sprite = makeSprite(definition.asset, definition);
    container.addChild(sprite);
    islands.set(definition.id, { definition, container, sprite, floatY: 0 });
  }
  const findBody = (id: WorldBodyId) => {
    const node = islands.get(id);
    if (!node) throw new Error("Unknown world body: " + id);
    return node;
  };
  for (const definition of floatingSteps) {
    const sprite = makeSprite("rigid-stair", definition);
    steps.push({
      definition,
      sprite,
      from: findBody(definition.from),
      to: findBody(definition.to),
      floatY: 0,
    });
    painted.push(sprite);
  }
  // A descending stair overlaps its departure cliff but goes behind the next
  // terrace. Back-to-front t order makes close treads read as one staircase.
  for (const node of islands.values()) {
    view.addChild(node.container);
    painted.push(node.sprite);
    for (const step of steps.filter(step=>step.definition.from===node.definition.id)) view.addChild(step.sprite);
  }

  const placeNodes = () => {
    for (const { definition, container, floatY } of islands.values()) {
      container.position.set(definition.clusterX*(1-spread)+definition.spreadX*spread,definition.clusterY*(1-spread)+definition.spreadY*spread+floatY);
    }
    for (const { definition, sprite, from, to, floatY } of steps) {
      const t = clamp(definition.t, 0, 1);
      const x = from.container.x * (1 - t) + to.container.x * t;
      const y = from.container.y * (1 - t) + to.container.y * t + floatY;
      sprite.position.set(definition.x + x, definition.y + y);
    }
  };

  const readSnapshot = (id: string, sprite: Sprite, offsetX: number, offsetY: number): RigidSnapshot => ({
    id,
    offsetX,
    offsetY,
    x: sprite.x + offsetX,
    y: sprite.y + offsetY,
    width: sprite.width,
    height: sprite.height,
    rotation: sprite.rotation,
    scaleX: sprite.scale.x,
    scaleY: sprite.scale.y,
  });

  placeNodes();

  return {
    view,
    painted,
    body(id) {
      return findBody(id).container;
    },
    offset(id) {
      const container = findBody(id).container;
      return { x: container.x, y: container.y };
    },
    setSpread(progress) {
      if (destroyed || view.destroyed || !Number.isFinite(progress)) return;
      const next = clamp(progress, 0, 1);
      if (next === spread) return;
      spread = next;
      placeNodes();
    },
    update(timeMs, enabled) {
      if (destroyed || view.destroyed || !Number.isFinite(timeMs)) return;
      const delta = lastTime === null ? 0 : clamp(timeMs - lastTime, 0, 100);
      lastTime = timeMs;
      if (!enabled) {
        wasEnabled = false;
        return;
      }
      // Do not advance across a pause, or on the first enabled call.
      if (wasEnabled) activeTime += delta;
      wasEnabled = true;
      if (delta === 0 || activeTime === 0) return;
      const entrance = smoothstep(activeTime / ENTRANCE_MS);
      for (const node of islands.values()) {
        const { amplitude, period, phase } = node.definition;
        node.floatY = Math.sin((activeTime / period) * TAU + phase) * amplitude * (.42+.58*spread) * entrance;
      }
      for (const node of steps) {
        const { amplitude, period, phase } = node.definition;
        node.floatY = Math.sin((activeTime / period) * TAU + phase) * amplitude * entrance;
      }
      placeNodes();
    },
    snapshot() {
      if (destroyed) return { islands: [], steps: [] };
      return {
        islands: [...islands.values()].map(({ definition, container, sprite }) => (
          readSnapshot(definition.id, sprite, container.x, container.y)
        )),
        steps: steps.map(({ definition, sprite }) => ({
          ...readSnapshot(definition.id, sprite, 0, 0),
          offsetX: sprite.x - definition.x,
          offsetY: sprite.y - definition.y,
        })),
      };
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (!view.destroyed) {
        view.destroy({ children: true, texture: false, textureSource: false });
      }
      islands.clear();
      steps.length = 0;
      painted.length = 0;
    },
  };
}

