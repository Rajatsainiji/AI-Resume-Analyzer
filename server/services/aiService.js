const OpenAI = require("openai");

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "could", "should", "may", "might", "must", "shall", "can",
  "this", "that", "these", "those", "i", "you", "he", "she", "it", "we",
  "they", "what", "which", "who", "when", "where", "why", "how", "all",
  "each", "every", "both", "few", "more", "most", "other", "some", "such",
  "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "just", "about", "into", "through", "during", "before", "after", "above",
  "below", "between", "under", "again", "further", "then", "once", "here",
  "there", "any", "our", "your", "their", "my", "me", "him", "her", "us",
  "them", "its", "am", "if", "while", "also", "etc", "using", "use", "used",
  "including", "include", "required", "preferred", "experience", "years",
  "year", "work", "working", "role", "position", "job", "team", "company",
  "ability", "able", "strong", "excellent", "good", "looking", "seeking",
]);

const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s+#.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractTerms = (text) => {
  const normalized = normalizeText(text);
  const terms = new Set();

  const phrases = normalized.match(
    /[a-z0-9]+(?:\s+[a-z0-9]+){0,2}/g
  ) || [];

  for (const phrase of phrases) {
    const words = phrase.split(" ").filter(Boolean);
    if (words.length === 1) {
      if (words[0].length >= 3 && !STOP_WORDS.has(words[0])) {
        terms.add(words[0]);
      }
    } else if (words.every((w) => w.length >= 2 && !STOP_WORDS.has(w))) {
      terms.add(phrase);
    }
  }

  const techTokens = normalized.match(
    /[a-z0-9]+(?:\.[a-z0-9]+)?(?:\+{1,2})?/gi
  ) || [];

  for (const token of techTokens) {
    const t = token.toLowerCase();
    if (t.length >= 2 && !STOP_WORDS.has(t)) {
      terms.add(t);
    }
  }

  return [...terms];
};

const computeKeywordMatchScore = (resumeText, jobDescription) => {
  if (!jobDescription?.trim()) {
    return { score: 0, matched: [], missing: [] };
  }

  const resumeNorm = normalizeText(resumeText);
  const jdTerms = extractTerms(jobDescription);

  if (jdTerms.length === 0) {
    return { score: 0, matched: [], missing: [] };
  }

  const matched = [];
  const missing = [];

  for (const term of jdTerms) {
    if (resumeNorm.includes(term)) {
      matched.push(term);
    } else {
      missing.push(term);
    }
  }

  const score = Math.round((matched.length / jdTerms.length) * 100);
  return { score, matched, missing };
};

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

const parseAiJson = (content) => {
  let text = (content || "").trim();
  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("AI response did not contain valid JSON");
  }

  return JSON.parse(text.substring(start, end + 1));
};

const validateAnalysis = (raw, keywordResult) => {
  const atsScore = clamp(Number(raw.atsScore) || 0, 0, 100);
  const aiProbability = clamp(Number(raw.aiProbability) || 0, 0, 100);

  const missingKeywords = Array.isArray(raw.missingKeywords)
    ? raw.missingKeywords.map(String).filter(Boolean).slice(0, 15)
    : [];

  const suggestions = Array.isArray(raw.suggestions)
    ? raw.suggestions.map(String).filter(Boolean).slice(0, 10)
    : [];

  const summary =
    typeof raw.summary === "string" && raw.summary.trim()
      ? raw.summary.trim()
      : "Analysis completed.";

  const keywordScore = keywordResult.score;
  const blendedAtsScore = Math.round(
    atsScore * 0.65 + keywordScore * 0.35
  );

  const mergedMissing = [
    ...new Set([
      ...missingKeywords,
      ...keywordResult.missing.slice(0, 12),
    ]),
  ].slice(0, 15);

  return {
    atsScore: blendedAtsScore,
    keywordMatchScore: keywordScore,
    missingKeywords: mergedMissing,
    suggestions,
    summary,
    aiProbability,
    matchedKeywords: keywordResult.matched.slice(0, 20),
  };
};

const SYSTEM_PROMPT = `You are a strict Applicant Tracking System (ATS) resume analyzer used by recruiters.

Score the resume ONLY against the provided job description. Be objective and consistent.

Scoring rubric (total 0-100):
- Keyword & skills alignment (40%): required skills, tools, frameworks, certifications from the JD
- Experience relevance (25%): years, seniority, domain, responsibilities match
- Achievements & impact (15%): metrics, outcomes, quantified results
- Resume structure & clarity (10%): sections (summary, experience, skills, education), readability
- Formatting & ATS compatibility (10%): standard headings, no critical parsing issues

Rules:
- atsScore: integer 0-100 reflecting the rubric above
- aiProbability: integer 0-100 estimating how likely the resume text was AI-generated (0 = human, 100 = likely AI)
- missingKeywords: up to 12 important JD terms/skills absent or weak in the resume
- suggestions: up to 8 specific, actionable improvements tied to the JD
- summary: 2-3 sentences for the candidate
- Do not inflate scores; average resumes are 45-65, strong matches 70-85, exceptional 86+
- Return ONLY valid JSON with keys: atsScore, missingKeywords, suggestions, summary, aiProbability`;

const analyzeResume = async (resumeText, jobDescription) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is missing. Add it to server/.env — see README."
    );
  }

  if (!resumeText?.trim() || resumeText === "Unsupported file") {
    throw new Error(
      "Could not read resume text. Upload a PDF or DOCX file."
    );
  }

  if (!jobDescription?.trim()) {
    throw new Error("Job description is required for ATS analysis.");
  }

  const keywordResult = computeKeywordMatchScore(
    resumeText,
    jobDescription
  );

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const model =
    process.env.OPENAI_MODEL || "gpt-4o-mini";

  const userPrompt = `Job Description:
${jobDescription.trim()}

Resume:
${resumeText.trim().slice(0, 12000)}

Deterministic keyword match from JD: ${keywordResult.score}% (${keywordResult.matched.length} matched, ${keywordResult.missing.length} missing).
Use this as a calibration anchor; your atsScore should not differ by more than 20 points from keyword match unless experience/achievements strongly justify it.

Return JSON only.`;

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const content =
    completion.choices[0]?.message?.content;
  const parsed = parseAiJson(content);

  return validateAnalysis(parsed, keywordResult);
};

module.exports = analyzeResume;
