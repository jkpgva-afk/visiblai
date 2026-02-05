export function HealthBadge({ score }: { score: number }) {
  let label = "Poor";
  let color = "bg-red-100 text-red-700";

  if (score >= 80) {
    label = "Excellent";
    color = "bg-green-100 text-green-700";
  } else if (score >= 50) {
    label = "Fair";
    color = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color}`}
    >
      {label}
    </span>
  );
}
