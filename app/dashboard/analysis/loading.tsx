export default function AnalysisLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-8 animate-pulse">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1">
              <div className="h-8 bg-slate-200 rounded w-64 mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-96"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-44"></div>
          </div>
        </div>

        {/* List Skeletons */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse"
            >
              <div className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-slate-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-64"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-40"></div>
                  </div>
                  <div className="h-9 bg-slate-200 rounded-xl w-36"></div>
                </div>
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
