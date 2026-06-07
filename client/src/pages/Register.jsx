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
  KeyRound,
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!name || !email || !password) {
      return alert("Please fill all fields");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/send-otp", { name, email, password });
      if (res.data.devOtp) {
        setDevOtpHint(res.data.devOtp);
      }
      setStep(2);
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      return alert("Please enter the 6-digit OTP");
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp });
      login(res.data.token, res.data.user);
      alert("Email verified! Welcome aboard.");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">
      <div className="absolute top-[-200px] left-[-100px] w-[450px] h-[450px] bg-blue-600/20 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[450px] h-[450px] bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-2xl">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Resume ATS Analyzer</h2>
              <p className="text-gray-400 text-sm">Secure OTP Email Verification</p>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Create Your
            <span className="text-blue-400"> Verified </span>
            Account
          </h1>

          <p className="text-gray-300 text-lg leading-8 max-w-2xl mb-10">
            Register with OTP email verification for a secure account. Then
            analyze resumes, fix mistakes, and improve your ATS score.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-400" : "text-gray-500"}`}>
              <span className="w-8 h-8 rounded-full border flex items-center justify-center">1</span>
              Your Details
            </div>
            <div className="w-8 h-px bg-white/20" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-400" : "text-gray-500"}`}>
              <span className="w-8 h-8 rounded-full border flex items-center justify-center">2</span>
              Verify OTP
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-2xl">
            {step === 1 ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-gray-300">We will send a verification code to your email</p>
                </div>

                {[
                  { label: "Full Name", icon: User, type: "text", value: name, set: setName, placeholder: "Enter your name" },
                  { label: "Email Address", icon: Mail, type: "email", value: email, set: setEmail, placeholder: "Enter your email" },
                ].map((field) => (
                  <div className="mb-4" key={field.label}>
                    <label className="text-gray-300 text-sm mb-2 block">{field.label}</label>
                    <div className="relative">
                      <field.icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full pl-12 p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}

                {[
                  { label: "Password", value: password, set: setPassword, show: showPassword, toggle: () => setShowPassword(!showPassword) },
                  { label: "Confirm Password", value: confirmPassword, set: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword) },
                ].map((field) => (
                  <div className="mb-4" key={field.label}>
                    <label className="text-gray-300 text-sm mb-2 block">{field.label}</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={field.show ? "text" : "password"}
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        className="w-full pl-12 pr-12 p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500"
                      />
                      <button type="button" onClick={field.toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {field.show ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-2xl text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </button>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Verify Email</h2>
                  <p className="text-gray-300">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                  {devOtpHint && (
                    <p className="mt-3 text-yellow-300 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                      Dev mode OTP: <strong>{devOtpHint}</strong>
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="text-gray-300 text-sm mb-2 block">Verification Code</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-12 p-4 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-blue-500 tracking-[0.5em] text-center text-xl"
                    />
                  </div>
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-2xl text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-4 border border-white/10 text-white py-4 rounded-2xl hover:bg-white/5 transition"
                >
                  Back to Details
                </button>
              </>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full mt-4 border border-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition"
            >
              <ArrowLeft size={18} />
              Back To Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
