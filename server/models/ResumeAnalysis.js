const mongoose = require("mongoose");

const spellingErrorSchema = new mongoose.Schema(
  {
    section: String,
    wrong: String,
    correct: String,
    context: String,
  },
  { _id: false }
);

const sectionAnalysisSchema = new mongoose.Schema(
  {
    sectionName: String,
    score: Number,
    status: String,
    issues: [String],
    suggestions: [String],
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    atsScore: Number,
    keywordMatchScore: Number,
    matchedKeywords: [String],
    missingKeywords: [String],
    suggestions: [String],
    improvements: [String],
    summary: String,
    description: String,
    aiProbability: Number,
    spellingErrors: [spellingErrorSchema],
    sectionAnalysis: [sectionAnalysisSchema],
    fileName: String,
    fileMimeType: String,
    fileData: String,
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
