export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-8 animate-pulse">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1">
              <div className="h-8 bg-slate-200 rounded w-48 mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-96"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-44"></div>
          </div>
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full mb-6"></div>
              </div>
              <div className="bg-slate-50 px-8 py-3 border-t border-slate-100">
                <div className="h-3 bg-slate-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
