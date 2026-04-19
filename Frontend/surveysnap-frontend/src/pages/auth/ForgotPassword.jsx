// ForgotPassword.jsx - 3 step password reset
// Step 1: Email daalo → OTP email pe aata hai
// Step 2: OTP verify karo
// Step 3: Naya password set karo

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");

  // Step 1: Email submit - OTP bhejo
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      if (res.data.otp) setDemoOtp(res.data.otp);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Email not found");
    } finally { setLoading(false); }
  };

  // Step 2: OTP verify
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally { setLoading(false); }
  };

  // Step 3: Naya password set karo
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true); setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", { email, otp, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">SurveySnap</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {step === 1 && "Enter your email to reset password"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Set your new password"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
              {s}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {/* Step 1 - Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-lg transition">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2 - OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* Demo OTP popup */}
            {demoOtp && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-yellow-600 font-medium mb-1">🔐 Demo Mode — Your OTP</p>
                <p className="text-2xl font-bold tracking-widest text-yellow-700">{demoOtp}</p>
                <p className="text-xs text-yellow-500 mt-1">Copy this and paste below</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required
                placeholder="6-digit OTP" maxLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition tracking-widest text-center text-lg" />
              <p className="text-xs text-gray-400 mt-1">OTP sent to {email} — valid for 10 minutes</p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-lg transition">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-400 hover:underline">
              Back
            </button>
          </form>
        )}

        {/* Step 3 - New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} required placeholder="New password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm password"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-red-400 focus:ring-red-300"
                    : confirmPassword && confirmPassword === newPassword
                    ? "border-green-400 focus:ring-green-300"
                    : "border-gray-300 focus:ring-indigo-400"
                }`} />
              {/* Real-time match indicator */}
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-500 text-xs mt-1">❌ Passwords do not match</p>
              )}
              {confirmPassword && confirmPassword === newPassword && (
                <p className="text-green-500 text-xs mt-1">✅ Passwords match</p>
              )}
            </div>
            <button type="submit" disabled={loading || confirmPassword !== newPassword}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-lg transition">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
