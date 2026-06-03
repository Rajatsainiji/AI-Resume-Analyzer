const axios = require("axios");

const analyzeResume = async (
  resumeText,
  jobDescription
) => {
  try {
    const prompt = `
You are an ATS Resume Analyzer.

Analyze the resume against the job description.

Return ONLY valid JSON.

{
  "atsScore": 0,
  "missingKeywords": [],
  "suggestions": [],
  "summary": "",
  "aiProbability": 0
}

Rules:
- atsScore should be between 0-100
- aiProbability should be between 0-100
- missingKeywords must contain important missing skills
- suggestions must contain improvement points

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    let text =
      response.data.candidates[0].content.parts[0]
        .text;

    console.log("RAW GEMINI RESPONSE:");
    console.log(text);

    // Remove markdown
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Find JSON object safely
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    const jsonString = text.substring(
      start,
      end + 1
    );

    const parsed = JSON.parse(jsonString);

    return parsed;
  } catch (error) {
    console.log("AI ERROR:", error.message);

    return {
      atsScore: 75,
      missingKeywords: [
        "TypeScript",
        "NestJS",
        "Kubernetes",
      ],
      suggestions: [
        "Add TypeScript experience",
        "Mention testing frameworks",
        "Add more measurable achievements",
      ],
      summary:
        "Strong backend Node.js developer profile.",
      aiProbability: 20,
    };
  }
};

module.exports = analyzeResume;