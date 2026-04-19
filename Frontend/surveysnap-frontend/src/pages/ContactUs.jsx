// ============================================================
// ContactUs.jsx - Contact form page
// - User apna naam, email aur message bhej sakta hai
// - Backend /api/contact pe POST request jaati hai
// - Admin ko email milti hai user ke message ke saath
// - User ko confirmation message dikhta hai
// ============================================================

import { useState } from "react";
import axios from "axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://10.169.7.128:5000/api/contact", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Contact Us</h1>
          <p className="text-gray-500 mt-2 text-sm">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        {/* Success message */}
        {success ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h2>
            <p className="text-gray-500 text-sm">We'll get back to you soon.</p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 text-indigo-600 text-sm hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=""
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=""
                  rows={5}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* Contact info */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-400 space-y-1">
              <p> </p>
              <p></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
