export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Title Skeleton */}
        <div className="mb-12 md:mb-16 flex justify-center">
          <div className="h-12 md:h-14 lg:h-16 w-64 md:w-80 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Avatar Skeleton */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-gray-200 rounded-3xl animate-pulse" />
          </div>

          {/* Text Content Skeleton */}
          <div className="flex-1 space-y-6 w-full">
            {/* Typing Animation Skeleton */}
            <div className="space-y-3">
              <div className="h-8 md:h-10 lg:h-12 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-8 md:h-10 lg:h-12 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>

            {/* About Text Skeleton */}
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-4/5" />
              </div>
              <div className="space-y-2">
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-5 md:h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section Skeleton */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 border-t border-gray-200">
        {/* Contact Title Skeleton */}
        <div className="h-8 md:h-9 w-48 bg-gray-200 rounded animate-pulse mb-8" />

        <div className="space-y-4">
          {/* Contact Items Skeleton */}
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 p-4 rounded-lg"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-48 md:w-64 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
