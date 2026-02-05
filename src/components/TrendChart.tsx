export function TrendChart({ values }: { values: number[] }) {
  if (!values.length) {
    return (
      <p className="text-sm text-gray-400">
        No trend data yet
      </p>
    );
  }

  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-16"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="#6366f1"
        strokeWidth="3"
        points={points.join(" ")}
      />
    </svg>
  );
}
