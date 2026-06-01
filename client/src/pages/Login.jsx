// /import { useState } from "react";
// import API from "../services/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const login = async () => {
//     try {
//       const res = await API.post("/auth/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("token", res.data.token);

//       window.location.href = "/dashboard";
//     } catch (error) {
//       alert("Login Failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="border p-10 rounded w-[400px]">
//         <h1 className="text-3xl font-bold mb-5">
//           Login
//         </h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-3 w-full mb-4"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-3 w-full mb-4"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           onClick={login}
//           className="bg-black text-white w-full p-3"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-150px] left-[-100px] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-blue-600/30 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-16 py-14 text-white">
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-2xl shadow-lg">
              <FileText size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Resume ATS Analyzer
              </h1>

              <p className="text-gray-400 text-sm">
                AI Powered Resume Screening
              </p>
            </div>
          </div>

          {/* HEADING */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Build A Resume
            <br />
            That Beats
            <span className="text-blue-400">
              {" "}
              ATS Systems
            </span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-gray-300 text-base sm:text-lg leading-8 max-w-2xl mb-10">
            Analyze resume score, improve keywords, optimize
            formatting and increase your chances of getting
            shortlisted using AI-powered ATS analysis.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {/* CARD */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:scale-[1.02] transition duration-300">
              <ShieldCheck
                className="text-green-400 mb-4"
                size={32}
              />

              <h3 className="text-xl font-semibold mb-3">
                ATS Score Check
              </h3>

              <p className="text-gray-400 text-sm leading-6">
                Get detailed ATS score with recruiter-friendly
                optimization tips.
              </p>
            </div>

            {/* CARD */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:scale-[1.02] transition duration-300">
              <Sparkles
                className="text-yellow-400 mb-4"
                size={32}
              />

              <h3 className="text-xl font-semibold mb-3">
                AI Suggestions
              </h3>

              <p className="text-gray-400 text-sm leading-6">
                Improve resume quality using smart AI-generated
                recommendations.
              </p>
            </div>

            {/* CARD */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:scale-[1.02] transition duration-300">
              <BarChart3
                className="text-cyan-400 mb-4"
                size={32}
              />

              <h3 className="text-xl font-semibold mb-3">
                Resume Analytics
              </h3>

              <p className="text-gray-400 text-sm leading-6">
                Track keyword match, readability, and job fit
                performance.
              </p>
            </div>

            {/* CARD */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:scale-[1.02] transition duration-300">
              <CheckCircle2
                className="text-blue-400 mb-4"
                size={32}
              />

              <h3 className="text-xl font-semibold mb-3">
                Instant Results
              </h3>

              <p className="text-gray-400 text-sm leading-6">
                Upload your resume and receive ATS analysis in
                seconds.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE LOGIN */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-10">
          <div className="w-full max-w-md bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            {/* TITLE */}
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Welcome Back
              </h2>

              <p className="text-gray-300 text-sm sm:text-base">
                Login to continue your ATS resume journey
              </p>
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="text-gray-300 text-sm block mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 rounded-2xl p-4 outline-none focus:border-blue-500 transition"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="text-gray-300 text-sm block mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 border border-white/10 text-white placeholder:text-gray-400 rounded-2xl p-4 outline-none focus:border-blue-500 transition"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff size={22} />
                  ) : (
                    <Eye size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT */}
            <div className="flex justify-end mb-7">
              <button className="text-blue-400 text-sm hover:text-blue-300 transition">
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={login}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg"
            >
              Login Now
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-[1px] bg-white/10"></div>

              <span className="text-gray-400 text-sm">
                OR
              </span>

              <div className="flex-1 h-[1px] bg-white/10"></div>
            </div>

            {/* GOOGLE BUTTON */}
            <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-4 rounded-2xl transition">
              Continue with Google
            </button>

            {/* FOOTER */}
            <p className="text-center text-gray-300 text-sm mt-8">
              Don’t have an account?{" "}
              <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                <Link to="/register">Create Account</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}