export const chartColors = {
  cyan: "#22d3ee",
  blue: "#3b82f6",
  indigo: "#6366f1",
  emerald: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
  axis: "#94a3b8",
  grid: "rgba(148, 163, 184, 0.14)"
};

export function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip rounded-xl px-3.5 py-3 text-sm">
      {label ? <p className="mb-2 font-bold text-title">{label}</p> : null}
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={`${item.name}-${item.value}`} className="flex min-w-40 items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              {item.name}
            </span>
            <span className="font-extrabold text-title">
              {formatter ? formatter(item.value, item.name, item) : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartLegend({ payload }) {
  if (!payload?.length) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
      {payload.map((entry) => (
        <span key={entry.value} className="chart-legend-item">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}
