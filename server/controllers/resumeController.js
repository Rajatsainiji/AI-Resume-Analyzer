const parseResume = require("../utils/parseResume");
const analyzeResume = require("../services/aiService");
const ResumeAnalysis = require("../models/ResumeAnalysis");

exports.uploadResume = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    const resumeText = await parseResume(file);

    const analysis = await analyzeResume(
      resumeText,
      jobDescription
    );

    const saved = await ResumeAnalysis.create({
      userId: req.user.id,
      resumeText,
      jobDescription,
      ...analysis,
    });

    res.json(saved);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};