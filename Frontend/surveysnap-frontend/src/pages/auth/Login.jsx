import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Login page - show/hide password added, login ke baad /CreateSurvey pe redirect
export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const templateState = location.state?.templateQuestions
    ? { templateQuestions: location.state.templateQuestions, templateName: location.state.templateName }
    : null;

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", data);
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));

      // Role check - admin ho toh admin dashboard, warna user side
      if (user.role === "admin") {
        localStorage.setItem("adminToken", "true");
        navigate("/admin");
      } else {
        navigate("/CreateSurvey", { state: templateState });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Password check karein!");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative panel (sirf medium+ screens pe dikhta hai) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-10">
        <div className="text-center text-white">
          <img src="https://cdn-icons-png.flaticon.com/512/942/942748.png" alt="survey" className="w-40 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">SurveySnap</h1>
          <p className="text-lg max-w-sm">Build powerful surveys and collect responses easily with real-time analytics.</p>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-xl p-10 rounded-xl w-96 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

          {/* Email field */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Validation error message */}
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="border border-gray-300 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-3 rounded-lg font-semibold">
            Login
          </button>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <Link to="/signup" className="text-blue-600 ml-1 font-semibold hover:underline">Signup</Link>
            </p>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
