import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProjectComparisonData } from "@/lib/project-comparison";

type AiRecommendations = {
  h1Variations: string[];
  gapSummary: string;
  faqSuggestions: string[];
};

function parseOpenRouterResponse(text: string): AiRecommendations {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Invalid AI response format");
  }

  const candidate = text.slice(firstBrace, lastBrace + 1);
  const parsed = JSON.parse(candidate) as Partial<AiRecommendations>;

  const h1Variations = Array.isArray(parsed.h1Variations)
    ? parsed.h1Variations.filter((item): item is string => typeof item === "string").slice(0, 3)
    : [];

  const faqSuggestions = Array.isArray(parsed.faqSuggestions)
    ? parsed.faqSuggestions.filter((item): item is string => typeof item === "string").slice(0, 5)
    : [];

  return {
    h1Variations,
    gapSummary: typeof parsed.gapSummary === "string" ? parsed.gapSummary : "",
    faqSuggestions,
  };
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const comparisonData = await getProjectComparisonData(projectId, session.user.email);

    if (!comparisonData) {
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

    const prompt = [
      "You are an SEO strategist. Analyze user site and competitor SEO signals.",
      "Return only valid JSON (no markdown) using this exact shape:",
      '{"h1Variations": ["", "", ""], "gapSummary": "", "faqSuggestions": ["", "", "", "", ""]}',
      "Rules:",
      "- h1Variations: exactly 3 improved H1 tags based on competitor trends and user niche/city.",
      "- gapSummary: concise 2-4 sentence summary of major content gaps.",
      "- faqSuggestions: exactly 5 FAQ ideas aligned with competitor topical coverage.",
      "Data:",
      JSON.stringify(comparisonData),
    ].join("\n");

    let response: Response;
    try {
      response = await Promise.race([
        fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "RankIQ",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
            max_tokens: 900,
          }),
        }),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error("OpenRouter API request timeout")), 30000)
        ),
      ]);
    } catch (fetchError: unknown) {
      if (fetchError instanceof Error && fetchError.message === "OpenRouter API request timeout") {
        console.error("OpenRouter API timeout after 30 seconds");
        return NextResponse.json(
          { error: "AI Service is temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
      throw fetchError;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status} - ${errorText}`);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "AI Service authentication failed. Please check your API key." },
          { status: 503 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: "AI Service is currently overloaded. Please try again in a moment." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "AI Service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      console.error("OpenRouter response had no text content");
      return NextResponse.json(
        { error: "AI Service returned an empty response. Please try again." },
        { status: 503 }
      );
    }

    const parsed = parseOpenRouterResponse(text);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error(`Recommendations error: ${message}`);
    return NextResponse.json(
      { error: "AI Service is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}
