import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Globe, ArrowRight, FolderPlus, ExternalLink } from "lucide-react";

export default async function ProjectsPage() {
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

  const projects = await db.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          competitors: true,
          analyses: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
              <p className="mt-2 text-slate-600">
                Manage your SEO analysis projects and track competitor insights.
              </p>
            </div>
            <Link
              href="/create-project"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <FolderPlus className="h-4 w-4" />
              Create New Project
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 lg:p-16">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <FolderPlus className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No Projects Yet</h2>
              <p className="text-slate-600 mb-8">
                Get started by creating your first SEO analysis project. Compare your website with
                competitors and get actionable insights.
              </p>
              <Link
                href="/create-project"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                <FolderPlus className="h-5 w-5" />
                Create Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: (typeof projects)[number]) => (
              <article
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-indigo-600" />
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {project.niche}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                    {project.name}
                  </h3>

                  <div className="flex items-start gap-2 mb-4">
                    <ExternalLink className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <a
                      href={project.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 hover:text-indigo-600 transition-colors line-clamp-1 break-all"
                    >
                      {project.domain}
                    </a>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 pb-6 border-b border-slate-100">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">
                        {project._count.competitors}
                      </span>{" "}
                      Competitors
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">
                        {project._count.analyses}
                      </span>{" "}
                      Analyses
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/project/${project.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all group-hover:shadow-md"
                  >
                    View Analysis
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="bg-slate-50 px-8 py-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Target: <span className="font-semibold text-slate-700">{project.targetCity}</span>
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
