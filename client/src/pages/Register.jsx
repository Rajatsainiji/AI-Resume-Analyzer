// import { useState } from "react";
// import API from "../services/api";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const register = async () => {
//     try {
//       await API.post("/auth/register", {
//         name,
//         email,
//         password,
//       });

//       window.location.href = "/";
//     } catch (error) {
//       alert("Register Failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="border p-10 rounded w-[400px]">
//         <h1 className="text-3xl font-bold mb-5">
//           Register
//         </h1>

//         <input
//           type="text"
//           placeholder="Name"
//           className="border p-3 w-full mb-4"
//           onChange={(e) => setName(e.target.value)}
//         />

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
//           onClick={register}
//           className="bg-black text-white w-full p-3"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import {
  FileText,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (!name || !email || !password) {
      return alert("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Account Created Successfully");

      window.location.href = "/";
    } catch (error) {
      alert("Register Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-200px] left-[-100px] w-[450px] h-[450px] bg-blue-600/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-200px] right-[-100px] w-[450px] h-[450px] bg-cyan-500/20 blur-[140px] rounded-full"></div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-2xl">
              <FileText size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Resume ATS Analyzer
              </h2>

              <p className="text-gray-400 text-sm">
                AI Powered Resume Screening
              </p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Create Your
            <span className="text-blue-400">
              {" "}
              ATS Optimized
            </span>
            <br />
            Career Journey
          </h1>

          <p className="text-gray-300 text-lg leading-8 max-w-2xl mb-10">
            Join thousands of job seekers using AI to
            improve resumes, increase ATS scores and land
            more interviews.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
              <Sparkles
                className="text-yellow-400 mb-3"
                size={30}
              />

              <h3 className="font-semibold text-lg mb-2">
                AI Resume Analysis
              </h3>

              <p className="text-gray-400 text-sm">
                Get instant AI feedback and optimization
                tips.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
              <CheckCircle2
                className="text-green-400 mb-3"
                size={30}
              />

              <h3 className="font-semibold text-lg mb-2">
                ATS Optimization
              </h3>

              <p className="text-gray-400 text-sm">
                Improve ATS score and keyword matching.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Create Account
              </h2>

              <p className="text-gray-300">
                Start analyzing resumes with AI
              </p>
            </div>

            {/* NAME */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full pl-12 p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-12 p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Create password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-12 pr-12 p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-6">
              <label className="text-gray-300 text-sm mb-2 block">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="w-full pl-12 pr-12 p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* REGISTER BUTTON */}
            <button
              onClick={register}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-2xl text-white font-semibold hover:opacity-90 transition"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            {/* LOGIN LINK */}
            <button
              onClick={() =>
                (window.location.href = "/")
              }
              className="w-full mt-4 border border-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition"
            >
              <ArrowLeft size={18} />
              Back To Login
            </button>

            <p className="text-center text-gray-400 text-sm mt-8">
              Already have an account?
              <span
                className="text-blue-400 ml-2 cursor-pointer"
                onClick={() =>
                  (window.location.href = "/")
                }
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}