const parseResume = require("../utils/parseResume");
const analyzeResume = require("../services/aiService");
const ResumeAnalysis = require("../models/ResumeAnalysis");

exports.uploadResume = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    const resumeText = await parseResume(file);

    const analysis = await analyzeResume(resumeText, jobDescription);

    const saved = await ResumeAnalysis.create({
      userId: req.user.id,
      resumeText,
      jobDescription,
      fileName: file.originalname,
      fileMimeType: file.mimetype,
      fileData: file.buffer.toString("base64"),
      ...analysis,
    });

    res.json(saved);
  } catch (error) {
    console.error("Resume upload error:", error.message);
    const status =
      error.message?.includes("GEMINI") ||
      error.message?.includes("API")
        ? 503
        : 500;
    res.status(status).json({
      message: error.message || "Resume analysis failed",
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({
      userId: req.user.id,
    })
      .select(
        "atsScore aiProbability keywordMatchScore fileName createdAt summary"
      )
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).select("-fileData");

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analysis" });
  }
};

exports.getResumeFile = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).select("fileName fileMimeType fileData");

    if (!analysis?.fileData) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    const buffer = Buffer.from(analysis.fileData, "base64");
    res.setHeader(
      "Content-Type",
      analysis.fileMimeType || "application/pdf"
    );
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${analysis.fileName || "resume.pdf"}"`
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Failed to load resume file" });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).select("fileName fileMimeType fileData");

    if (!analysis?.fileData) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    const buffer = Buffer.from(analysis.fileData, "base64");
    res.setHeader(
      "Content-Type",
      analysis.fileMimeType || "application/pdf"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${analysis.fileName || "resume.pdf"}"`
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Failed to download resume" });
  }
};

exports.updateResumeText = async (req, res) => {
  try {
    const { resumeText, reanalyze } = req.body;

    if (!resumeText?.trim()) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    analysis.resumeText = resumeText.trim();

    if (reanalyze) {
      const newAnalysis = await analyzeResume(
        analysis.resumeText,
        analysis.jobDescription
      );
      Object.assign(analysis, newAnalysis);
    }

    await analysis.save();

    const response = analysis.toObject();
    delete response.fileData;
    res.json(response);
  } catch (error) {
    console.error("Update resume error:", error.message);
    res.status(500).json({
      message: error.message || "Failed to update resume",
    });
  }
};
