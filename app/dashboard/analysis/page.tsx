import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart2, Calendar, ExternalLink, FolderOpen, ArrowRight } from "lucide-react";

export default async function AnalysisPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const analysisResults = await db.analysisResult.findMany({
    where: {
      project: { userId: user.id },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          domain: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analysis Results</h1>
              <p className="mt-2 text-slate-600">
                View all website audits and SEO signal comparisons for your projects.
              </p>
            </div>
            <Link
              href="/create-project"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <BarChart2 className="h-4 w-4" />
              Create New Analysis
            </Link>
          </div>
        </div>

        {/* Analysis Results List */}
        {analysisResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 lg:p-16">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <BarChart2 className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No Analysis Results Yet</h2>
              <p className="text-slate-600 mb-8">
                Start by creating a project and analyzing your website against competitors. 
                You'll see detailed SEO signal comparisons here.
              </p>
              <Link
                href="/create-project"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                <FolderOpen className="h-5 w-5" />
                Create Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {analysisResults.map((result) => (
              <article
                key={result.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <BarChart2 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 truncate">
                            {result.project.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
                            <a
                              href={result.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors truncate"
                            >
                              {result.targetUrl}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(result.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        {result.score > 0 && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            Score: {result.score}/100
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/project/${result.project.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all hover:shadow-md flex-shrink-0"
                    >
                      View Full Audit
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="bg-slate-50 px-8 py-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Project:{" "}
                    <Link
                      href={`/dashboard/project/${result.project.id}`}
                      className="font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                    >
                      {result.project.name}
                    </Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
