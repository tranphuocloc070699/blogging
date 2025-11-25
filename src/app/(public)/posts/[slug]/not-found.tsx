import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Post Not Found</h2>
        <p className="text-gray-600 mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
