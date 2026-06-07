import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Pencil,
  Save,
  Target,
  Brain,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  SpellCheck,
  Layers,
  Lightbulb,
  RefreshCw,
  FileText,
} from "lucide-react";
import { jsPDF } from "jspdf";
import API from "../services/api";

const statusStyles = {
  good: "text-green-400 bg-green-500/10 border-green-500/30",
  needs_improvement: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  poor: "text-red-400 bg-red-500/10 border-red-500/30",
  missing: "text-gray-400 bg-gray-500/10 border-gray-500/30",
};

const statusLabel = (status) =>
  (status || "needs_improvement")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function AnalysisResults() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");

  const isPdf = result?.fileMimeType === "application/pdf";

  useEffect(() => {
    API.get(`/resume/${id}`)
      .then((res) => {
        setResult(res.data);
        setEditText(res.data.resumeText || "");
      })
      .catch(() => alert("Failed to load analysis"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!result || !isPdf) return;

    let objectUrl = "";
    API.get(`/resume/${id}/file`, { responseType: "blob" })
      .then((res) => {
        objectUrl = URL.createObjectURL(res.data);
        setPdfBlobUrl(objectUrl);
      })
      .catch(() => setPdfBlobUrl(""));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [result, id, isPdf]);

  const downloadOriginal = async () => {
    try {
      const res = await API.get(`/resume/${id}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = result?.fileName || "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  const downloadEditedPdf = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(editText || result?.resumeText || "", 180);
    doc.setFontSize(11);
    doc.text(lines, 15, 20);
    doc.save(`${result?.fileName?.replace(/\.[^.]+$/, "") || "resume"}_edited.pdf`);
  };

  const saveResume = async (reanalyze = false) => {
    try {
      setSaving(true);
      const res = await API.put(`/resume/${id}/resume-text`, {
        resumeText: editText,
        reanalyze,
      });
      setResult(res.data);
      setEditText(res.data.resumeText);
      setEditing(false);
      if (reanalyze) alert("Resume updated and re-analyzed!");
      else alert("Resume text saved!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <RefreshCw className="animate-spin mr-2" />
        Loading analysis...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Analysis not found.{" "}
        <Link to="/dashboard" className="text-blue-400 ml-2">Go to Dashboard</Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "keywords", label: "Keywords" },
    { id: "spelling", label: "Spelling" },
    { id: "sections", label: "Sections" },
    { id: "improve", label: "Improve" },
  ];

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="border-b border-white/10 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <h1 className="text-lg font-bold">ATS Analysis Results</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm"
          >
            <Pencil size={16} />
            {editing ? "Close Editor" : "Edit Resume"}
          </button>
          <button
            onClick={downloadOriginal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm"
          >
            <Download size={16} />
            Download Original
          </button>
          <button
            onClick={downloadEditedPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-medium"
          >
            <Download size={16} />
            Download Edited PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">
        {/* LEFT — Issues & Suggestions */}
        <div className="w-full lg:w-1/2 border-r border-white/10 flex flex-col min-h-[50vh] lg:min-h-0 lg:max-h-[calc(100vh-73px)]">
          <div className="grid grid-cols-3 gap-2 p-4 border-b border-white/10">
            {[
              { icon: Target, label: "ATS", value: `${result.atsScore}%`, color: "text-blue-400" },
              { icon: Brain, label: "AI", value: `${result.aiProbability}%`, color: "text-purple-400" },
              { icon: Sparkles, label: "Match", value: `${result.keywordMatchScore ?? 0}%`, color: "text-cyan-400" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                <s.icon className={`${s.color} mx-auto mb-1`} size={18} />
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-1 p-3 border-b border-white/10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "overview" && (
              <>
                {result.summary && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <h3 className="font-semibold mb-2">Summary</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{result.summary}</p>
                  </div>
                )}
                {result.description && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <h3 className="font-semibold mb-2">Detailed Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{result.description}</p>
                  </div>
                )}
                {result.suggestions?.map((item, i) => (
                  <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex gap-2 text-sm">
                    <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </>
            )}

            {activeTab === "keywords" && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-300">
                    <XCircle size={18} /> Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords?.map((k) => (
                      <span key={k} className="bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full text-sm">{k}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-300">
                    <CheckCircle2 size={18} /> Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords?.map((k) => (
                      <span key={k} className="bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full text-sm">{k}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "spelling" && (
              result.spellingErrors?.length > 0 ? (
                result.spellingErrors.map((err, i) => (
                  <div key={i} className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-sm">
                    <span className="text-xs bg-orange-500/20 px-2 py-0.5 rounded">{err.section}</span>
                    <p className="mt-2">
                      <span className="line-through text-red-300">{err.wrong}</span>
                      {" → "}
                      <span className="text-green-300 font-medium">{err.correct}</span>
                    </p>
                    {err.context && <p className="text-gray-400 italic mt-1">"{err.context}"</p>}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No spelling errors found.</p>
              )
            )}

            {activeTab === "sections" && (
              result.sectionAnalysis?.map((section, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{section.sectionName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyles[section.status] || statusStyles.needs_improvement}`}>
                      {statusLabel(section.status)}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 mb-3">{section.score}%</p>
                  {section.issues?.map((issue, j) => (
                    <p key={j} className="text-sm text-gray-300 flex gap-2 mb-1">
                      <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                      {issue}
                    </p>
                  ))}
                  {section.suggestions?.map((tip, j) => (
                    <p key={j} className="text-sm text-gray-300 flex gap-2 mb-1 mt-2">
                      <CheckCircle2 size={14} className="text-green-400 shrink-0 mt-0.5" />
                      {tip}
                    </p>
                  ))}
                </div>
              ))
            )}

            {activeTab === "improve" && (
              <>
                {result.improvements?.map((item, i) => (
                  <div key={i} className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-2 text-sm">
                    <Lightbulb size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* RIGHT — Resume PDF / Editor */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-[50vh] lg:min-h-0 lg:max-h-[calc(100vh-73px)]">
          {editing ? (
            <div className="flex flex-col flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Pencil size={18} /> Edit Resume Text
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveResume(false)}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-sm hover:bg-white/5"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={() => saveResume(true)}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-sm"
                  >
                    <RefreshCw size={14} /> Save & Re-analyze
                  </button>
                </div>
              </div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm leading-relaxed outline-none focus:border-blue-500 resize-none font-mono"
              />
            </div>
          ) : isPdf ? (
            pdfBlobUrl ? (
              <iframe
                src={`${pdfBlobUrl}#toolbar=1`}
                title="Resume PDF"
                className="flex-1 w-full bg-gray-900"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Loading PDF preview...
              </div>
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <FileText size={48} className="text-blue-400 mb-4" />
              <p className="text-gray-300 mb-2">DOCX preview not available in browser.</p>
              <p className="text-gray-400 text-sm mb-6">Use Edit Resume to view and modify text, or download the original file.</p>
              <button onClick={downloadOriginal} className="px-5 py-2.5 rounded-xl bg-blue-600 text-sm">
                Download Original File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
