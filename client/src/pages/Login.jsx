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
} from "lucide-react";
import API from "../services/api";

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
    <div className="min-h-screen bg-[#06142E] flex items-center justify-center px-6 py-10 overflow-hidden">
      {/* Background Blur */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-blue-500 opacity-20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-cyan-400 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT SIDE */}
        <div className="text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <FileText size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Resume ATS Analyzer
              </h1>

              <p className="text-gray-300 text-sm">
                AI Powered Resume Screening
              </p>
            </div>
          </div>

          <h2 className="text-5xl font-bold leading-tight mb-6">
            Improve Your Resume &
            <span className="text-blue-400">
              {" "}
              Crack ATS Filters
            </span>
          </h2>

          <p className="text-gray-300 text-lg leading-8 max-w-xl mb-10">
            Upload your resume, analyze ATS score, detect missing
            keywords, and optimize your CV according to job
            descriptions using AI.
          </p>

          {/* FEATURES */}
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            <div className="bg-white/10 border border-white/10 backdrop-blur-lg p-5 rounded-2xl">
              <ShieldCheck className="text-green-400 mb-3" size={28} />
              <h3 className="font-semibold text-lg mb-2">
                ATS Score Check
              </h3>

              <p className="text-gray-300 text-sm">
                Get instant ATS compatibility score for your resume.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-lg p-5 rounded-2xl">
              <Sparkles className="text-yellow-400 mb-3" size={28} />
              <h3 className="font-semibold text-lg mb-2">
                AI Suggestions
              </h3>

              <p className="text-gray-300 text-sm">
                Improve resume quality with smart recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE LOGIN */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </h2>

            <p className="text-gray-300 mb-8">
              Login to continue your ATS journey
            </p>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="text-gray-300 text-sm mb-2 block">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/10 text-white p-4 rounded-xl outline-none focus:border-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="text-gray-300 text-sm mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 border border-white/10 text-white p-4 rounded-xl outline-none focus:border-blue-500"
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
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT */}
            <div className="flex justify-end mb-6">
              <button className="text-blue-400 text-sm hover:text-blue-300">
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={login}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-[1.02] transition-all duration-300 text-white font-semibold py-4 rounded-xl shadow-lg"
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

            {/* GOOGLE LOGIN */}
            <button className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-100 transition">
              Continue with Google
            </button>

            {/* SIGNUP */}
            <p className="text-center text-gray-300 text-sm mt-6">
              Don’t have an account?{" "}
              <span className="text-blue-400 cursor-pointer hover:text-blue-300">
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}