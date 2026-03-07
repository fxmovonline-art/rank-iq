"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  FolderOpen,
  Calendar,
  Target,
  TrendingUp
} from "lucide-react";
import PdfExportButton from "@/components/PdfExportButton";

type Project = {
  id: string;
  name: string;
  domain: string;
  niche: string;
  targetCity: string;
};

type StrategyResponse = {
  content: string;
  projectData: {
    name: string;
    domain: string;
    niche: string;
    targetCity: string;
  };
};

type StoredStrategy = {
  id: string;
  createdAt: string;
  projectId: string;
  projectName: string;
  projectDomain: string;
  markdown: string;
  formData: {
    businessType?: string;
    monthlyBudget?: string;
    mainGoal?: string;
  } | null;
  projectData: {
    name: string;
    domain: string;
    niche: string;
    targetCity: string;
  };
};

type MonthBlock = {
  monthNumber: number;
  title: string;
  content: string;
};

function parseMarkdownIntoMonths(markdown: string): MonthBlock[] {
  const months: MonthBlock[] = [];
  
  // Split by month headers (# Month 1, # Month 2, # Month 3)
  const sections = markdown.split(/(?=# Month \d+:)/);
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    const match = section.match(/# Month (\d+): (.+)/);
    if (match) {
      const monthNumber = parseInt(match[1]);
      const title = match[2].trim();
      
      months.push({
        monthNumber,
        title,
        content: section,
      });
    }
  }
  
  // If parsing fails, create 3 equal sections
  if (months.length === 0) {
    const lines = markdown.split('\n');
    const chunkSize = Math.ceil(lines.length / 3);
    
    for (let i = 0; i < 3; i++) {
      const chunk = lines.slice(i * chunkSize, (i + 1) * chunkSize).join('\n');
      months.push({
        monthNumber: i + 1,
        title: `Month ${i + 1}`,
        content: chunk,
      });
    }
  }
  
  return months.slice(0, 3);
}

export default function StrategiesPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [businessType, setBusinessType] = useState<string>("");
  const [monthlyBudget, setMonthlyBudget] = useState<string>("");
  const [mainGoal, setMainGoal] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);
  const [monthBlocks, setMonthBlocks] = useState<MonthBlock[]>([]);
  const [history, setHistory] = useState<StoredStrategy[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  useEffect(() => {
    fetchProjects();
    fetchStrategyHistory();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch projects");
      }
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please refresh the page.");
    } finally {
      setLoadingProjects(false);
    }
  }

  async function fetchStrategyHistory() {
    try {
      const res = await fetch("/api/strategy", {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch strategy history");
      }

      const data = (await res.json()) as { strategies?: StoredStrategy[] };
      setHistory(data.strategies || []);
    } catch (err) {
      console.error("Error fetching strategy history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }

  function loadSavedStrategy(saved: StoredStrategy) {
    setStrategy({
      content: saved.markdown,
      projectData: saved.projectData,
    });
    setMonthBlocks(parseMarkdownIntoMonths(saved.markdown));
    setSelectedProjectId(saved.projectId);
    setBusinessType(saved.formData?.businessType || "");
    setMonthlyBudget(saved.formData?.monthlyBudget || "");
    setMainGoal(saved.formData?.mainGoal || "");
    setSuccess(true);
    setError(null);
  }

  async function handleGenerateStrategy(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedProjectId || !businessType || !monthlyBudget || !mainGoal) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setStrategy(null);
    setMonthBlocks([]);

    try {
      const res = await fetch("/api/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          businessType,
          monthlyBudget,
          mainGoal,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate strategy");
      }

      const data = (await res.json()) as StrategyResponse;
      setStrategy(data);
      setMonthBlocks(parseMarkdownIntoMonths(data.content));
      setSuccess(true);
      await fetchStrategyHistory();
    } catch (err) {
      console.error("Strategy generation error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate strategy. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingProjects) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-slate-600 text-sm">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-4">
                <Sparkles className="h-3 w-3" />
                Module B
              </div>
              <h1 className="text-3xl font-bold text-slate-900">SEO Strategy Generator</h1>
              <p className="mt-2 text-slate-700">
                Generate a detailed 3-month week-by-week SEO roadmap tailored for Pakistan market.
              </p>
            </div>
          </div>
        </div>

        {/* No Projects State */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 lg:p-16">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <FolderOpen className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No Projects Yet</h2>
              <p className="text-slate-600 mb-8">
                Create a project first to generate personalized SEO strategies and roadmaps.
              </p>
              <button
                onClick={() => router.push("/create-project")}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                <FolderOpen className="h-5 w-5" />
                Create Your First Project
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Strategy Input Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 mb-8">
              <form onSubmit={handleGenerateStrategy} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Strategy Input Form</h2>
                  <p className="text-slate-600 text-sm mb-6">
                    Fill in the details below to generate your personalized SEO roadmap.
                  </p>
                </div>

                {/* Project Selection */}
                <div>
                  <label htmlFor="project" className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Project
                  </label>
                  <select
                    id="project"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.domain}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pre-filled Project Info */}
                {selectedProject && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Target Niche</p>
                      <p className="text-sm font-medium text-slate-900">{selectedProject.niche}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Target City</p>
                      <p className="text-sm font-medium text-slate-900">{selectedProject.targetCity}</p>
                    </div>
                  </div>
                )}

                {/* Business Type */}
                <div>
                  <label htmlFor="businessType" className="block text-sm font-semibold text-slate-700 mb-2">
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select business type...</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Local Service">Local Service</option>
                    <option value="Blog">Blog</option>
                  </select>
                </div>

                {/* Monthly Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-slate-700 mb-2">
                    Monthly Budget (PKR)
                  </label>
                  <select
                    id="budget"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select budget range...</option>
                    <option value="20k-50k PKR">20k-50k PKR</option>
                    <option value="50k-100k PKR">50k-100k PKR</option>
                    <option value="100k-200k PKR">100k-200k PKR</option>
                    <option value="200k+ PKR">200k+ PKR</option>
                  </select>
                </div>

                {/* Main Goal */}
                <div>
                  <label htmlFor="goal" className="block text-sm font-semibold text-slate-700 mb-2">
                    Main Goal
                  </label>
                  <select
                    id="goal"
                    value={mainGoal}
                    onChange={(e) => setMainGoal(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select main goal...</option>
                    <option value="Rank on Page 1">Rank on Page 1</option>
                    <option value="Increase Leads">Increase Leads</option>
                    <option value="Brand Visibility">Brand Visibility</option>
                  </select>
                </div>

                {/* Error Message - Bhai's Standard */}
                {error && (
                  <div className="bg-white border-2 border-red-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                          <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          Unable to Generate Strategy
                        </h3>
                        <p className="text-sm text-slate-700 mb-4">{error}</p>
                        <button
                          onClick={() => setError(null)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && !loading && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-700">
                      Strategy generated successfully! Scroll down to view your roadmap.
                    </p>
                  </div>
                )}

                {/* Submit Button with Loading Spinner */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Strategy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Strategy
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Previously Generated Strategies */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Previously Generated Strategies</h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Open any previous roadmap and export it again anytime.
                  </p>
                </div>
              </div>

              {loadingHistory ? (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading strategy history...
                </div>
              ) : history.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 bg-slate-50">
                  No saved strategies yet. Generate your first roadmap using the form above.
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.projectName}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {item.projectDomain} • {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => loadSavedStrategy(item)}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                      >
                        Open Strategy
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strategy Roadmap Display - 3 Month Blocks */}
            {strategy && monthBlocks.length > 0 && (
              <div className="space-y-6">
                {/* PDF Export Button */}
                <div className="flex justify-end">
                  <PdfExportButton
                    targetElementIds={[]}
                    fileName={`${strategy.projectData.name}-3-Month-SEO-Strategy`}
                    pdfTitle="RankIQ - Professional SEO Audit"
                    pdfSubtitle={`3-Month Strategy • ${strategy.projectData.name} • ${strategy.projectData.domain}`}
                    textSections={[
                      {
                        title: `Project Overview - ${strategy.projectData.name}`,
                        body: `${strategy.projectData.domain}\n${strategy.projectData.niche} • ${strategy.projectData.targetCity}`,
                      },
                      ...monthBlocks.map((month) => ({
                        title: month.title,
                        body: month.content.replace(/^# Month\s+\d+:\s.*$/m, "").trim(),
                      })),
                    ]}
                  />
                </div>
                
                {/* Project Info Card */}
                <div id="strategy-info" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <div className="flex items-start gap-3">
                    <Target className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2">
                        SEO Strategy for {strategy.projectData.name}
                      </h2>
                      <p className="text-slate-700">
                        {strategy.projectData.domain} • {strategy.projectData.niche} • {strategy.projectData.targetCity}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Monthly Roadmap Cards - bg-white, p-10 padding */}
                <div className="space-y-6">
                  {monthBlocks.map((month) => (
                    <div
                      key={month.monthNumber}
                      id={`month-${month.monthNumber}`}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 hover:shadow-md transition-shadow"
                    >
                      {/* Month Header */}
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl">
                          {month.monthNumber}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{month.title}</h3>
                          <p className="text-sm text-slate-600">Month {month.monthNumber} of 3</p>
                        </div>
                      </div>

                      {/* Markdown Content */}
                      <div className="text-slate-700 space-y-4">
                        {month.content.split('\n').map((line, idx) => {
                          // Skip the month title line
                          if (line.startsWith('# Month')) return null;
                          
                          // Week headers
                          if (line.startsWith('## Week')) {
                            return (
                              <div key={idx} className="flex items-center gap-2 mt-6 mb-3">
                                <Calendar className="h-4 w-4 text-indigo-600" />
                                <h4 className="text-base font-bold text-slate-900 uppercase">
                                  {line.replace('##', '').trim()}
                                </h4>
                              </div>
                            );
                          }
                          
                          // Task items with checkboxes
                          if (line.startsWith('- ')) {
                            return (
                              <label
                                key={idx}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                                  {line.replace('- ', '').trim()}
                                </span>
                              </label>
                            );
                          }
                          
                          // Regular text
                          if (line.trim().length > 0) {
                            return (
                              <p key={idx} className="text-sm text-slate-600 leading-relaxed">
                                {line.trim()}
                              </p>
                            );
                          }
                          
                          return null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Footer */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      <p className="text-sm font-medium text-slate-700">
                        Strategy saved successfully! Track your progress using the checkboxes above.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setStrategy(null);
                        setMonthBlocks([]);
                        setSuccess(false);
                        setSelectedProjectId("");
                        setBusinessType("");
                        setMonthlyBudget("");
                        setMainGoal("");
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
