export function SpaceField({ quiet = false }: { quiet?: boolean }) {
  return (
    <div className={`space-field ${quiet ? "space-field--quiet" : ""}`} aria-hidden="true">
      <span className="star-cloud star-cloud--one" />
      <span className="star-cloud star-cloud--two" />
      <span className="orbit-line orbit-line--one" />
      <span className="orbit-line orbit-line--two" />
      <span className="sun-point" />
    </div>
  );
}
