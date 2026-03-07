import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

type StrategyFormData = {
  projectId: string;
  businessType: string;
  monthlyBudget: string;
  mainGoal: string;
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

function parseStoredStrategyContent(
  rawContent: string,
  fallbackProjectData: { name: string; domain: string; niche: string; targetCity: string }
) {
  try {
    const parsed = JSON.parse(rawContent) as {
      markdown?: string;
      formData?: {
        businessType?: string;
        monthlyBudget?: string;
        mainGoal?: string;
      };
      projectData?: {
        name?: string;
        domain?: string;
        niche?: string;
        targetCity?: string;
      };
    };

    return {
      markdown: parsed.markdown || rawContent,
      formData: parsed.formData || null,
      projectData: {
        name: parsed.projectData?.name || fallbackProjectData.name,
        domain: parsed.projectData?.domain || fallbackProjectData.domain,
        niche: parsed.projectData?.niche || fallbackProjectData.niche,
        targetCity: parsed.projectData?.targetCity || fallbackProjectData.targetCity,
      },
    };
  } catch {
    return {
      markdown: rawContent,
      formData: null,
      projectData: fallbackProjectData,
    };
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const strategies = await db.strategy.findMany({
      where: {
        project: {
          user: {
            email: session.user.email,
          },
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            domain: true,
            niche: true,
            targetCity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    const serialized = strategies.map((item) => {
      const parsed = parseStoredStrategyContent(item.content, {
        name: item.project.name,
        domain: item.project.domain,
        niche: item.project.niche,
        targetCity: item.project.targetCity,
      });

      return {
        id: item.id,
        createdAt: item.createdAt,
        projectId: item.project.id,
        projectName: item.project.name,
        projectDomain: item.project.domain,
        markdown: parsed.markdown,
        formData: parsed.formData,
        projectData: parsed.projectData,
      };
    });

    return NextResponse.json({ strategies: serialized }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error(`Strategy fetch error: ${message}`);
    return NextResponse.json(
      { error: "Unable to load strategy history right now." },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as StrategyFormData;
    const { projectId, businessType, monthlyBudget, mainGoal } = body;

    if (!projectId || !businessType || !monthlyBudget || !mainGoal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch project with latest analysis
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        user: { email: session.user.email },
      },
      include: {
        analysisResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is missing from environment");
      return NextResponse.json(
        { error: "AI Service is temporarily unavailable. Please configure API credentials." },
        { status: 503 }
      );
    }

    const model = "openai/gpt-oss-20b";

    // Construct Pakistan-focused SEO strategy prompt
    const prompt = `You are an SEO strategist specializing in the Pakistan market.

Generate a detailed 3-Month Week-by-Week SEO Roadmap in MARKDOWN FORMAT.

PROJECT DATA:
- Website: ${project.domain}
- Project Name: ${project.name}
- Niche: ${project.niche}
- Target City: ${project.targetCity}
- Business Type: ${businessType}
- Monthly Budget: ${monthlyBudget}
- Main Goal: ${mainGoal}

REQUIREMENTS:
- Create exactly 3 months of SEO strategy
- Each month should have a clear title and 4 weeks of tasks
- Focus on Pakistan market (include GMB optimization, local directories like OLX, Zameen, Daraz)
- Each week should have 3-5 specific, actionable tasks
- Month 1: Foundation (Technical SEO, GMB setup, keyword research)
- Month 2: Content & On-Page (Content creation, optimization, internal linking)
- Month 3: Authority Building (Link building, social signals, monitoring)

FORMAT YOUR RESPONSE AS:
# Month 1: [Title]

## Week 1
- Task 1
- Task 2
- Task 3

## Week 2
- Task 1
- Task 2
- Task 3

[Continue for all 4 weeks, then repeat for Month 2 and Month 3]

Generate the complete 3-month roadmap now.`;

    console.log(`Generating strategy for project: ${project.name} (${project.domain})`);

    let response: Response;
    try {
      response = await Promise.race([
        fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "RankIQ - SEO Strategy Generator",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 3000,
          }),
        }),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 45000)
        ),
      ]);
    } catch (fetchError: unknown) {
      if (fetchError instanceof Error && fetchError.message === "Request timeout") {
        console.error("OpenRouter API timeout after 45 seconds");
        return NextResponse.json(
          { error: "The AI service is taking too long to respond. Please try again." },
          { status: 503 }
        );
      }
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { error: "Unable to connect to AI service. Please check your internet connection." },
        { status: 503 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} - ${errorText}`);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "API authentication failed. Please contact support." },
          { status: 503 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Service is currently busy. Please try again in a few moments." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "AI service encountered an error. Please try again." },
        { status: 503 }
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;

    if (!content || content.trim().length === 0) {
      console.error("OpenRouter returned empty content");
      return NextResponse.json(
        { error: "AI service returned an empty response. Please try again." },
        { status: 503 }
      );
    }

    console.log("Strategy generated successfully");

    // Save strategy to database
    await db.strategy.create({
      data: {
        projectId: project.id,
        content: JSON.stringify({
          markdown: content,
          formData: {
            businessType,
            monthlyBudget,
            mainGoal,
          },
          projectData: {
            name: project.name,
            domain: project.domain,
            niche: project.niche,
            targetCity: project.targetCity,
          },
          generatedAt: new Date().toISOString(),
        }),
      },
    });

    const strategyResponse: StrategyResponse = {
      content,
      projectData: {
        name: project.name,
        domain: project.domain,
        niche: project.niche,
        targetCity: project.targetCity,
      },
    };

    return NextResponse.json(strategyResponse, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error(`Strategy generation error: ${message}`);
    return NextResponse.json(
      { error: "AI Service is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
