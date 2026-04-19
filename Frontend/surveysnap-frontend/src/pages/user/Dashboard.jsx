// ============================================================
// Dashboard.jsx - User ka main page
// - Backend se logged-in user ke surveys fetch karta hai
// - Har survey ka title, status, question count dikhata hai
// - Analytics button se SurveyAnalytics page pe jaata hai
// - Delete Survey - backend se survey delete karta hai
// - Delete Account - user apna account khud delete kar sakta hai
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  // localStorage se logged-in user ka data lo
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id || user.id;

  // Backend se is user ke saare surveys fetch karo
  const fetchSurveys = () => {
    if (!userId) return;
    axios.get(`http://localhost:5000/api/surveys/creator/${userId}`)
      .then(res => setSurveys(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSurveys(); }, []);

  // Survey delete karo - confirm ke baad backend API call
  const deleteSurvey = async (id) => {
    if (!window.confirm("Delete this survey?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/surveys/${id}`);
      setSurveys(surveys.filter(s => s._id !== id)); // UI se bhi hata do
    } catch (err) {
      alert("Failed to delete survey.");
    }
  };

  // User apna account delete kare - localStorage clear + signup pe redirect
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      localStorage.clear();
      navigate("/signup");
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">My Surveys</h1>
          {/* Delete Account button - red style */}
          <button onClick={handleDeleteAccount}
            className="bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition">
            Delete Account
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <p className="text-gray-400 text-center py-10">Loading surveys...</p>
        ) : surveys.length === 0 ? (
          // Koi survey nahi - create karne ka button dikhao
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No surveys yet.</p>
            <button onClick={() => navigate("/CreateSurvey")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700">
              + Create Survey
            </button>
          </div>
        ) : (
          // Survey cards grid - 3 columns on large screens
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {surveys.map((survey) => (
              <div key={survey._id} className="bg-white shadow-sm p-6 rounded-2xl border flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{survey.title}</h2>
                    {/* Status badge - green for active, red for closed */}
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${survey.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {survey.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{survey.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{survey.questions?.length || 0} questions</p>
                </div>
                <div className="mt-6 flex gap-2">
                  {/* Analytics button - SurveyAnalytics page pe jaata hai */}
                  <button
                    onClick={() => navigate(`/analytics`)}
                    className="flex-1 py-2 text-sm font-bold bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-600 hover:text-white transition">
                    Analytics
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => deleteSurvey(survey._id)}
                    className="flex-1 py-2 text-sm font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
