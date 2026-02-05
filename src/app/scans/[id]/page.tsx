"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ScanDetailPage() {
  const { id } = useParams();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    async function loadScan() {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3001/api/dashboard/scans/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setScan(data);
      setLoading(false);
    }

    loadScan();
  }, [id]);

  if (loading) return <p className="p-6">Loading scan…</p>;
  if (!scan) return <p className="p-6">Scan not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Scan Report: <span className="text-gray-500">{scan.keyword}</span>
      </h1>

      {/* SCORE */}
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-sm text-gray-500">AEO Visibility Score</p>
        <p className="text-4xl font-bold text-indigo-600">
          {scan.score}/100
        </p>
      </div>

      {/* AI ANSWER */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg mb-2">
          What AI Says About Your Brand
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {scan.aiAnswer}
        </p>
      </div>

      {/* META */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Brand Position</p>
          <p className="text-xl font-semibold">
            #{scan.brandPosition ?? "—"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Sentiment</p>
          <p className="capitalize">{scan.sentiment ?? "—"}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Confidence</p>
          <p>{scan.confidence ?? 0}%</p>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg mb-3">
          Recommendations
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          {scan.recommendations
            ? scan.recommendations.split(" | ").map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))
            : <li>No recommendations</li>}
        </ul>
      </div>

      {/* RAW AI */}
      <div className="bg-white rounded-xl shadow p-6">
        <button
          className="text-indigo-600 text-sm"
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? "Hide" : "Show"} Raw AI Response
        </button>

        {showRaw && (
          <pre className="mt-4 text-xs bg-gray-100 p-4 rounded overflow-auto">
            {scan.rawResponse || "No raw response stored"}
          </pre>
        )}
      </div>
    </div>
  );
}
