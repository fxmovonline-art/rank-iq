import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scrapeURL } from "@/lib/scraper";

// Allow longer timeout for scraping
export const maxDuration = 120;

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const { projectId, targetUrl, competitorIds } = await req.json();

    if (!projectId || !targetUrl || !competitorIds || competitorIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get Browserless token from environment
    const browserlessToken = process.env.BROWSERLESS_TOKEN;

    // Scrape target URL
    console.log(`Scraping target URL: ${targetUrl}`);
    const targetResult = await scrapeURL(targetUrl, browserlessToken);

    // Create analysis result for target URL
    if (targetResult.success) {
      await db.analysisResult.create({
        data: {
          projectId,
          targetUrl,
          signals: targetResult.signals as any,
          details: {
            scrapedAt: new Date().toISOString(),
            status: "completed",
          } as any,
        },
      });
    } else {
      await db.analysisResult.create({
        data: {
          projectId,
          targetUrl,
          signals: {} as any,
          details: {
            error: targetResult.error,
            scrapedAt: new Date().toISOString(),
            status: "failed",
          } as any,
        },
      });
    }

    // Scrape all competitors
    console.log(`Scraping ${competitorIds.length} competitors`);

    const competitorResults = await Promise.allSettled(
      competitorIds.map(async (competitorId: string) => {
        // Get competitor URL
        const competitor = await db.competitor.findUnique({
          where: { id: competitorId },
        });

        if (!competitor) {
          throw new Error(`Competitor not found: ${competitorId}`);
        }

        // Scrape competitor
        const result = await scrapeURL(competitor.url, browserlessToken);

        // Find the signal record for this competitor
        const signal = await db.signal.findFirst({
          where: { competitorId },
        });

        if (signal) {
          // Update signal record
          await db.signal.update({
            where: { id: signal.id },
            data: {
              title: result.signals.title,
              metaDescription: result.signals.metaDescription,
              h1Count: result.signals.h1Count,
              h1Texts: result.signals.h1Texts,
              h2Count: result.signals.h2Count,
              wordCount: result.signals.wordCount,
              hasJsonLd: result.signals.hasJsonLd,
              jsonLdSchema: result.signals.jsonLdSchema as any,
              hasFaq: result.signals.hasFaq,
              faqItems: result.signals.faqItems,
              status: result.success ? "completed" : "failed",
              error: result.error,
              updatedAt: new Date(),
            },
          });
        }

        return {
          competitorId,
          success: result.success,
          error: result.error,
        };
      })
    );

    // Log results
    const successCount = competitorResults.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    console.log(
      `Scraping completed: ${successCount}/${competitorIds.length} competitors successful`
    );

    // Calculate analysis score based on SEO signals
    const signals = await db.signal.findMany({
      where: { competitorId: { in: competitorIds } },
    });

    let totalScore = 0;
    signals.forEach((signal: any) => {
      // Score based on various factors
      if (signal.h1Count > 0) totalScore += 10;
      if (signal.h1Count > 1) totalScore += 5;
      if (signal.title && signal.title.length >= 50 && signal.title.length <= 60) totalScore += 10;
      if (signal.metaDescription && signal.metaDescription.length >= 120 && signal.metaDescription.length <= 160) totalScore += 10;
      if (signal.h2Count > 0) totalScore += 5;
      if (signal.wordCount > 500) totalScore += 10;
      if (signal.hasJsonLd) totalScore += 15;
      if (signal.hasFaq) totalScore += 10;
    });

    const averageScore = Math.min(100, Math.round(totalScore / signals.length || 0));

    // Update project with analysis
    await db.analysis.create({
      data: {
        projectId,
        score: averageScore,
        details: {
          completedAt: new Date().toISOString(),
          competitorsAnalyzed: successCount,
          totalCompetitors: competitorIds.length,
          executionTime: Date.now() - startTime,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Analysis completed successfully",
        score: averageScore,
        results: {
          targetUrl: targetResult.success ? "completed" : "failed",
          competitors: {
            successful: successCount,
            total: competitorIds.length,
          },
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Scraping error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to complete analysis" },
      { status: 500 }
    );
  }
}
