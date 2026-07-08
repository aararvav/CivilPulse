import type { SubmissionCategory } from "@/types/database";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export const AI_SYSTEM_PROMPT = `You analyze citizen development requests for an MP constituency platform.

Given a title and description (any language), respond with ONLY valid JSON — no markdown, no preamble, no code fences.

Output format:
{
  "language_detected": "<ISO 639-1 code or language name>",
  "translated_text": "<full English translation of the description>",
  "category": "<one of: education, roads, health, water, sanitation, other>",
  "ai_summary": "<ONE analytical insight sentence in English — do NOT rephrase or repeat the description. Name the core issue, note the urgency/severity language the citizen used, and state whether this looks like a recurring complaint type for this category. Example: 'Classroom roof leak poses immediate safety risk with urgent language; a recurring school infrastructure complaint pattern.'>",
  "priority_score": <integer 0-100 based on urgency/severity language>
}

Rules:
- category must be exactly one of: education, roads, health, water, sanitation, other
- ai_summary must be analytical insight, NOT a copy or paraphrase of the citizen's words
- priority_score: higher for safety risks, health hazards, large groups affected, urgent language
- translated_text must be in English even if input is already English`;

export interface AiAnalysisResult {
  language_detected: string;
  translated_text: string;
  category: SubmissionCategory;
  ai_summary: string;
  priority_score: number;
}

const VALID_CATEGORIES: SubmissionCategory[] = [
  "education",
  "roads",
  "health",
  "water",
  "sanitation",
  "other",
];

function parseJsonResponse(raw: string): AiAnalysisResult {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned) as AiAnalysisResult;

  if (!parsed.language_detected || !parsed.translated_text || !parsed.ai_summary) {
    throw new Error("AI response missing required fields");
  }

  if (!VALID_CATEGORIES.includes(parsed.category)) {
    parsed.category = "other";
  }

  parsed.priority_score = Math.min(
    100,
    Math.max(0, Math.round(Number(parsed.priority_score) || 0))
  );

  return parsed;
}

export async function analyzeSubmission(
  title: string,
  description: string,
  retries = 3
): Promise<AiAnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: AI_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Title: ${title}\n\nDescription: ${description}`,
          },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (response.status === 429 && attempt < retries) {
      const waitMs = 2500 * (attempt + 1);
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq API");
    }

    return parseJsonResponse(content);
  }

  throw new Error("Groq API rate limit exceeded after retries");
}
