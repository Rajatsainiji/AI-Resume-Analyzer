const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    atsScore: Number,
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