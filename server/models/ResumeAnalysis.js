const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    atsScore: Number,
    keywordMatchScore: Number,
    matchedKeywords: [String],
    missingKeywords: [String],
    suggestions: [String],
    summary: String,
    aiProbability: Number,
    resumeText: String,
    jobDescription: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ResumeAnalysis",
  analysisSchema
);