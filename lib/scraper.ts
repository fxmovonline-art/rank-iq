import axios from "axios";
import * as cheerio from "cheerio";

interface ScrapedSignals {
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  h1Texts: string[];
  h2Count: number;
  wordCount: number;
  hasJsonLd: boolean;
  jsonLdSchema: any;
  hasFaq: boolean;
  faqItems: number;
  error?: string;
}

/**
 * Primary layer: Use Browserless.io to handle JS-heavy sites
 */
export async function scrapePrimaryLayer(url: string, browserlessToken?: string): Promise<string | null> {
  try {
    if (!browserlessToken) {
      return null;
    }

    const response = await axios.post(
      "https://chrome.browserless.io/content",
      { url },
      {
        headers: {
          Authorization: `Bearer ${browserlessToken}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    console.warn(`Browserless scraping failed for ${url}:`, error.message);
  }

  return null;
}

/**
 * Secondary layer: Use Cheerio for fast static scraping
 */
export async function scrapeSecondaryLayer(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    // Check if site blocks automated access (Cloudflare)
    if (error.response?.status === 403 || error.response?.status === 429) {
      throw new Error("site_blocked");
    }
    console.warn(`Cheerio scraping failed for ${url}:`, error.message);
  }

  return null;
}

/**
 * Extract signals from HTML using Cheerio
 */
export function extractSignals(html: string): ScrapedSignals {
  const $ = cheerio.load(html);

  // Extract title
  const title = $("title").text() || $('meta[property="og:title"]').attr("content") || null;

  // Extract meta description
  const metaDescription =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    null;

  // Count H1 tags and extract text
  const h1Elements = $("h1");
  const h1Count = h1Elements.length;
  const h1Texts: string[] = [];
  h1Elements.each((_, element) => {
    const text = $(element).text().trim();
    if (text) h1Texts.push(text);
  });

  // Count H2 tags
  const h2Count = $("h2").length;

  // Calculate visible word count
  const bodyText = $("body").text();
  const wordCount = bodyText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Check for JSON-LD schema
  const jsonLdScripts = $('script[type="application/ld+json"]');
  let hasJsonLd = false;
  let jsonLdSchema: any = null;

  if (jsonLdScripts.length > 0) {
    hasJsonLd = true;
    try {
      const firstSchema = jsonLdScripts.first().html();
      if (firstSchema) {
        jsonLdSchema = JSON.parse(firstSchema);
      }
    } catch (e) {
      console.warn("Failed to parse JSON-LD schema");
    }
  }

  // Check for FAQ sections (common FAQ markup patterns)
  const faqPatterns = [
    $('script[type="application/ld+json"]').length > 0 &&
      jsonLdSchema &&
      jsonLdSchema["@type"] === "FAQPage",
    $(".faq").length > 0,
    $("[itemtype*='FAQPage']").length > 0,
    $("details summary").length > 0,
  ];

  const hasFaq = faqPatterns.some((pattern) => pattern);
  const faqItems = Math.max(
    $('[itemtype*="Question"]').length,
    $(".faq-item").length,
    $("details").length
  );

  return {
    title,
    metaDescription,
    h1Count,
    h1Texts,
    h2Count,
    wordCount,
    hasJsonLd,
    jsonLdSchema,
    hasFaq,
    faqItems,
  };
}

/**
 * Main scraping function with two-layer strategy
 */
export async function scrapeURL(
  url: string,
  browserlessToken?: string
): Promise<{ signals: ScrapedSignals; success: boolean; error?: string }> {
  let html: string | null = null;
  let error: string | undefined;

  try {
    // Validate URL
    new URL(url);

    // Try primary layer (Browserless) first
    if (browserlessToken) {
      html = await scrapePrimaryLayer(url, browserlessToken);
    }

    // If primary fails, try secondary layer (Cheerio)
    if (!html) {
      html = await scrapeSecondaryLayer(url);
    }

    // If both fail, throw error
    if (!html) {
      throw new Error("Unable to fetch content from URL");
    }

    // Extract signals from HTML
    const signals = extractSignals(html);

    return {
      signals,
      success: true,
    };
  } catch (err: any) {
    if (err.message === "site_blocked") {
      error = "This site blocks automated analysis.";
    } else {
      error = err.message || "Failed to scrape URL";
    }

    return {
      signals: {
        title: null,
        metaDescription: null,
        h1Count: 0,
        h1Texts: [],
        h2Count: 0,
        wordCount: 0,
        hasJsonLd: false,
        jsonLdSchema: null,
        hasFaq: false,
        faqItems: 0,
      },
      success: false,
      error,
    };
  }
}
