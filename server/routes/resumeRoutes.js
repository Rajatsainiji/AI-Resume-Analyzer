const router = require("express").Router();
const upload = require("../utils/multer");
const auth = require("../middleware/authMiddleware");
const {
  uploadResume,
  getHistory,
  getAnalysis,
  getResumeFile,
  downloadResume,
  updateResumeText,
} = require("../controllers/resumeController");

router.post("/upload", auth, upload.single("resume"), uploadResume);
router.get("/history", auth, getHistory);
router.get("/:id", auth, getAnalysis);
router.get("/:id/file", auth, getResumeFile);
router.get("/:id/download", auth, downloadResume);
router.put("/:id/resume-text", auth, updateResumeText);

module.exports = router;
