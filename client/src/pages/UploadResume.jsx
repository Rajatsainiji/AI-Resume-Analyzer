import { useState } from "react";
import axios from "axios";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const submit = async () => {
    const formData = new FormData();

    formData.append("resume", file);
    formData.append(
      "jobDescription",
      jobDescription
    );

    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/api/resume/upload",
      formData,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    setResult(res.data);
  };


  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        Upload Resume
      </h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <textarea
        className="border p-3 w-full mt-5"
        rows="8"
        placeholder="Paste Job Description"
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
      />

      <button
        onClick={submit}
        className="bg-black text-white px-6 py-3 mt-5"
      >
        Analyze Resume
      </button>

      {result && (
        <div className="mt-10 border p-5 rounded">
          <h2 className="text-2xl font-bold">
            ATS Score: {result.atsScore}%
          </h2>

          <p className="mt-4">
            AI Probability: {result.aiProbability}%
          </p>

          <h3 className="mt-5 font-bold">
            Missing Keywords
          </h3>

          <ul>
            {result.missingKeywords.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-5 font-bold">
            Suggestions
          </h3>

          <ul>
            {result.suggestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}