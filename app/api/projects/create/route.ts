import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const { name, domain, niche, targetCity, competitors } = await req.json();

    // Validate inputs
    if (!name || !domain || !niche || !targetCity || !competitors || competitors.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create project
    const project = await db.project.create({
      data: {
        name,
        domain,
        niche,
        targetCity,
        userId: user.id,
      },
    });

    // Create competitor records
    const competitorPromises = competitors.map((url: string) => {
      const competitorDomain = new URL(url).hostname;
      return db.competitor.create({
        data: {
          url,
          domain: competitorDomain,
          projectId: project.id,
        },
      });
    });

    const createdCompetitors = await Promise.all(competitorPromises);

    // Create signal records for each competitor (will be filled by scraper)
    const signalPromises = createdCompetitors.map((competitor) =>
      db.signal.create({
        data: {
          competitorId: competitor.id,
          status: "pending",
        },
      })
    );

    await Promise.all(signalPromises);

    // Start scraping analysis in the background
    // This triggers the scraper to analyze all URLs
    try {
      await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/analyze/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          targetUrl: domain,
          competitorIds: createdCompetitors.map((c) => c.id),
        }),
      });
    } catch (error) {
      console.error("Background scraping error:", error);
      // Don't fail if background scraping doesn't start immediately
    }

    return NextResponse.json(
      {
        projectId: project.id,
        message: "Project created successfully. Analysis starting...",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Project creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
