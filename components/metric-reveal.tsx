type Metric = { value: string; label: string; note: string };

export function MetricReveal({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="metrics-grid">
      {metrics.map(metric => {
        return (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <h3>{metric.label}</h3>
            <p>{metric.note}</p>
          </article>
        );
      })}
    </div>
  );
}
