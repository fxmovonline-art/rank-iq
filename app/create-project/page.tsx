"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin, Briefcase, Link as LinkIcon, Plus, X, Loader2 } from "lucide-react";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const NICHES = [
  "E-commerce",
  "Healthcare",
  "Real Estate",
  "Education",
  "Technology",
  "Finance",
  "Legal Services",
  "Restaurant",
  "Fitness",
  "Beauty & Salon",
  "Automotive",
  "Other",
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    website: "",
    niche: "",
    targetCity: "",
    competitors: ["", "", "", "", ""],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompetitorChange = (index: number, value: string) => {
    const newCompetitors = [...formData.competitors];
    newCompetitors[index] = value;
    setFormData((prev) => ({
      ...prev,
      competitors: newCompetitors,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.projectName || !formData.website || !formData.niche || !formData.targetCity) {
        throw new Error("Please fill in all required fields");
      }

      // Validate website URL
      try {
        new URL(formData.website);
      } catch {
        throw new Error("Please enter a valid website URL (e.g., https://example.com)");
      }

      // Validate competitors
      const validCompetitors = formData.competitors.filter((c) => c.trim());
      if (validCompetitors.length === 0) {
        throw new Error("Please add at least one competitor URL");
      }

      for (const competitor of validCompetitors) {
        try {
          new URL(competitor);
        } catch {
          throw new Error(`Invalid competitor URL: ${competitor}`);
        }
      }

      // Create project
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.projectName,
          domain: formData.website,
          niche: formData.niche,
          targetCity: formData.targetCity,
          competitors: validCompetitors,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create project");
      }

      const data = await res.json();
      setSuccess(true);

      // Redirect to project dashboard after 2 seconds
      setTimeout(() => {
        router.push(`/dashboard/project/${data.projectId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Create New Project</h1>
          <p className="mt-2 text-lg text-slate-600">
            Analyze your website and competitors to improve your local rankings
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-10 rounded-2xl shadow-md border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">✓ Project created successfully! Redirecting...</p>
              </div>
            )}

            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                placeholder="My Business Name"
                className="mt-3 block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 bg-white placeholder-slate-500 transition-all hover:border-slate-300"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://example.com"
                className="mt-3 block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 bg-white placeholder-slate-500 transition-all hover:border-slate-300"
              />
            </div>

            {/* Niche */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Business Niche
              </label>
              <select
                value={formData.niche}
                onChange={(e) => handleInputChange("niche", e.target.value)}
                className="mt-3 block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 bg-white transition-all hover:border-slate-300"
              >
                <option value="">Select a niche</option>
                {NICHES.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>

            {/* Target City */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Target City
              </label>
              <select
                value={formData.targetCity}
                onChange={(e) => handleInputChange("targetCity", e.target.value)}
                className="mt-3 block w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 bg-white transition-all hover:border-slate-300"
              >
                <option value="">Select a city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Competitors Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Competitor URLs (up to 5)
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {formData.competitors.filter((c) => c.trim()).length} of 5
                </span>
              </div>

              <div className="space-y-3">
                {formData.competitors.map((competitor, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={competitor}
                      onChange={(e) => handleCompetitorChange(index, e.target.value)}
                      placeholder={`Competitor ${index + 1} URL (optional)`}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 bg-white placeholder-slate-500 transition-all hover:border-slate-300"
                    />
                    {competitor && (
                      <button
                        type="button"
                        onClick={() => handleCompetitorChange(index, "")}
                        className="px-3 py-3 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                We'll analyze your competitors to identify ranking opportunities
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="inline-flex h-5 w-5 items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </span>
                    Analyzing...
                  </>
                ) : success ? (
                  <>
                    <span>✓</span>
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Start Analysis</span>
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>We'll crawl your website and competitor sites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>Extract SEO signals (titles, meta, headers, schema)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>Analyze local ranking factors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>Get actionable recommendations</span>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
