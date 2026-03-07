"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Bot, Sparkles, TriangleAlert, CheckCircle2, AlertCircle, Loader } from "lucide-react";
import PdfExportButton from "@/components/PdfExportButton";

type ComparisonSignals = {
  url: string;
  title: string;
  metaDescription: string;
  h1Tag: string;
  wordCount: number;
  hasSchema: boolean;
};

type ComparisonResponse = {
  project: {
    id: string;
    name: string;
    domain: string;
    niche: string;
    targetCity: string;
  };
  userSite: ComparisonSignals;
  competitors: ComparisonSignals[];
  competitorAverageWordCount: number;
  wordCountGap: {
    difference: number;
    percent: number;
    status: "lower" | "better" | "neutral";
  };
};

type AiRecommendations = {
  h1Variations: string[];
  gapSummary: string;
  faqSuggestions: string[];
};

function formatText(value: string): string {
  return value.trim() ? value : "Not available";
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function ProjectComparisonDashboardPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendations | null>(null);

  useEffect(() => {
    let active = true;

    async function loadComparisonData() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/projects/${projectId}/comparison`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          throw new Error(errData.error || "Failed to fetch project comparison data");
        }

        const data = (await res.json()) as ComparisonResponse;

        if (active) {
          setComparison(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load project data");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (projectId) {
      loadComparisonData();
    }

    return () => {
      active = false;
    };
  }, [projectId]);

  const tableColumns = useMemo(() => {
    if (!comparison) {
      return [];
    }

    return [
      {
        label: "Your Website",
        key: "user",
        value: comparison.userSite,
      },
      ...comparison.competitors.map((item, index) => ({
        label: `Competitor ${index + 1}`,
        key: `competitor-${index + 1}`,
        value: item,
      })),
    ];
  }, [comparison]);

  const wordCountBadgeClass =
    comparison?.wordCountGap.status === "lower"
      ? "bg-rose-100 text-rose-700 border border-rose-200"
      : comparison?.wordCountGap.status === "better"
        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
        : "bg-slate-100 text-slate-700 border border-slate-200";

  const handleGetRecommendations = async () => {
    setAiLoading(true);
    setAiError("");
    setAiRecommendations(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = (await res.json()) as { error?: string };
        throw new Error(
          errData.error || "AI Service is temporarily unavailable. Please try again later."
        );
      }

      const data = (await res.json()) as AiRecommendations;
      setAiRecommendations(data);
    } catch (err: unknown) {
      setAiError(
        err instanceof Error
          ? err.message
          : "AI Service is temporarily unavailable. Please try again later."
      );
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12">
        <p className="text-slate-600">Loading comparison dashboard...</p>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-8 lg:p-12">
        <div className="flex items-start gap-3 text-rose-700">
          <TriangleAlert className="h-5 w-5 mt-0.5" />
          <p className="font-medium">{error || "Project data not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <section id="comparison-header" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Module A</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{comparison.project.name} Comparison Dashboard</h1>
            <p className="mt-3 text-slate-600">
              Niche: <span className="font-medium text-slate-800">{comparison.project.niche}</span> | Target City:{" "}
              <span className="font-medium text-slate-800">{comparison.project.targetCity}</span>
            </p>
          </div>
          <div className="flex items-start gap-4">
            <PdfExportButton
              targetElementIds={[
                "comparison-header",
                "comparison-table",
                ...(aiRecommendations ? ["ai-insights"] : []),
              ]}
              fileName={`${comparison.project.name}-SEO-Audit`}
              pdfTitle="RankIQ - Professional SEO Audit"
              pdfSubtitle={`${comparison.project.name} • ${comparison.project.domain}`}
            />
          </div>
        </div>
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-5 mt-6">
          <p className="text-sm font-semibold text-slate-700">Gap Summary</p>
          <p className="mt-2 text-sm text-slate-600">
            Competitor avg word count: <span className="font-semibold text-slate-900">{comparison.competitorAverageWordCount}</span>
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Your gap: <span className="font-semibold text-slate-900">{comparison.wordCountGap.difference}</span> words ({comparison.wordCountGap.percent}%)
          </p>
          <span className={`inline-flex mt-3 rounded-full px-3 py-1 text-xs font-semibold ${wordCountBadgeClass}`}>
            {comparison.wordCountGap.status === "lower"
              ? "Content depth is significantly lower"
              : comparison.wordCountGap.status === "better"
                ? "Content depth is ahead of competitors"
                : "Content depth is close to competitor average"}
          </span>
        </div>
      </section>

      <section id="comparison-table" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">
                  SEO Signal
                </th>
                {tableColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-200 min-w-64"
                  >
                    {column.label}
                    <p className="mt-1 text-xs font-normal text-slate-500">{hostnameFromUrl(column.value.url)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-semibold text-slate-800 border-b border-slate-100">Title</td>
                {tableColumns.map((column) => (
                  <td key={`${column.key}-title`} className="px-4 py-4 text-sm text-slate-600 align-top border-b border-slate-100">
                    {formatText(column.value.title)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-semibold text-slate-800 border-b border-slate-100">
                  Meta Description
                </td>
                {tableColumns.map((column) => (
                  <td key={`${column.key}-meta`} className="px-4 py-4 text-sm text-slate-600 align-top border-b border-slate-100">
                    {formatText(column.value.metaDescription)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-semibold text-slate-800 border-b border-slate-100">H1 Tag</td>
                {tableColumns.map((column) => (
                  <td key={`${column.key}-h1`} className="px-4 py-4 text-sm text-slate-600 align-top border-b border-slate-100">
                    {formatText(column.value.h1Tag)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-semibold text-slate-800 border-b border-slate-100">Word Count</td>
                {tableColumns.map((column, index) => {
                  const highlightClass =
                    index === 0 && comparison.wordCountGap.status === "lower"
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : index === 0 && comparison.wordCountGap.status === "better"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200";

                  return (
                    <td key={`${column.key}-words`} className="px-4 py-4 text-sm text-slate-700 align-top border-b border-slate-100">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${highlightClass}`}>
                        {column.value.wordCount}
                      </span>
                    </td>
                  );
                })}
              </tr>

              <tr>
                <td className="sticky left-0 z-10 bg-white px-4 py-4 text-sm font-semibold text-slate-800">Schema Status</td>
                {tableColumns.map((column) => (
                  <td key={`${column.key}-schema`} className="px-4 py-4 text-sm text-slate-700 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${
                        column.value.hasSchema
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                      }`}
                    >
                      {column.value.hasSchema ? "Detected" : "Missing"}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="ai-insights" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-12">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">AI Insights</h2>
              <p className="mt-2 text-sm text-slate-600">
                Generate structured recommendations from Claude based on your content gaps.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGetRecommendations}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 transition-all"
            >
              {aiLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating Insights...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  Get AI Recommendations
                </>
              )}
            </button>
          </div>

          {aiLoading && !aiRecommendations && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-slate-200 animate-pulse">
                <Loader className="h-6 w-6 text-slate-600 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900">Generating AI Recommendations</p>
                <p className="mt-1 text-xs text-slate-600">This usually takes 10-30 seconds...</p>
              </div>
            </div>
          )}

          {aiError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-rose-900">Unable to Generate Recommendations</p>
                <p className="mt-1 text-sm text-rose-700">{aiError}</p>
              </div>
            </div>
          )}

          {aiRecommendations && (
            <div className="space-y-6">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-800">
                  <span className="font-semibold">Recommendations generated successfully.</span> Review the insights below and implement the suggestions that best fit your content strategy.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                <article className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base font-semibold text-slate-900">Optimized H1 Variations</h3>
                  <p className="mt-2 text-xs text-slate-600">3 improved title options based on competitor analysis</p>
                  <ul className="mt-4 space-y-3">
                    {aiRecommendations.h1Variations.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow lg:col-span-1 xl:col-span-1">
                  <h3 className="text-base font-semibold text-slate-900">SEO Content Gap Summary</h3>
                  <p className="mt-2 text-xs text-slate-600">Key areas where your content differs from competitors</p>
                  <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-sm leading-relaxed text-slate-700">{aiRecommendations.gapSummary}</p>
                  </div>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 xl:col-span-1">
                  <h3 className="text-base font-semibold text-slate-900">FAQ Suggestions</h3>
                  <p className="mt-2 text-xs text-slate-600">5 question ideas based on competitor topical coverage</p>
                  <ul className="mt-4 space-y-2">
                    {aiRecommendations.faqSuggestions.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-slate-400 flex-shrink-0 mt-1">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
