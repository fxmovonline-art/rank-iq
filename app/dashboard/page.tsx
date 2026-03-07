import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ArrowRight, Activity, Globe, FileText } from "lucide-react";

export default async function DashboardPage() {
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

  // Fetch actual counts from database
  const [projectsCount, analysesCount, strategiesCount] = await Promise.all([
    db.project.count({ where: { userId: user.id } }),
    db.analysisResult.count({
      where: { project: { userId: user.id } },
    }),
    db.strategy.count({
      where: { project: { userId: user.id } },
    }),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-5 border-b border-slate-200">
        <h3 className="text-2xl font-bold leading-6 text-slate-900 tracking-tight">
          Welcome back to RankIQ
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Here is your SEO performance summary for today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0 bg-indigo-50 p-3 rounded-xl">
                <Globe className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-4 flex flex-col">
                <dt className="text-sm font-medium text-slate-500 truncate">Total Projects</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  {projectsCount}
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
            <div className="text-sm">
              <a href="/create-project" className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1 group">
                Add a new project
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0 bg-indigo-50 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-4 flex flex-col">
                <dt className="text-sm font-medium text-slate-500 truncate">Analyses Run</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  {analysesCount}
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
            <div className="text-sm">
              <a href="/dashboard/analysis" className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1 group">
                View analyses history
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0 bg-indigo-50 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="ml-4 flex flex-col">
                <dt className="text-sm font-medium text-slate-500 truncate">Generating Strategies</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  {strategiesCount}
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
            <div className="text-sm">
              <a href="/dashboard/strategies" className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1 group">
                Content strategies
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
