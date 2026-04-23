// SurveyAnalytics.jsx - Survey ke responses ka visual analysis
// Recharts removed - React 19 compatibility issue tha
// Simple HTML/CSS bars use kiye hain

import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const COLORS = ["#4F46E5", "#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

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
    axios.get(`${BASE_URL}/api/surveys/creator/${userId}`)
      .then(res => {
        setSurveys(res.data);
        if (res.data.length > 0) setSelectedId(res.data[0]._id);
      })
      .catch(err => console.error(err));
  }, []);

  // Step 2: Jab bhi survey change ho, uska analytics fetch karo
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    axios.get(`${BASE_URL}/api/surveys/${selectedId}/analytics`)
      .then(res => setAnalytics(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

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
            {/* Survey dropdown */}
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

            {loading ? (
              <p className="text-gray-400">Loading analytics...</p>
            ) : analytics && (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
                    <p className="text-3xl mb-2">📨</p>
                    <p className="text-2xl font-extrabold text-indigo-600">{analytics.totalResponses}</p>
                    <p className="text-gray-500 text-sm mt-1">Total Responses</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
                    <p className="text-3xl mb-2">❓</p>
                    <p className="text-2xl font-extrabold text-indigo-600">{analytics.analytics?.length || 0}</p>
                    <p className="text-gray-500 text-sm mt-1">Total Questions</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
                    <p className="text-3xl mb-2">📋</p>
                    <p className="text-lg font-extrabold text-indigo-600 truncate">{analytics.survey?.title || "-"}</p>
                    <p className="text-gray-500 text-sm mt-1">Survey</p>
                  </div>
                </div>

                {/* Response completion rate */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
                  <p className="text-sm font-semibold text-gray-600 mb-4">Response Completion Rate</p>
                  {analytics.analytics?.map((q, i) => {
                    const pct = analytics.totalResponses > 0
                      ? Math.round((q.totalAnswers / analytics.totalResponses) * 100) : 0;
                    return (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Q{i + 1}: {q.questionText}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* No responses yet */}
                {analytics.totalResponses === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                    <p className="text-4xl mb-4">🕐</p>
                    <p className="text-gray-500 text-lg">No responses yet for this survey.</p>
                  </div>
                ) : (
                  // Per question breakdown
                  <div className="space-y-6">
                    {analytics.analytics?.map((q, idx) => (
                      q.data && q.data.length > 0 ? (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border">
                          <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Question {idx + 1}</p>
                          <p className="font-semibold text-gray-800 mb-5">{q.questionText}</p>

                          {/* Simple bar chart using HTML/CSS */}
                          <div className="space-y-3">
                            {q.data.map((item, i) => {
                              const maxVal = Math.max(...q.data.map(d => d.value));
                              const barWidth = maxVal > 0 ? Math.round((item.value / maxVal) * 100) : 0;
                              const total = q.data.reduce((sum, d) => sum + d.value, 0);
                              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                              return (
                                <div key={i}>
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-400">{item.value} responses ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-8 flex items-center">
                                    <div
                                      className="h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                                      style={{
                                        width: `${Math.max(barWidth, 5)}%`,
                                        backgroundColor: COLORS[i % COLORS.length],
                                        minWidth: "40px"
                                      }}
                                    >
                                      <span className="text-white text-xs font-bold">{pct}%</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Total for this question */}
                          <p className="text-xs text-gray-400 mt-4">
                            Total answers: {q.data.reduce((sum, d) => sum + d.value, 0)}
                          </p>
                        </div>
                      ) : null
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
