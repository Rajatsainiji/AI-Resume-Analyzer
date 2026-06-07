import { useState, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  LogOut,
  Target,
  Brain,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const latest = history[0];

  useEffect(() => {
    API.get("/resume/history")
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]));
  }, []);

  const submit = async () => {
    if (!file) return alert("Please upload a resume");
    if (!jobDescription.trim()) return alert("Please enter job description");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/results/${res.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/10 px-4 sm:px-6 lg:px-10 py-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome, {user?.name || "User"}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 border border-white/10 px-4 py-2.5 rounded-xl hover:bg-white/5 transition text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        {latest && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Target, label: "Latest ATS Score", value: `${latest.atsScore}%`, color: "text-blue-400" },
              { icon: Brain, label: "AI Detection", value: `${latest.aiProbability}%`, color: "text-purple-400" },
              { icon: Sparkles, label: "Keyword Match", value: `${latest.keywordMatchScore ?? 0}%`, color: "text-cyan-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <stat.icon className={`${stat.color} mb-3`} size={24} />
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
            <label className="border-2 border-dashed border-blue-500/60 rounded-2xl p-8 flex flex-col items-center cursor-pointer hover:bg-white/5 transition">
              <UploadCloud size={40} className="text-blue-400 mb-3" />
              <p className="font-medium">Click to upload resume</p>
              <p className="text-gray-400 text-sm mt-1">PDF or DOCX</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {file && (
              <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center gap-2 text-sm">
                <FileText size={18} />
                {file.name}
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Job Description</h2>
            <textarea
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 resize-none"
            />
            <button
              onClick={submit}
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-5">Recent Analysis</h2>
          {history.length === 0 ? (
            <p className="text-gray-400">No analyses yet. Upload your first resume above.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <Link
                  key={item._id}
                  to={`/results/${item._id}`}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition group"
                >
                  <div>
                    <p className="font-medium">{item.fileName || "Resume"}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      ATS {item.atsScore}% · {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-white" size={20} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
