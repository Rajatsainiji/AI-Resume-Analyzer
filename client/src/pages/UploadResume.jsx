// import { useState } from "react";
// import axios from "axios";

// export default function UploadResume() {
//   const [file, setFile] = useState(null);
//   const [jobDescription, setJobDescription] = useState("");
//   const [result, setResult] = useState(null);

//   const submit = async () => {
//     const formData = new FormData();

//     formData.append("resume", file);
//     formData.append(
//       "jobDescription",
//       jobDescription
//     );

//     const token = localStorage.getItem("token");

//     const res = await axios.post(
//       "http://localhost:5000/api/resume/upload",
//       formData,
//       {
//         headers: {
//           Authorization: token,
//         },
//       }
//     );

//     setResult(res.data);
//   };


//   return (
//     <div className="p-10">
//       <h1 className="text-3xl font-bold mb-5">
//         Upload Resume
//       </h1>

//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files[0])}
//       />

//       <textarea
//         className="border p-3 w-full mt-5"
//         rows="8"
//         placeholder="Paste Job Description"
//         onChange={(e) =>
//           setJobDescription(e.target.value)
//         }
//       />

//       <button
//         onClick={submit}
//         className="bg-black text-white px-6 py-3 mt-5"
//       >
//         Analyze Resume
//       </button>

//       {result && (
//         <div className="mt-10 border p-5 rounded">
//           <h2 className="text-2xl font-bold">
//             ATS Score: {result.atsScore}%
//           </h2>

//           <p className="mt-4">
//             AI Probability: {result.aiProbability}%
//           </p>

//           <h3 className="mt-5 font-bold">
//             Missing Keywords
//           </h3>

//           <ul>
//             {result.missingKeywords.map((item) => (
//               <li key={item}>{item}</li>
//             ))}
//           </ul>

//           <h3 className="mt-5 font-bold">
//             Suggestions
//           </h3>

//           <ul>
//             {result.suggestions.map((item) => (
//               <li key={item}>{item}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState } from "react";
import axios from "axios";
import {
  UploadCloud,
  FileText,
  Brain,
  Target,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!file) {
      return alert("Please upload resume");
    }

    if (!jobDescription) {
      return alert("Please enter job description");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);
      formData.append(
        "jobDescription",
        jobDescription
      );

      const token =
        localStorage.getItem("token");

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
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Analysis failed. Check OpenAI API key and try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 sm:p-6 lg:p-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Resume ATS Analyzer
        </h1>

        <p className="text-gray-400 mt-2">
          Upload your resume and compare it
          with the job description.
        </p>
      </div>

      {/* UPLOAD SECTION */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* FILE UPLOAD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-5">
            Upload Resume
          </h2>

          <label className="border-2 border-dashed border-blue-500 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition">
            <UploadCloud
              size={50}
              className="text-blue-400 mb-4"
            />

            <p className="text-lg font-medium">
              Click or Drag Resume Here
            </p>

            <p className="text-gray-400 text-sm mt-2">
              PDF / DOCX Supported
            </p>

            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />
          </label>

          {file && (
            <div className="mt-5 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
              <FileText />
              <span>{file.name}</span>
            </div>
          )}
        </div>

        {/* JOB DESCRIPTION */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-5">
            Job Description
          </h2>

          <textarea
            rows={12}
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(
                e.target.value
              )
            }
            placeholder="Paste Job Description Here..."
            className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white outline-none"
          />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-5 bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            {loading
              ? "Analyzing Resume..."
              : "Analyze Resume"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {result && (
        <>
          {/* SCORE CARDS */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {/* ATS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <Target
                size={35}
                className="text-blue-400 mb-4"
              />

              <h3 className="text-gray-400">
                ATS Score
              </h3>

              <p className="text-5xl font-bold mt-2">
                {result.atsScore}%
              </p>
            </div>

            {/* AI */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <Brain
                size={35}
                className="text-purple-400 mb-4"
              />

              <h3 className="text-gray-400">
                AI Detection
              </h3>

              <p className="text-5xl font-bold mt-2">
                {result.aiProbability}%
              </p>
            </div>

            {/* MATCH */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <Sparkles
                size={35}
                className="text-cyan-400 mb-4"
              />

              <h3 className="text-gray-400">
                Skills Match
              </h3>

              <p className="text-5xl font-bold mt-2">
                {result.keywordMatchScore ?? 0}%
              </p>
            </div>
          </div>

          {/* KEYWORDS + SUGGESTIONS */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            {/* KEYWORDS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                Missing Keywords
              </h2>

              <div className="flex flex-wrap gap-3">
                {result.missingKeywords?.map(
                  (item) => (
                    <span
                      key={item}
                      className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* SUGGESTIONS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-5">
                AI Suggestions
              </h2>

              <div className="space-y-4">
                {result.suggestions?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3"
                    >
                      <AlertCircle
                        className="text-blue-400 mt-1"
                        size={18}
                      />

                      <p>{item}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}