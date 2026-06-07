import { useState, useEffect } from "react";
import {
  FileText,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter email and password");
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/google", {
        credential: response.credential,
      });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 py-14 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-2xl shadow-lg">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resume ATS Analyzer</h1>
              <p className="text-gray-400 text-sm">AI Powered Resume Screening</p>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Build A Resume
            <br />
            That Beats
            <span className="text-blue-400"> ATS Systems</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-8 max-w-2xl mb-10">
            Analyze resume score, fix mistakes section by section, and improve
            your chances of getting shortlisted.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {[
              { icon: ShieldCheck, color: "text-green-400", title: "ATS Score Check", desc: "Detailed ATS score with optimization tips." },
              { icon: Sparkles, color: "text-yellow-400", title: "AI Suggestions", desc: "Smart recommendations to improve your resume." },
              { icon: BarChart3, color: "text-cyan-400", title: "Section Analysis", desc: "See issues in each resume section clearly." },
              { icon: CheckCircle2, color: "text-blue-400", title: "Instant Results", desc: "Upload and get analysis in seconds." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6"
              >
                <Icon className={`${color} mb-4`} size={32} />
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-6">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-10">
          <div className="w-full max-w-md bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                Login to continue your ATS resume journey
              </p>
            </div>

            <div className="mb-5">
              <label className="text-gray-300 text-sm block mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 rounded-2xl p-4 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="mb-7">
              <label className="text-gray-300 text-sm block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 rounded-2xl p-4 outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login Now"}
            </button>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google login failed")}
                theme="filled_blue"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>

            <p className="text-center text-gray-300 text-sm mt-8">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
