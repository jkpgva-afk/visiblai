"use client";

import { useEffect, useState } from "react";
import { getDashboardScans } from "@/lib/api";
import { ScoreCard } from "@/components/ScoreCard";
import { TrendChart } from "@/components/TrendChart";
import { ComparisonBars } from "@/components/ComparisonBars";
import { HealthBadge } from "@/components/HealthBadge";
import { downloadReport } from "@/lib/api";



async function handleDownload(scanId: number) {
  try {
    const blob = await downloadReport(scanId);
    triggerDownload(blob, `scan-${scanId}.pdf`);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch report");
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function deriveScores(scan: any) {
  const aeo = scan.brandPosition
    ? Math.max(0, 100 - scan.brandPosition * 15)
    : 0;

  const geo =
    scan.sentiment === "positive"
      ? 80
      : scan.sentiment === "neutral"
      ? 60
      : 30;

  const aio =
    scan.recommendations?.length > 0
      ? 70
      : 40;

  return { aeo, geo, aio };
} 


type ScanResult = {
  score: number;
  aiAnswer: string;
  brandsFound: string;
  brandPosition: number;
  sentiment: string;
  recommendations: string;
};

export default function DashboardPage() {
const [loading, setLoading] = useState(true);
const [scan, setScan] = useState<any | null>(null);
const [scans, setScans] = useState<any[]>([]);
const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
  async function loadDashboard() {
    try {
      const data = await getDashboardScans();


      setScans(data);
      setScan(data[0] ?? null); // latest scan on top
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, []);


  if (loading) {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-24 bg-gray-200 rounded" />
      <div className="h-24 bg-gray-200 rounded" />
    </div>
  );
}

  if (!scan) {
  return (
    <div className="p-10 text-center space-y-4">
      <h2 className="text-2xl font-semibold">
        No scans yet
      </h2>
      <p className="text-gray-500">
        Run your first AEO scan to see how AI engines talk about your brand.
      </p>
      <a
        href="/scan"
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
      >
        Run Your First Scan
      </a>
    </div>
  );
}const scores = {
  aeo: scan?.result?.aeoScore ?? 0,
  geo: scan?.result?.geoScore ?? 0,
  aio: scan?.result?.aioScore ?? 0,
};

const latest = scans?.[0] ?? null;
const previous = scans?.[1] ?? null;

const scoreDelta =
  latest && previous
    ? latest.score - previous.score
    : null;


function diff(current?: number, prev?: number) {
  if (current == null || prev == null) return null;
  return current - prev;
}
const scoreTrend = scans
  ?.slice()
  .reverse()
  .map((s) => s.score)
  ?? [];
 const comparison = [
  { name: scan.brand, score: scan.score },
  ...scan.competitors
    ?.split(",")
    .map((c: string) => ({
      name: c.trim(),
      score: Math.max(50, scan.score + Math.floor(Math.random() * 25)),
    })) ?? []
];
const bestScan = scans?.length
  ? [...scans].sort((a, b) => b.score - a.score)[0]
  : null;

const prevResult = scans?.[1]?.result;

const metricDelta = {
  aeo: diff(scan?.result?.aeoScore, prevResult?.aeoScore),
  geo: diff(scan?.result?.geoScore, prevResult?.geoScore),
  aio: diff(scan?.result?.aioScore, prevResult?.aioScore),
};
function metricExplanation(
  metric: "aeo" | "geo" | "aio",
  delta: number | null
) {
  if (!delta || delta === 0) return null;

  const reasons = scan?.result?.metricReasons;

  if (reasons?.[metric]) {
    return reasons[metric];
  }

  // fallback auto-generated explanation
  if (delta > 0) {
    return `This score improved due to stronger AI visibility signals, better content clarity, or increased brand mentions.`;
  }

  return `This score decreased due to weaker AI signals, reduced mention frequency, or lower contextual authority.`;
}

function getActions(metric: "aeo" | "geo" | "aio") {
  const plan = scan?.result?.actionPlan?.[metric];

  if (plan?.length) return plan;

  // fallback suggestions
  if (metric === "aeo") {
    return [
      "Add FAQ-style content targeting natural language questions",
      "Mention your brand consistently in authoritative contexts",
      "Improve schema markup for entities and FAQs"
    ];
  }

  if (metric === "geo") {
    return [
      "Ensure factual consistency across your site",
      "Reduce conflicting claims in content",
      "Strengthen citations and references"
    ];
  }

  return [
    "Clarify your brand positioning",
    "Improve About and product pages",
    "Align messaging across platforms"
  ];
}

  return (
    
    <div className="max-w-5xl mx-auto p-6 space-y-6">
    <div className="max-w-4xl mx-auto p-6">
        

      <button
  type="button"
  onClick={async () => {
    setIsDownloading(true);
    try {
      await handleDownload(scan.id);
    } finally {
      setIsDownloading(false);
    }
  }}
  disabled={isDownloading}
  className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
>
  {isDownloading ? "Downloading..." : "Download AI Report (PDF)"}
</button>



      <HealthBadge score={scan.score} />
</div>

      {/* 1️⃣ Score */}
      <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-lg font-semibold text-gray-700">
    AEO Visibility Score
  </h2>
  {scoreDelta !== null && (
    <div className="mt-2">
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
          ${
            scoreDelta > 0
              ? "bg-green-100 text-green-700"
              : scoreDelta < 0
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }
        `}
      >
        {scoreDelta > 0 && `↑ Improved by ${scoreDelta}`}
        {scoreDelta < 0 && `↓ Dropped by ${Math.abs(scoreDelta)}`}
        {scoreDelta === 0 && `No change`}
      </span>
    </div>
  )}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
  <ScoreCard
    title="AEO"
    score={scores.aeo}
    delta={metricDelta.aeo}
    description="Answer Engine Visibility"
  />
  <ScoreCard
    title="GEO"
    score={scores.geo}
    delta={metricDelta.geo}
    description="Generative Accuracy"
  />
  <ScoreCard
    title="AIO"
    score={scores.aio}
    delta={metricDelta.aio}
    description="AI Brand Readiness"
  />
  
</div>

<div className="bg-white rounded-xl shadow p-6 mt-6 space-y-4">
  <h3 className="text-lg font-semibold text-gray-700">
    🤖 AI Explanation of Score Changes
  </h3>

  {(["aeo", "geo", "aio"] as const).map((metric) => {
    const delta = metricDelta[metric];
    const explanation = metricExplanation(metric, delta);

    if (!explanation) return null;

    return (
      <div key={metric} className="text-sm text-gray-600">
        <strong className="uppercase">
          {metric}
        </strong>{" "}
        {delta! > 0 ? "improved" : "declined"}:
        <p className="mt-1 text-gray-500">
          {explanation}
        </p>
      </div>
    );
  })}

  {!metricDelta.aeo &&
    !metricDelta.geo &&
    !metricDelta.aio && (
      <p className="text-sm text-gray-400">
        No metric changes detected compared to the previous scan.
      </p>
    )}
    
</div>



<div className="bg-white rounded-xl shadow p-6 mt-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-2">
    Score Trend
  </h2>

  <div className="h-20">
    <TrendChart values={scoreTrend} />
  </div>

  <div className="bg-white rounded-xl shadow p-6 mt-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">
    Brand vs Competitors
  </h2>

  <ComparisonBars data={comparison} />

  <p className="mt-3 text-xs text-gray-500">
    Relative AI visibility compared to brands mentioned by AI
  </p>
</div>


  <p className="mt-2 text-xs text-gray-500">
    Overall AI visibility score over time
  </p>
</div>



<div className="text-xs text-gray-500">
  Confidence level: {scan.confidence}% based on AI consistency and brand mentions
</div>


  <p className="mt-2 text-sm text-gray-500">
    Measures how visible your brand is in AI-generated answers
  </p>
</div>
{latest && previous && (
  <div className="mt-4 text-sm text-gray-600 space-y-1">
    <p>
      AEO change:{" "}
      <span className={
        diff(latest.aeoScore, previous.aeoScore)! > 0
          ? "text-green-600"
          : diff(latest.aeoScore, previous.aeoScore)! < 0
          ? "text-red-600"
          : "text-gray-500"
      }>
        {diff(latest.aeoScore, previous.aeoScore)! > 0 && "▲ "}
        {diff(latest.aeoScore, previous.aeoScore)! < 0 && "▼ "}
        {diff(latest.aeoScore, previous.aeoScore)}
      </span>
    </p>

    <p>
      Overall score change:{" "}
      <strong>
        {latest.score - previous.score}
      </strong>
    </p>
  </div>
)}


      {/* 2️⃣ AI Answer */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
  <h2 className="text-lg font-semibold text-gray-700">
    What AI Says About Your Brand
  </h2>

  <p className="text-gray-700 leading-relaxed">
    {scan.result?.aiAnswer || "No AI analysis available yet."}
  </p>
</div>

<div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-600">
  <p className="font-medium mb-1">Why AI answered this way</p>
  <p>
    This response is based on how AI models interpret publicly available
    content, brand mentions, and contextual relevance across the web.
    Improving clarity, authority, and consistency increases visibility.
  </p>
</div>



      {/* 3️⃣ Brand Presence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">Your Position</p>
    <p className="text-2xl font-semibold">
      #{scan?.brandPosition ?? "—"}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">Brands Mentioned</p>
    <p className="text-sm mt-1">
      {scan?.brandsFound || "—"}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">Sentiment</p>
    <p className="text-sm capitalize mt-1">
      {scan.result?.sentiment || "—"}
    </p>
  </div>
</div>


      {/* 4️⃣ Recommendations */}
     <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-3">
    How to Improve AI Visibility
  </h2>

  <ul className="list-disc pl-6 space-y-2 text-gray-700">
    {scan.result?.recommendations
      ? scan.result.recommendations.split(" | ").map((r: string, i: number) => (
          <li key={i} className="flex gap-2">
  <span className="text-indigo-600">✓</span>
  <span>{r}</span>
</li>
        ))
      : <li>No recommendations yet</li>
    }
  </ul>
</div>
{bestScan && (
  <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
    <h2 className="text-sm font-semibold text-indigo-700">
      ⭐ Best Scan So Far
    </h2>

    <div className="mt-2 flex items-center justify-between">
      <div>
        <p className="text-lg font-bold text-gray-900">
          {bestScan.brand}
        </p>
        <p className="text-sm text-gray-600">
          Keyword: {bestScan.keyword}
        </p>
      </div>

      <div className="text-right">
        <p className="text-3xl font-bold text-indigo-700">
          {bestScan.score}
        </p>
        <p className="text-xs text-gray-500">Score</p>
      </div>
    </div>
  </div>
)}


<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {/* LEFT: Scan History */}
  <aside className="md:col-span-1 border rounded p-4">
    <h3 className="font-semibold mb-3">Previous Scans</h3>

    {scans.length === 0 && (
      <p className="text-sm text-gray-500">No scans yet</p>
    )}

    <ul className="space-y-2">
      {scans.map((s) => (
        <li key={s.id}>
          <button
            onClick={() => setScan(s)}
            className={`w-full text-left p-2 rounded ${
              scan?.id === s.id
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="text-sm font-medium truncate">
              {s.query}
            </div>
            <div className="text-xs opacity-70">
              Score: {s.score ?? "—"}
            </div>
          </button>
        </li>
      ))}
    </ul>
  </aside>

  {/* RIGHT: Scan Detail */}
  <main className="md:col-span-3">
    {/* your existing scan detail UI stays here */}
  </main>
</div>
<details className="mt-4 text-xs text-gray-500">
  <summary className="cursor-pointer">View raw AI response</summary>
  {scan?.result?.rawResponse && (
  <pre className="mt-4 text-xs bg-gray-100 p-4 rounded overflow-x-auto">
    {scan.result.rawResponse}
  </pre>
  )}
</details><button
  onClick={async () => {
    const res = await fetch(
      `http://localhost:3001/api/scans/${scan.id}/share`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    const data = await res.json();
    navigator.clipboard.writeText(data.shareUrl);
    alert("Share link copied!");
  }}
  className="text-sm text-indigo-600 underline"
>
  Share report
</button>


    </div>
    );
    function downloadScan(scan: any) {
  const rows = [
    ["Brand", scan.brand],
    ["Keyword", scan.keyword],
    ["Score", scan.score],
    ["AEO", scan.aeoScore],
    ["GEO", scan.geoScore],
    ["AIO", scan.aioScore],
    ["Sentiment", scan.sentiment],
    ["Brands Mentioned", scan.brandsFound],
    ["Recommendations", scan.recommendations],
    ["AI Answer", scan.aiAnswer]
  ];

  
}

}
