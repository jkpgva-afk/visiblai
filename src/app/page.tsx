import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          Optimize Your Brand for AI Answers
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          VisiblAI helps you measure and improve how your brand appears in
          AI-generated answers across ChatGPT, Gemini, Claude, and more.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700"
          >
            Run Your First Scan
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg text-lg font-medium border border-gray-300 hover:bg-white"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* WHAT IS AEO */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              What is AEO (Answer Engine Optimization)?
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              AEO focuses on optimizing your brand so it appears correctly,
              positively, and prominently in AI-generated answers — not just
              search results.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              GEO & AIO Explained
            </h2>
            <ul className="mt-4 space-y-3 text-lg text-gray-600 list-disc pl-6">
              <li>
                <strong>GEO (Generative Engine Optimization):</strong> Ensures
                your brand is represented accurately in generative AI outputs.
              </li>
              <li>
                <strong>AIO (AI Optimization):</strong> The umbrella strategy for
                training AI systems to understand and rank your brand correctly.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            How VisiblAI Works
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">1. Run a Scan</h3>
              <p className="mt-2 text-gray-600">
                Enter your brand, website, and target keyword.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">2. Analyze AI Answers</h3>
              <p className="mt-2 text-gray-600">
                See how AI models talk about your brand today.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">3. Improve Visibility</h3>
              <p className="mt-2 text-gray-600">
                Get clear recommendations to rank higher in AI responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 text-center">
        <h2 className="text-3xl font-semibold text-white">
          Start Optimizing for AI Today
        </h2>
        <p className="mt-4 text-indigo-100 text-lg">
          Traditional SEO is not enough. AI answers are the new front page.
        </p>

        <Link
          href="/login"
          className="inline-block mt-6 bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium text-lg hover:bg-gray-100"
        >
          Get Started Free
        </Link>
      </section>
    </main>
  );
}
