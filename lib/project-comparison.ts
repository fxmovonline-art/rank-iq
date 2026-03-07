import { db } from "@/lib/db";

export type ComparisonSignals = {
  url: string;
  title: string;
  metaDescription: string;
  h1Tag: string;
  wordCount: number;
  hasSchema: boolean;
};

export type ComparisonData = {
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

type RawSignals = {
  title?: unknown;
  metaDescription?: unknown;
  h1Texts?: unknown;
  wordCount?: unknown;
  hasJsonLd?: unknown;
};

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeWordCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeSignals(raw: RawSignals, fallbackUrl: string): ComparisonSignals {
  const h1Texts = Array.isArray(raw.h1Texts)
    ? raw.h1Texts.filter((item): item is string => typeof item === "string")
    : [];

  return {
    url: fallbackUrl,
    title: normalizeString(raw.title),
    metaDescription: normalizeString(raw.metaDescription),
    h1Tag: h1Texts[0]?.trim() || "",
    wordCount: normalizeWordCount(raw.wordCount),
    hasSchema: Boolean(raw.hasJsonLd),
  };
}

export async function getProjectComparisonData(
  projectId: string,
  userEmail: string
): Promise<ComparisonData | null> {
  const user = await db.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    return null;
  }

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
    include: {
      analysisResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      competitors: {
        include: {
          signals: {
            orderBy: { updatedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const latestResultSignals = (project.analysisResults[0]?.signals ?? {}) as RawSignals;

  const userSite = normalizeSignals(latestResultSignals, project.domain);

  const competitors = project.competitors.map(
    (competitor: (typeof project.competitors)[number]) => {
    const signal = competitor.signals[0];
    return normalizeSignals(
      {
        title: signal?.title,
        metaDescription: signal?.metaDescription,
        h1Texts: signal?.h1Texts,
        wordCount: signal?.wordCount,
        hasJsonLd: signal?.hasJsonLd,
      },
      competitor.url
    );
    }
  );

  const validCompetitorWordCounts = competitors
    .map((item: (typeof competitors)[number]) => item.wordCount)
    .filter((count: number) => count > 0);

  const competitorAverageWordCount = validCompetitorWordCounts.length
    ? Math.round(
        validCompetitorWordCounts.reduce(
          (sum: number, count: number) => sum + count,
          0
        ) / validCompetitorWordCounts.length
      )
    : 0;

  const difference = userSite.wordCount - competitorAverageWordCount;
  const percent = competitorAverageWordCount
    ? Math.round((difference / competitorAverageWordCount) * 100)
    : 0;

  let status: "lower" | "better" | "neutral" = "neutral";

  if (competitorAverageWordCount > 0 && userSite.wordCount < competitorAverageWordCount * 0.85) {
    status = "lower";
  } else if (competitorAverageWordCount > 0 && userSite.wordCount >= competitorAverageWordCount) {
    status = "better";
  }

  return {
    project: {
      id: project.id,
      name: project.name,
      domain: project.domain,
      niche: project.niche,
      targetCity: project.targetCity,
    },
    userSite,
    competitors,
    competitorAverageWordCount,
    wordCountGap: {
      difference,
      percent,
      status,
    },
  };
}
