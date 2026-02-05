export function ComparisonBars({
  data
}: {
  data: { name: string; score: number }[];
}) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{item.name}</span>
            <span>{item.score}</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 rounded bg-indigo-600"
              style={{ width: `${item.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
