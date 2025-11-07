import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Performance Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          High-performance real-time data visualization with 10,000+ data points at 60fps
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Launch Dashboard
          </Link>
        </div>
        <div className="mt-12 text-sm text-gray-500">
          <p>Built with Next.js 14+ App Router, TypeScript, and Canvas API</p>
        </div>
      </div>
    </main>
  );
}
