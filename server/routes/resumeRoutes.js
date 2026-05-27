const router = require("express").Router();
const upload = require("../utils/multer");
const auth = require("../middleware/authMiddleware");
const {
  uploadResume,
} = require("../controllers/resumeController");

router.post(
  "/upload",
  auth,
  upload.single("resume"),
  uploadResume
);

module.exports = router;