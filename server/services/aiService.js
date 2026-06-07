const {
  GoogleGenerativeAI,
  SchemaType,
} = require("@google/generative-ai");

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

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    atsScore: { type: SchemaType.NUMBER },
    aiProbability: { type: SchemaType.NUMBER },
    summary: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    missingKeywords: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    suggestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    improvements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    spellingErrors: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          section: { type: SchemaType.STRING },
          wrong: { type: SchemaType.STRING },
          correct: { type: SchemaType.STRING },
          context: { type: SchemaType.STRING },
        },
        required: ["section", "wrong", "correct"],
      },
    },
    sectionAnalysis: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          sectionName: { type: SchemaType.STRING },
          score: { type: SchemaType.NUMBER },
          status: { type: SchemaType.STRING },
          issues: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          suggestions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["sectionName", "score", "status", "issues", "suggestions"],
      },
    },
  },
  required: [
    "atsScore",
    "aiProbability",
    "summary",
    "description",
    "missingKeywords",
    "suggestions",
    "improvements",
    "spellingErrors",
    "sectionAnalysis",
  ],
};

const SECTION_NAMES = [
  "Contact / Header",
  "Professional Summary",
  "Work Experience",
  "Education",
  "Skills",
  "Projects",
  "Certifications",
  "Formatting & ATS Compatibility",
];

const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s+#.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractTerms = (text) => {
  const normalized = normalizeText(text);
  const terms = new Set();

  const phrases =
    normalized.match(/[a-z0-9]+(?:\s+[a-z0-9]+){0,2}/g) || [];

  for (const phrase of phrases) {
    const words = phrase.split(" ").filter(Boolean);
    if (words.length === 1) {
      if (words[0].length >= 3 && !STOP_WORDS.has(words[0])) {
        terms.add(words[0]);
      }
    } else if (
      words.every((w) => w.length >= 2 && !STOP_WORDS.has(w))
    ) {
      terms.add(phrase);
    }
  }

  const techTokens =
    normalized.match(/[a-z0-9]+(?:\.[a-z0-9]+)?(?:\+{1,2})?/gi) ||
    [];

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

const toStringArray = (arr, limit = 15) =>
  Array.isArray(arr)
    ? arr.map(String).filter(Boolean).slice(0, limit)
    : [];

const normalizeSectionAnalysis = (sections) => {
  if (!Array.isArray(sections)) {
    return [];
  }

  return sections
    .filter((s) => s && typeof s === "object")
    .map((s) => ({
      sectionName: String(s.sectionName || "Unknown Section"),
      score: clamp(Number(s.score) || 0, 0, 100),
      status: String(s.status || "needs_improvement"),
      issues: toStringArray(s.issues, 8),
      suggestions: toStringArray(s.suggestions, 6),
    }))
    .slice(0, 12);
};

const normalizeSpellingErrors = (errors) => {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors
    .filter((e) => e && typeof e === "object")
    .map((e) => ({
      section: String(e.section || "General"),
      wrong: String(e.wrong || ""),
      correct: String(e.correct || ""),
      context: String(e.context || ""),
    }))
    .filter((e) => e.wrong && e.correct)
    .slice(0, 25);
};

const validateAnalysis = (raw, keywordResult) => {
  const aiAtsScore = clamp(Number(raw.atsScore) || 0, 0, 100);
  const keywordScore = keywordResult.score;
  const blendedAtsScore = Math.round(
    aiAtsScore * 0.65 + keywordScore * 0.35
  );

  const missingKeywords = [
    ...new Set([
      ...toStringArray(raw.missingKeywords, 12),
      ...keywordResult.missing.slice(0, 12),
    ]),
  ].slice(0, 15);

  return {
    atsScore: blendedAtsScore,
    keywordMatchScore: keywordScore,
    matchedKeywords: keywordResult.matched.slice(0, 20),
    missingKeywords,
    suggestions: toStringArray(raw.suggestions, 10),
    improvements: toStringArray(raw.improvements, 12),
    summary:
      typeof raw.summary === "string" && raw.summary.trim()
        ? raw.summary.trim()
        : "Analysis completed.",
    description:
      typeof raw.description === "string" && raw.description.trim()
        ? raw.description.trim()
        : "",
    aiProbability: clamp(Number(raw.aiProbability) || 0, 0, 100),
    spellingErrors: normalizeSpellingErrors(raw.spellingErrors),
    sectionAnalysis: normalizeSectionAnalysis(raw.sectionAnalysis),
  };
};

const buildPrompt = (resumeText, jobDescription, keywordResult) => `
You are an expert ATS resume analyzer and career coach.

Analyze the resume against the job description. Be strict, objective, and section-wise.

SCORING RUBRIC (atsScore 0-100):
- Keyword & skills alignment (40%)
- Experience relevance (25%)
- Achievements & impact (15%)
- Resume structure & clarity (10%)
- Formatting & ATS compatibility (10%)

Calibration: local keyword match is ${keywordResult.score}% (${keywordResult.matched.length} matched, ${keywordResult.missing.length} missing). Do not inflate scores; average resumes score 45-65, strong matches 70-85.

REQUIRED OUTPUT:
1. atsScore — overall ATS compatibility (integer 0-100)
2. aiProbability — likelihood resume text is AI-generated (0=human, 100=likely AI)
3. summary — 2-3 sentence overview for the candidate
4. description — detailed paragraph explaining strengths, gaps vs job, and overall fit
5. missingKeywords — important JD skills/terms missing or weak in resume (up to 12)
6. suggestions — general actionable tips (up to 8)
7. improvements — specific resume edits to increase ATS score (up to 12, be concrete)
8. spellingErrors — list every spelling/grammar typo found with section, wrong word, correct word, and short context quote. If none, return empty array.
9. sectionAnalysis — analyze EACH of these sections (include even if missing):
   ${SECTION_NAMES.map((s) => `- ${s}`).join("\n   ")}
   For each section provide: sectionName, score (0-100), status (good | needs_improvement | poor | missing), issues (problems/mistakes in that section), suggestions (how to fix that section)

Job Description:
${jobDescription.trim()}

Resume:
${resumeText.trim().slice(0, 14000)}
`;

const parseGeminiJson = (text) => {
  let cleaned = (text || "").trim();
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Gemini response did not contain valid JSON");
  }

  return JSON.parse(cleaned.substring(start, end + 1));
};

const analyzeResume = async (resumeText, jobDescription) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to server/.env — get a free key at https://aistudio.google.com/apikey"
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

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const modelName =
    process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const result = await model.generateContent(
    buildPrompt(resumeText, jobDescription, keywordResult)
  );

  const text = result.response.text();
  const parsed = parseGeminiJson(text);

  return validateAnalysis(parsed, keywordResult);
};

module.exports = analyzeResume;
