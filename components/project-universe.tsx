"use client";

import Link from "next/link";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { projects } from "@/lib/site-data";
import { ProjectIcon } from "@/components/project-icon";

const DRAG_THRESHOLD = 6;
const KEYBOARD_STEP = 12;
const RESUME_DELAY = 1200;
const MAX_DRAG_SPEED = 0.065;
const HOME_DRAG_X = 0.11;
const HOME_DRAG_Y = 0.07;
const HOME_MAX_INERTIA_SPEED = 0.045;

type Vector3 = { x: number; y: number; z: number };
type Rotation3 = { yaw: number; pitch: number; roll: number };

type PointerState = {
  id: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
  dragged: boolean;
  startedOnProject: boolean;
};

const unit = (x: number, y: number, z: number): Vector3 => {
  const length = Math.hypot(x, y, z) || 1;
  return { x: x / length, y: y / length, z: z / length };
};

const magnitude = (rotation: Rotation3) => Math.hypot(rotation.yaw, rotation.pitch, rotation.roll);

const normalizeRotation = (rotation: Rotation3): Rotation3 => {
  const length = magnitude(rotation) || 1;
  return {
    yaw: rotation.yaw / length,
    pitch: rotation.pitch / length,
    roll: rotation.roll / length,
  };
};

const clampRotationSpeed = (rotation: Rotation3, maximum: number): Rotation3 => {
  const speed = magnitude(rotation);
  if (speed <= maximum) return rotation;
  const ratio = maximum / speed;
  return {
    yaw: rotation.yaw * ratio,
    pitch: rotation.pitch * ratio,
    roll: rotation.roll * ratio,
  };
};

const wrapDegrees = (value: number) => ((value + 540) % 360) - 180;

const rotatePoint = (point: Vector3, rotation: Rotation3): Vector3 => {
  const yaw = rotation.yaw * Math.PI / 180;
  const pitch = rotation.pitch * Math.PI / 180;
  const roll = rotation.roll * Math.PI / 180;

  const yawX = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const yawZ = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const pitchY = point.y * Math.cos(pitch) - yawZ * Math.sin(pitch);
  const pitchZ = point.y * Math.sin(pitch) + yawZ * Math.cos(pitch);

  return {
    x: yawX * Math.cos(roll) - pitchY * Math.sin(roll),
    y: yawX * Math.sin(roll) + pitchY * Math.cos(roll),
    z: pitchZ,
  };
};

const FULL_SPHERE_POINTS: Vector3[] = [
  unit(-0.82, 0.05, 0.32),
  unit(-0.06, -0.02, 1),
  unit(0.78, -0.08, 0.38),
  unit(-0.30, 0.78, -0.42),
  unit(0.62, 0.66, -0.12),
  unit(-0.58, -0.75, -0.35),
  unit(0.46, -0.82, -0.40),
];

// One shared orbit, composed to match the locked hero reference:
// two quieter satellites above the portrait, two nearer satellites below it.
const HOME_PROJECT_SLUGS = [
  "global-opinion",
  "sales-copilot",
  "docs-system",
  "regulatory-risk",
  "humanizer",
] as const;

// Five satellites share one continuous phase at equal 72-degree intervals.
// The common offset leaves the locked portrait's face and shoulders readable;
// no screen-space correction or per-project trajectory is used.
const HOME_PROJECT_PHASES = [132, 60, 204, 348, 276];
const HOME_ORBIT_DEPTH_TILT = 58 * Math.PI / 180;
const HOME_ORBIT_SCREEN_TILT = -6 * Math.PI / 180;
const HOME_ORBIT_LANES = [0.91, 1, 1.09];

const pointOnHomeOrbit = (angleDegrees: number): Vector3 => {
  const angle = angleDegrees * Math.PI / 180;
  const orbitX = Math.cos(angle);
  const orbitY = Math.sin(angle) * Math.cos(HOME_ORBIT_DEPTH_TILT);
  // The lower half of the ellipse is the foreground half. This makes the
  // perspective read like a real ring wrapping around the fixed portrait.
  const orbitZ = -Math.sin(angle) * Math.sin(HOME_ORBIT_DEPTH_TILT);
  return {
    x: orbitX * Math.cos(HOME_ORBIT_SCREEN_TILT) - orbitY * Math.sin(HOME_ORBIT_SCREEN_TILT),
    y: orbitX * Math.sin(HOME_ORBIT_SCREEN_TILT) + orbitY * Math.cos(HOME_ORBIT_SCREEN_TILT),
    z: orbitZ,
  };
};

type OrbitLayout = { x: number; y: number; depth: number };

type ProjectUniverseProps = {
  variant?: "home" | "work";
  ambientAvatarSrc?: string;
  revealAvatarSrc?: string;
};

export function ProjectUniverse({
  variant = "work",
  ambientAvatarSrc,
  revealAvatarSrc,
}: ProjectUniverseProps) {
  const router = useRouter();
  const isHome = variant === "home";
  const shown = useMemo(() => {
    if (!isHome) return projects;
    return HOME_PROJECT_SLUGS.flatMap((slug) => {
      const project = projects.find((candidate) => candidate.slug === slug);
      return project ? [project] : [];
    });
  }, [isHome]);
  const rootRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const rotationRef = useRef<Rotation3>(isHome
    ? { yaw: 0, pitch: 0, roll: 0 }
    : { yaw: 0, pitch: 0, roll: -7 });
  const motionClockRef = useRef(0);
  const renderedLayoutsRef = useRef<OrbitLayout[]>([]);
  const layoutFrameTimeRef = useRef(0);
  const backOrbitPathRefs = useRef<Array<SVGPathElement | null>>([]);
  const frontOrbitPathRefs = useRef<Array<SVGPathElement | null>>([]);
  const orbitSizeRef = useRef("");
  const velocityRef = useRef<Rotation3>({ yaw: 0, pitch: 0, roll: 0 });
  const cruiseDirectionRef = useRef<Rotation3>(
    normalizeRotation(isHome
      ? { yaw: 1, pitch: 0, roll: 0 }
      : { yaw: 0.82, pitch: 0.36, roll: 0.16 }),
  );
  const inertiaActiveRef = useRef(false);
  const hoveredIndexRef = useRef<number | null>(null);
  const focusedIndexRef = useRef<number | null>(null);
  const suppressClickUntilRef = useRef(0);
  const pointerRef = useRef<PointerState | null>(null);
  const lastFrameRef = useRef(0);
  const resumeAtRef = useRef(0);
  const pauseReasons = useRef(new Set<string>());
  const pointerInsideRef = useRef(false);
  const revealResumeAtRef = useRef(0);
  const revealStrengthRef = useRef(0);
  const homeOrbBoostRef = useRef(1.15);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealPaintTimerRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);

  const setPaused = useCallback((reason: string, paused: boolean) => {
    if (paused) pauseReasons.current.add(reason);
    else pauseReasons.current.delete(reason);
  }, []);

  useEffect(() => {
    setPaused("manual", manuallyPaused);
  }, [manuallyPaused, setPaused]);

  const setRevealStrength = useCallback((strength: number) => {
    if (!isHome) return;
    revealStrengthRef.current = strength;
    const root = rootRef.current;
    root?.style.setProperty("--avatar-reveal", `${strength}`);
    // Chromium can defer repainting a replaced image when its opacity only
    // changes through a custom property. Mirroring the value onto the image
    // keeps the V4 → V5 crossfade deterministic without changing its timing.
    const reveal = root?.querySelector<HTMLElement>(".universe-avatar__image--reveal");
    if (!reveal) return;
    if (revealPaintTimerRef.current) clearTimeout(revealPaintTimerRef.current);
    const targetOpacity = strength >= 1 ? 0.999 : strength;
    if (targetOpacity <= 0.08) {
      reveal.style.setProperty("opacity", `${targetOpacity}`);
      return;
    }
    reveal.style.setProperty("opacity", `${Math.max(0, targetOpacity - 0.002)}`);
    revealPaintTimerRef.current = window.setTimeout(() => {
      reveal.style.setProperty("opacity", `${targetOpacity}`);
      revealPaintTimerRef.current = null;
    }, 24);
  }, [isHome]);

  const syncPointerVisuals = useCallback((clientX: number, clientY: number) => {
    const root = rootRef.current;
    if (!root || !isHome) return;
    const bounds = root.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height));
    root.style.setProperty("--reveal-x", `${x * 100}%`);
    root.style.setProperty("--reveal-y", `${y * 100}%`);
  }, [isHome]);

  const applyPositions = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const width = root.clientWidth;
    const height = root.clientHeight;
    const motionSeconds = motionClockRef.current / 1000;
    const rotation = rotationRef.current;
    const centerX = width * (isHome ? 0.55 : 0.6);
    const centerY = height * (isHome ? 0.44 : 0.51);
    const radiusX = Math.min(width * (isHome ? 0.34 : 0.32), height * (isHome ? 0.78 : 0.72));
    const radiusY = height * (isHome ? 0.44 : 0.37);
    const breathe = 1 + Math.sin(motionSeconds * 0.11) * 0.008;

    root.style.setProperty("--scene-yaw", `${rotation.yaw}deg`);
    root.style.setProperty("--scene-pitch", `${rotation.pitch}deg`);
    root.style.setProperty("--scene-roll", `${rotation.roll}deg`);
    root.style.setProperty("--field-breathe", `${breathe}`);
    root.style.setProperty(
      "--axis-angle",
      `${Math.atan2(cruiseDirectionRef.current.pitch, cruiseDirectionRef.current.yaw) * 180 / Math.PI}deg`,
    );

    const layouts: OrbitLayout[] = shown.map((_, index) => {
      if (isHome) {
        const point = pointOnHomeOrbit(HOME_PROJECT_PHASES[index] + rotation.yaw);
        const perspective = 3.2 / (3.2 - point.z);
        return {
          x: centerX - width / 2 + point.x * radiusX * perspective,
          y: centerY - height / 2 - point.y * radiusY * perspective,
          depth: Math.max(0, Math.min(1, (point.z + Math.sin(HOME_ORBIT_DEPTH_TILT)) / (Math.sin(HOME_ORBIT_DEPTH_TILT) * 2))),
        };
      }

      const phase = index * 1.61803398875;
      const localRotation: Rotation3 = {
        yaw: Math.sin(motionSeconds * (0.075 + index * 0.004) + phase) * 2.7,
        pitch: Math.cos(motionSeconds * (0.061 + index * 0.003) + phase * 1.3) * 2.1,
        roll: Math.sin(motionSeconds * (0.049 + index * 0.002) + phase * 0.7) * 1.4,
      };
      const radialBreathing = 1 + Math.sin(motionSeconds * (0.105 + index * 0.006) + phase) * 0.025;
      const localPoint = rotatePoint(FULL_SPHERE_POINTS[index], localRotation);
      const point = rotatePoint({
        x: localPoint.x * radialBreathing,
        y: localPoint.y * radialBreathing,
        z: localPoint.z * radialBreathing,
      }, rotation);
      const perspective = 5 / (5 - point.z);
      return {
        x: centerX - width / 2 + point.x * radiusX * perspective,
        y: centerY - height / 2 - point.y * radiusY * perspective,
        depth: Math.max(0, Math.min(1, (point.z + 1) / 2)),
      };
    });

    // The home orbit is fixed in space. Only its satellites move; regenerate
    // the sampled SVG paths on resize instead of rebuilding them every frame.
    const orbitSize = `${width}:${height}`;
    if (isHome && orbitSizeRef.current !== orbitSize) {
      orbitSizeRef.current = orbitSize;
      root.querySelectorAll<SVGSVGElement>(".universe-orbit-field")
        .forEach((field) => field.setAttribute("viewBox", `0 0 ${width} ${height}`));
      const projectToViewport = (point: Vector3) => {
        const perspective = 3.2 / (3.2 - point.z);
        return {
          x: centerX + point.x * radiusX * perspective,
          y: centerY - point.y * radiusY * perspective,
        };
      };
      HOME_ORBIT_LANES.forEach((laneScale, laneIndex) => {
        const backCommands: string[] = [];
        const frontCommands: string[] = [];
        let previousLayer: "back" | "front" | null = null;
        for (let sampleIndex = 0; sampleIndex <= 128; sampleIndex += 1) {
          const point = pointOnHomeOrbit(sampleIndex / 128 * 360);
          const projected = projectToViewport({
            x: point.x * laneScale,
            y: point.y * laneScale,
            z: point.z,
          });
          const faceDistance = Math.hypot(
            (projected.x - width * 0.55) / (width * 0.14),
            (projected.y - height * 0.32) / (height * 0.19),
          );
          const layer = point.z >= 0 && faceDistance >= 1.08 ? "front" : "back";
          const commands = layer === "front" ? frontCommands : backCommands;
          commands.push(`${previousLayer === layer ? "L" : "M"}${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`);
          previousLayer = layer;
        }
        backOrbitPathRefs.current[laneIndex]?.setAttribute("d", backCommands.join(" "));
        frontOrbitPathRefs.current[laneIndex]?.setAttribute("d", frontCommands.join(" "));
      });
    }

    const frameTime = performance.now();
    const frameDelta = layoutFrameTimeRef.current
      ? Math.min(34, frameTime - layoutFrameTimeRef.current)
      : 0;
    layoutFrameTimeRef.current = frameTime;
    if (isHome) {
      const boostTarget = 1.15 - Math.min(1, revealStrengthRef.current) * 0.15;
      const boostBlend = frameDelta === 0 ? 1 : 1 - Math.exp(-frameDelta / 170);
      homeOrbBoostRef.current += (boostTarget - homeOrbBoostRef.current) * boostBlend;
    }
    const previousLayouts = renderedLayoutsRef.current;
    const blend = frameDelta === 0 ? 1 : 1 - Math.exp(-frameDelta / (isHome ? 54 : 42));
    const renderedLayouts = layouts.map((layout, index) => {
      const previous = previousLayouts[index];
      if (!previous || isHome || isMobile || reducedMotion) return { ...layout };
      return {
        x: previous.x + (layout.x - previous.x) * blend,
        y: previous.y + (layout.y - previous.y) * blend,
        depth: previous.depth + (layout.depth - previous.depth) * blend,
      };
    });
    renderedLayoutsRef.current = renderedLayouts;

    const faceDistanceFor = ({ x, y }: OrbitLayout) => isHome
      ? Math.hypot(
          (x - width * 0.045) / (width * 0.125),
          (y + height * 0.235) / (height * 0.17),
        )
      : 2;

    shown.forEach((_, index) => {
      const element = orbRefs.current[index];
      if (!element) return;
      const { x, y, depth } = renderedLayouts[index];
      const isRaised = hoveredIndexRef.current === index || focusedIndexRef.current === index;
      // The home ring has a deliberately wide scale range: a far-side
      // capability recedes to a compact satellite, while a near-side one
      // becomes the foreground object. Position, scale and z-index therefore
      // all read from the same physical depth instead of merely orbiting flat.
      const scale = (isHome ? (0.6 + depth * 0.66) * homeOrbBoostRef.current : 0.74 + depth * 0.34) * (isRaised ? 1.08 : 1);
      const opacity = 1; // Preserve text contrast; size and occlusion carry depth.
      // A single orbit has one unambiguous front half and back half. Every
      // satellite follows that same Z truth; the face guard only prevents a
      // foreground satellite from cutting across the portrait's face.
      const isForeground = isHome && depth >= 0.5 && faceDistanceFor(renderedLayouts[index]) >= 1.04;
      element.style.setProperty("--orbit-x", `${x}px`);
      element.style.setProperty("--orbit-y", `${y}px`);
      element.style.setProperty("--orbit-scale", `${scale}`);
      // Near the face, the satellite remains on its real path but stays behind
      // the locked transparent avatar. The avatar alpha provides the physical
      // occlusion; fading the satellite itself made the system look incomplete.
      element.style.setProperty("--orbit-opacity", `${opacity}`);
      // Hover must not pull a far-side project through the portrait. Keyboard
      // focus can lift it temporarily so every project remains accessible.
      const isKeyboardFocused = focusedIndexRef.current === index;
      element.style.zIndex = `${isKeyboardFocused || (!isHome && isRaised) ? 160 : isForeground ? Math.round(122 + depth * 10) : isHome ? Math.round(56 + depth * 10) : Math.round(42 + depth * 24)}`;
      element.dataset.depth = depth.toFixed(3);
      element.dataset.plane = isForeground ? "foreground" : "background";
    });
  }, [isHome, isMobile, reducedMotion, shown]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 48rem)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    sync();
    mobileQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      mobileQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => () => {
    if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    if (revealPaintTimerRef.current) clearTimeout(revealPaintTimerRef.current);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    if (reducedMotion) {
      setRevealStrength(0);
      rootRef.current?.style.setProperty("--avatar-ambient", "0.15");
      return;
    }
    rootRef.current?.style.setProperty("--avatar-ambient", "0.1");
  }, [isHome, reducedMotion, setRevealStrength]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused("viewport", !entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(root);
    const onVisibility = () => setPaused("visibility", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [setPaused]);

  useEffect(() => {
    applyPositions();
    const root = rootRef.current;
    if (!root) return;
    const resizeObserver = new ResizeObserver(applyPositions);
    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [applyPositions]);

  useEffect(() => {
    applyPositions();
    if (isMobile || reducedMotion) return;

    const duration = isHome ? 180_000 : 150_000;
    const cruiseSpeed = 360 / duration;

    const tick = (time: number) => {
      const delta = lastFrameRef.current ? Math.min(40, time - lastFrameRef.current) : 0;
      lastFrameRef.current = time;
      if (pauseReasons.current.has("manual")) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      const canMove = pauseReasons.current.size === 0 && !pointerRef.current;

      if (canMove && time >= resumeAtRef.current) {
        let angularVelocity: Rotation3;

        if (inertiaActiveRef.current) {
          const currentDirection = isHome
            ? { yaw: Math.sign(velocityRef.current.yaw) || Math.sign(cruiseDirectionRef.current.yaw) || 1, pitch: 0, roll: 0 }
            : normalizeRotation(velocityRef.current);
          const currentSpeed = magnitude(velocityRef.current);
          const decay = isHome ? 0.94 : 0.90;
          const nextSpeed = cruiseSpeed + (currentSpeed - cruiseSpeed) * Math.pow(decay, delta / 16);
          angularVelocity = {
            yaw: currentDirection.yaw * nextSpeed,
            pitch: currentDirection.pitch * nextSpeed,
            roll: currentDirection.roll * nextSpeed,
          };
          velocityRef.current = angularVelocity;
          if (nextSpeed <= cruiseSpeed * 1.06) inertiaActiveRef.current = false;
        } else {
          const phaseSeconds = motionClockRef.current / 1000;
          const base = cruiseDirectionRef.current;
          const precessedDirection = isHome
            ? { yaw: Math.sign(base.yaw) || 1, pitch: 0, roll: 0 }
            : normalizeRotation({
                yaw: base.yaw + Math.sin(phaseSeconds * 0.019) * 0.055,
                pitch: base.pitch + Math.cos(phaseSeconds * 0.017 + 0.8) * 0.045,
                roll: base.roll + Math.sin(phaseSeconds * 0.013 + 1.7) * 0.035,
              });
          angularVelocity = {
            yaw: precessedDirection.yaw * cruiseSpeed,
            pitch: precessedDirection.pitch * cruiseSpeed,
            roll: precessedDirection.roll * cruiseSpeed,
          };
          velocityRef.current = angularVelocity;
        }

        rotationRef.current = {
          yaw: isHome
            ? rotationRef.current.yaw + angularVelocity.yaw * delta
            : wrapDegrees(rotationRef.current.yaw + angularVelocity.yaw * delta),
          pitch: isHome
            ? 0
            : wrapDegrees(rotationRef.current.pitch + angularVelocity.pitch * delta),
          roll: isHome
            ? 0
            : wrapDegrees(rotationRef.current.roll + angularVelocity.roll * delta),
        };
        motionClockRef.current += delta;
      }

      applyPositions();
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      lastFrameRef.current = 0;
    };
  }, [applyPositions, isHome, isMobile, reducedMotion]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isMobile || reducedMotion || event.button !== 0 || (event.target as Element).closest("button")) return;
    syncPointerVisuals(event.clientX, event.clientY);
    if (isHome) {
      rootRef.current?.setAttribute("data-interaction", "pressing");
      setRevealStrength(1);
    }
    suppressClickUntilRef.current = 0;
    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      dragged: false,
      startedOnProject: Boolean((event.target as Element).closest("a.project-orb")),
    };
    velocityRef.current = { yaw: 0, pitch: 0, roll: 0 };
    inertiaActiveRef.current = false;
    setPaused("pointer", true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    syncPointerVisuals(event.clientX, event.clientY);
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) {
      if (isHome && pointerInsideRef.current) {
        const projectIsActive = hoveredIndexRef.current !== null || focusedIndexRef.current !== null;
        setRevealStrength(projectIsActive ? 0.85 : 1);
      }
      return;
    }

    const now = performance.now();
    const totalDeltaX = event.clientX - pointer.startX;
    const totalDeltaY = event.clientY - pointer.startY;
    const frameDeltaX = event.clientX - pointer.lastX;
    const frameDeltaY = event.clientY - pointer.lastY;
    const elapsed = Math.max(1, now - pointer.lastTime);

    if (!pointer.dragged && Math.hypot(totalDeltaX, totalDeltaY) >= DRAG_THRESHOLD) {
      pointer.dragged = true;
      suppressClickUntilRef.current = pointer.startedOnProject ? performance.now() + 800 : 0;
      setIsDragging(true);
      rootRef.current?.setAttribute("data-interaction", "dragging");
      setRevealStrength(0.08);
      event.currentTarget.setPointerCapture(event.pointerId);
      const active = document.activeElement;
      if (active instanceof HTMLElement && event.currentTarget.contains(active)) active.blur();
      setPaused("focus", false);
    }

    if (pointer.dragged) {
      event.preventDefault();
      const yawSensitivity = isHome ? HOME_DRAG_X : 0.18;
      const pitchSensitivity = isHome ? 0 : 0.16;
      const rollSensitivity = isHome ? 0 : 0.028;
      const homePhaseDelta = frameDeltaX * HOME_DRAG_X - frameDeltaY * HOME_DRAG_Y;
      const dragVelocity = clampRotationSpeed(isHome
        ? { yaw: homePhaseDelta / elapsed, pitch: 0, roll: 0 }
        : {
            yaw: (frameDeltaX * yawSensitivity) / elapsed,
            pitch: (-frameDeltaY * pitchSensitivity) / elapsed,
            roll: ((frameDeltaX - frameDeltaY) * rollSensitivity) / elapsed,
          }, isHome ? HOME_MAX_INERTIA_SPEED : MAX_DRAG_SPEED);
      velocityRef.current = {
        yaw: velocityRef.current.yaw * 0.58 + dragVelocity.yaw * 0.42,
        pitch: velocityRef.current.pitch * 0.58 + dragVelocity.pitch * 0.42,
        roll: velocityRef.current.roll * 0.58 + dragVelocity.roll * 0.42,
      };
      const deltaRotation = isHome
        ? { yaw: homePhaseDelta, pitch: 0, roll: 0 }
        : {
            yaw: frameDeltaX * yawSensitivity,
            pitch: -frameDeltaY * pitchSensitivity,
            roll: (frameDeltaX - frameDeltaY) * rollSensitivity,
          };
      rotationRef.current = {
        yaw: isHome
          ? rotationRef.current.yaw + deltaRotation.yaw
          : wrapDegrees(rotationRef.current.yaw + deltaRotation.yaw),
        pitch: isHome
          ? 0
          : wrapDegrees(rotationRef.current.pitch + deltaRotation.pitch),
        roll: isHome
          ? 0
          : wrapDegrees(rotationRef.current.roll + deltaRotation.roll),
      };
      applyPositions();
    }

    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    pointer.lastTime = now;
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const releasedAfterDrag = pointer.dragged;
    const releasedSpeed = magnitude(velocityRef.current);
    if (releasedAfterDrag) {
      const fallbackDirection = isHome
        ? {
            yaw: Math.sign(
              (event.clientX - pointer.startX) * HOME_DRAG_X
              - (event.clientY - pointer.startY) * HOME_DRAG_Y,
            ) || Math.sign(cruiseDirectionRef.current.yaw) || 1,
            pitch: 0,
            roll: 0,
          }
        : normalizeRotation({
            yaw: event.clientX - pointer.startX,
            pitch: pointer.startY - event.clientY,
            roll: (event.clientX - pointer.startX - event.clientY + pointer.startY) * 0.16,
          });
      const releaseDirection = releasedSpeed > 0.0005
        ? isHome
          ? { yaw: Math.sign(velocityRef.current.yaw) || fallbackDirection.yaw, pitch: 0, roll: 0 }
          : normalizeRotation(velocityRef.current)
        : fallbackDirection;
      const cruiseSpeed = 360 / (isHome ? 180_000 : 150_000);
      const carriedSpeed = Math.max(
        Math.min(releasedSpeed, isHome ? HOME_MAX_INERTIA_SPEED : MAX_DRAG_SPEED),
        cruiseSpeed,
      );
      cruiseDirectionRef.current = releaseDirection;
      velocityRef.current = {
        yaw: releaseDirection.yaw * carriedSpeed,
        pitch: releaseDirection.pitch * carriedSpeed,
        roll: releaseDirection.roll * carriedSpeed,
      };
      inertiaActiveRef.current = carriedSpeed > cruiseSpeed * 1.06;
      resumeAtRef.current = performance.now();
      hoveredIndexRef.current = null;
      setPaused("hover", false);
    } else {
      velocityRef.current = { yaw: 0, pitch: 0, roll: 0 };
      inertiaActiveRef.current = false;
      resumeAtRef.current = performance.now() + RESUME_DELAY;
    }
    setPaused("pointer", false);
    pointerRef.current = null;
    setIsDragging(false);
    if (isHome) {
      rootRef.current?.setAttribute("data-interaction", releasedAfterDrag ? "settling" : "exploring");
      setRevealStrength(releasedAfterDrag ? 0.08 : pointerInsideRef.current ? 1 : 0);
      if (releasedAfterDrag) {
        revealResumeAtRef.current = performance.now() + 220;
        window.setTimeout(() => {
          if (performance.now() < revealResumeAtRef.current || !pointerInsideRef.current) return;
          rootRef.current?.setAttribute("data-interaction", "exploring");
          setRevealStrength(hoveredIndexRef.current !== null || focusedIndexRef.current !== null ? 0.85 : 1);
        }, 230);
      }
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (isMobile || reducedMotion || !keys.includes(event.key)) return;
    event.preventDefault();
    const delta: Rotation3 = { yaw: 0, pitch: 0, roll: 0 };
    if (event.key === "ArrowLeft" || (isHome && event.key === "ArrowUp")) delta.yaw = -KEYBOARD_STEP;
    if (event.key === "ArrowRight" || (isHome && event.key === "ArrowDown")) delta.yaw = KEYBOARD_STEP;
    if (!isHome && event.key === "ArrowUp") delta.pitch = KEYBOARD_STEP;
    if (!isHome && event.key === "ArrowDown") delta.pitch = -KEYBOARD_STEP;
    rotationRef.current = {
      yaw: isHome ? rotationRef.current.yaw + delta.yaw : wrapDegrees(rotationRef.current.yaw + delta.yaw),
      pitch: isHome ? 0 : wrapDegrees(rotationRef.current.pitch + delta.pitch),
      roll: isHome ? 0 : rotationRef.current.roll,
    };
    cruiseDirectionRef.current = isHome
      ? { yaw: Math.sign(delta.yaw) || Math.sign(cruiseDirectionRef.current.yaw) || 1, pitch: 0, roll: 0 }
      : normalizeRotation({
          yaw: cruiseDirectionRef.current.yaw + delta.yaw / KEYBOARD_STEP * 0.7,
          pitch: cruiseDirectionRef.current.pitch + delta.pitch / KEYBOARD_STEP * 0.7,
          roll: cruiseDirectionRef.current.roll,
        });
    velocityRef.current = { yaw: 0, pitch: 0, roll: 0 };
    inertiaActiveRef.current = false;
    resumeAtRef.current = performance.now() + RESUME_DELAY;
    applyPositions();
  };

  const handleProjectNavigation = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    if (performance.now() < suppressClickUntilRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickUntilRef.current = 0;
      return;
    }
    if (!isHome || reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    rootRef.current?.setAttribute("data-interaction", "navigating");
    setRevealStrength(0);
    navigationTimerRef.current = setTimeout(() => router.push(href), 280);
  };

  return (
    <div
      ref={rootRef}
      className={`universe universe-v3 universe--${variant} ${isDragging ? "is-dragging" : ""}`}
      data-interaction={isHome ? "idle" : undefined}
      role="group"
      aria-label={isHome ? "五个核心项目沿一条斜向轨道环绕人物，可拖动或使用上下左右方向键改变公转方向" : "七个项目组成的三维项目宇宙，可拖动或使用上下左右方向键旋转"}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => {
        if (!isHome || isMobile || reducedMotion) return;
        pointerInsideRef.current = true;
        rootRef.current?.setAttribute("data-interaction", "exploring");
        syncPointerVisuals(event.clientX, event.clientY);
        setRevealStrength(hoveredIndexRef.current !== null || focusedIndexRef.current !== null ? 0.85 : 1);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onPointerLeave={(event) => {
        if (pointerRef.current && !pointerRef.current.dragged) finishPointer(event);
        pointerInsideRef.current = false;
        if (isHome && !pointerRef.current) {
          rootRef.current?.setAttribute("data-interaction", "idle");
          setRevealStrength(0);
        }
      }}
      onFocusCapture={(event) => setPaused("focus", !(event.target as Element).closest("button"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused("focus", false);
      }}
    >
      <div className="universe-toolbar">
        <p>{isHome ? "作品与能力" : "七个项目 · 一个能力系统"}<span>{String(shown.length).padStart(2, "0")} PROJECTS</span></p>
        {!isMobile && !reducedMotion ? (
          <button type="button" aria-pressed={manuallyPaused} aria-label={manuallyPaused ? "继续空间巡航" : "暂停空间巡航"} onClick={() => setManuallyPaused(paused => !paused)}>
            {manuallyPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            <span>{manuallyPaused ? "继续巡航" : "暂停巡航"}</span>
          </button>
        ) : null}
      </div>
      {isHome ? (
        <svg className="universe-orbit-field universe-orbit-field--back" aria-hidden="true">
          {HOME_ORBIT_LANES.map((_, laneIndex) => (
            <path
              className={`universe-orbit-path universe-orbit-path--${laneIndex + 1}`}
              key={`back-orbit-${laneIndex}`}
              ref={(element) => { backOrbitPathRefs.current[laneIndex] = element; }}
            />
          ))}
        </svg>
      ) : (
        <div className="universe-rings" aria-hidden="true">
          <span className="universe-ring universe-ring--equator" />
          <span className="universe-ring universe-ring--meridian-a" />
          <span className="universe-ring universe-ring--meridian-b" />
          <span className="universe-ring universe-ring--latitude" />
        </div>
      )}
      <div className="universe-axis" aria-hidden="true"><span /></div>
      {isHome ? <span className="universe-body-core" aria-hidden="true" /> : null}
      {isHome && ambientAvatarSrc && revealAvatarSrc ? (
        <div className="universe-avatar" aria-hidden="true">
          <Image
            className="universe-avatar__image universe-avatar__image--ambient"
            src={ambientAvatarSrc}
            alt=""
            fill
            priority
            sizes="(min-width: 48rem) 44vw, 100vw"
          />
          <Image
            className="universe-avatar__image universe-avatar__image--reveal"
            src={revealAvatarSrc}
            alt=""
            fill
            priority
            sizes="(min-width: 48rem) 44vw, 100vw"
          />
        </div>
      ) : null}
      {isHome ? (
        <svg className="universe-orbit-field universe-orbit-field--front" aria-hidden="true">
          {HOME_ORBIT_LANES.map((_, laneIndex) => (
            <path
              className={`universe-orbit-path universe-orbit-path--${laneIndex + 1}`}
              key={`front-orbit-${laneIndex}`}
              ref={(element) => { frontOrbitPathRefs.current[laneIndex] = element; }}
            />
          ))}
        </svg>
      ) : null}
      {shown.map((project, index) => (
        <Link
          ref={(element) => {
            orbRefs.current[index] = element;
          }}
          data-orbit-index={index}
          data-project={project.slug}
          className={`project-orb project-orb--${project.orbit} project-orb--${index + 1}`}
          href={`/work/${project.slug}`}
          key={project.slug}
          onClick={(event) => handleProjectNavigation(event, `/work/${project.slug}`)}
          onDragStart={(event) => event.preventDefault()}
          onMouseEnter={() => {
            hoveredIndexRef.current = index;
            setPaused("hover", true);
            rootRef.current?.setAttribute("data-interaction", "project-hover");
            setRevealStrength(0.85);
            applyPositions();
          }}
          onMouseLeave={() => {
            hoveredIndexRef.current = null;
            setPaused("hover", false);
            rootRef.current?.setAttribute("data-interaction", pointerInsideRef.current ? "exploring" : "idle");
            setRevealStrength(pointerInsideRef.current ? 1 : 0);
            applyPositions();
          }}
          onFocus={() => {
            focusedIndexRef.current = index;
            rootRef.current?.setAttribute("data-interaction", "project-focus");
            setRevealStrength(0.85);
            applyPositions();
          }}
          onBlur={() => {
            focusedIndexRef.current = null;
            rootRef.current?.setAttribute("data-interaction", pointerInsideRef.current ? "exploring" : "idle");
            setRevealStrength(pointerInsideRef.current ? 1 : 0);
            applyPositions();
          }}
          style={{ left: "50%", top: "50%" }}
        >
          <span className="project-aura" aria-hidden="true"><span className="project-aura__surface" /></span>
          <span className="project-orb__icon" aria-hidden="true"><ProjectIcon name={project.icon} /></span>
          <span className="project-caption">
          <small>{isHome ? String(index + 1).padStart(2, "0") : project.index} / {project.category}</small>
          <strong>{isHome && project.slug === "humanizer" ? "文学去 AI 味" : project.shortTitle}</strong>
          <em>{project.tagline}</em>
          <b>查看项目 →</b>
          </span>
        </Link>
      ))}
      {!isMobile ? (
        <p className="universe-hint">
          <span aria-hidden="true">↗</span>
          {reducedMotion ? "选择项目，了解它如何工作" : "拖动探索 · 点击查看项目"}
        </p>
      ) : null}
    </div>
  );
}
