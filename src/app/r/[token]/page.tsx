export default async function PublicReport({
  params,
}: {
  params: { token: string };
}) {

  const res = await fetch(
    `http://localhost:3001/api/public/${params.token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-10 text-center">Report not found</div>;
  }

  const scan = await res.json();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        {scan.brand} — AI Visibility Report
      </h1>

      <p className="text-gray-500">
        Generated on {new Date(scan.createdAt).toLocaleDateString()}
      </p>

      {/* reuse ScoreCard + AI explanation here */}
    </div>
  );
}
