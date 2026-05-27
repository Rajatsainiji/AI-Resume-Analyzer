const pdf = require("pdf-parse");
const mammoth = require("mammoth");

const parseResume = async (file) => {
  if (file.mimetype === "application/pdf") {
    const data = await pdf(file.buffer);
    return data.text;
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }

  return "Unsupported file";
};

module.exports = parseResume;