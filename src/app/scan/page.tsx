"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { runScan } from "@/lib/api";

export default function ScanPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    brand: "",
    website: "",
    keyword: "",
    competitors: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const scan = await runScan(form);
      router.push(`/dashboard?scanId=${scan.id}`);
    } catch (err: any) {
      if (err.message === "FREE_LIMIT") {
        setShowUpgrade(true);
      } else {
        setError("Failed to run scan");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Run AI Visibility Scan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="brand"
          placeholder="Brand name"
          value={form.brand}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          name="website"
          placeholder="Website (https://...)"
          value={form.website}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          name="keyword"
          placeholder="Main keyword (e.g. best CRM software)"
          value={form.keyword}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <textarea
          name="competitors"
          placeholder="Competitors (comma separated)"
          value={form.competitors}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
        >
          {loading ? "Running scan..." : "Start Scan"}
        </button>
      </form>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-2">
              Free scan limit reached
            </h2>

            <p className="text-gray-600 mb-4">
              Upgrade to Pro to run unlimited AI scans.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgrade(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => router.push("/pricing")}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
