export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="text-6xl font-bold text-white mb-4">404</div>

          <h1 className="text-2xl font-semibold text-white mb-2">
            Page Not Found
          </h1>

          <p className="text-gray-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <a
            href="/"
            className="block w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-full"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
