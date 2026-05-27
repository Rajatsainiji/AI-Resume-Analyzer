const axios = require("axios");

const analyzeResume = async (resumeText, jobDescription) => {
  const prompt = `
Analyze this resume.

Return ONLY valid JSON.

{
  "atsScore": number,
  "missingKeywords": [],
  "suggestions": [],
  "summary": "",
  "aiProbability": number
}

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
          parts: [{ text: prompt }],
        },
      ],
    }
  );

  const text =
    response.data.candidates[0].content.parts[0].text;

  return JSON.parse(text.replace(/```json|```/g, ""));
};

module.exports = analyzeResume;