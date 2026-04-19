// ============================================================
// SurveyAnalytics.jsx - Survey ke responses ka visual analysis
// - Creator ke surveys backend se fetch karta hai
// - Selected survey ka analytics (per question answer counts) fetch karta hai
// - Bar chart + Pie chart dono dikhata hai
// - Progress bar - kitne % respondents ne har question answer kiya
// - Recharts library use ki hai charts ke liye
// ============================================================

import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

// Chart colors - har answer option ka alag color
const COLORS = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];

export default function SurveyAnalytics() {
  const [surveys, setSurveys] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Step 1: Creator ke saare surveys fetch karo
  useEffect(() => {
    const userId = user._id || user.id;
    if (!userId) return;
    axios.get(`http://localhost:5000/api/surveys/creator/${userId}`)
      .then(res => {
        setSurveys(res.data);
        if (res.data.length > 0) setSelectedId(res.data[0]._id); // Pehla survey default select
      })
      .catch(err => console.error(err));
  }, []);

  // Step 2: Jab bhi survey change ho, uska analytics fetch karo
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    // Backend se analytics aata hai - har question ke liye answer counts
    axios.get(`http://localhost:5000/api/surveys/${selectedId}/analytics`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Survey Analytics</h1>
          <p className="text-gray-500 mt-1">Real-time response breakdown for your surveys.</p>
        </div>

        {/* Koi survey nahi */}
        {surveys.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
            <p className="text-4xl mb-4">📊</p>
            <p className="text-gray-500 text-lg">No surveys found. Create a survey first.</p>
          </div>
        ) : (
          <>
            {/* Survey dropdown selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Select Survey</label>
              <select
                className="border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {surveys.map((s) => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
            </div>

            {loading ? <p className="text-gray-400">Loading analytics...</p> : analytics && (
              <>
                {/* Stats cards - total responses, questions, survey name */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  {[
                    { label: "Total Responses", value: analytics.totalResponses, icon: "📨" },
                    { label: "Total Questions", value: analytics.analytics?.length || 0, icon: "❓" },
                    { label: "Survey", value: analytics.survey?.title || "-", icon: "📋" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border text-center">
                      <p className="text-3xl mb-2">{stat.icon}</p>
                      <p className="text-2xl font-extrabold text-indigo-600">{stat.value}</p>
                      <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bars - har question ka completion rate */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
                  <p className="text-sm font-semibold text-gray-600 mb-3">Response Completion Rate</p>
                  {analytics.analytics?.map((q, i) => {
                    // Percentage calculate karo - kitne respondents ne ye question answer kiya
                    const pct = analytics.totalResponses > 0
                      ? Math.round((q.totalAnswers / analytics.totalResponses) * 100) : 0;
                    return (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Q{i + 1}: {q.questionText}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Koi response nahi abhi tak */}
                {analytics.totalResponses === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                    <p className="text-4xl mb-4">🕐</p>
                    <p className="text-gray-500 text-lg">No responses yet for this survey.</p>
                  </div>
                ) : (
                  // Har question ke liye bar + pie chart
                  <div className="space-y-8">
                    {analytics.analytics?.map((q, idx) => (
                      q.data.length === 0 ? null : (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border">
                          <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Question {idx + 1}</p>
                          <p className="font-semibold text-gray-800 mb-6">{q.questionText}</p>
                          <div className="flex flex-col lg:flex-row gap-8 items-center">

                            {/* Bar Chart - sab question types ke liye */}
                            <div className="w-full lg:w-1/2 h-56">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={q.data} barSize={40}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                  <Tooltip />
                                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {q.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Pie Chart - sirf choice-based questions ke liye */}
                            {(q.questionType === "multiple_choice" || q.questionType === "yes_no" || q.questionType === "rating") && (
                              <div className="w-full lg:w-1/2 h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie data={q.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                      {q.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip /><Legend />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
