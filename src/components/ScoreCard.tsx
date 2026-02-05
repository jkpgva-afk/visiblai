export function ScoreCard({
  title,
  score,
  description,
  delta,
}: {
  title: string;
  score: number;
  description: string;
  delta?: number | null;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-500">
          {title}
        </h3>

        {delta !== null && delta !== undefined && (
          <span
            className={`text-xs font-medium ${
              delta > 0
                ? "text-green-600"
                : delta < 0
                ? "text-red-600"
                : "text-gray-400"
            }`}
          >
            {delta > 0 && `↑ ${delta}`}
            {delta < 0 && `↓ ${Math.abs(delta)}`}
            {delta === 0 && "—"}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-indigo-600">
          {score}
        </span>
        <span className="text-gray-400">/100</span>
      </div>

      <p className="text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}
