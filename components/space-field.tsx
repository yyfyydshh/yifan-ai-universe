import { InteractiveStarfield } from "@/components/interactive-starfield";

export function SpaceField({ quiet = false, interactive = false }: { quiet?: boolean; interactive?: boolean }) {
  return (
    <div className={`space-field ${quiet ? "space-field--quiet" : ""}`} aria-hidden="true">
      <svg className="space-stars" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 110 }, (_, index) => (
          <circle
            key={index}
            cx={(index * 397 + 113) % 1440}
            cy={(index * index * 71 + 47) % 900}
            r={index % 17 === 0 ? 1.3 : index % 5 === 0 ? 0.85 : 0.45}
            opacity={0.2 + (index % 7) * 0.08}
          />
        ))}
      </svg>
      {interactive ? <InteractiveStarfield /> : null}
      <span className="star-cloud star-cloud--one" />
      <span className="star-cloud star-cloud--two" />
      <span className="orbit-line orbit-line--one" />
      <span className="orbit-line orbit-line--two" />
      <span className="sun-point" />
    </div>
  );
}
