// ViewSurvey.jsx - Survey ka detailed view with real data from localStorage
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TYPE_LABEL = {
  rating: "Rating (1-5)",
  yes_no: "Yes / No",
  multiple_choice: "Multiple Choice",
  text: "Short Text",
};

export default function ViewSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const surveys = JSON.parse(localStorage.getItem("surveys")) || [];
    const found = surveys.find((s) => String(s.id) === String(id));
    setSurvey(found || null);
  }, [id]);

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-500 text-lg">Survey not found.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
          <div className="h-2 w-16 bg-indigo-600 rounded-full mb-5"></div>
          <h1 className="text-3xl font-extrabold text-gray-900">{survey.surveyName}</h1>
          {survey.description && (
            <p className="text-gray-500 mt-2">{survey.description}</p>
          )}
          <p className="text-sm text-indigo-500 font-medium mt-3">
            {survey.questions?.length} Questions
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {survey.questions?.map((q, idx) => {
            const qText = typeof q === "string" ? q : q.text || "Untitled";
            const qType = typeof q === "object" ? q.type : "text";
            const qOptions = typeof q === "object" ? q.options : [];

            return (
              <div key={idx} className="bg-white rounded-2xl border shadow-sm p-6">
                <p className="text-xs font-bold text-indigo-400 uppercase mb-1">
                  Question {idx + 1}
                </p>
                <p className="text-gray-800 font-semibold text-lg mb-3">{qText}</p>
                <span className="inline-block text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium mb-3">
                  {TYPE_LABEL[qType] || qType}
                </span>

                {/* Show options for MCQ */}
                {qType === "multiple_choice" && qOptions.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {qOptions.map((opt, oi) => (
                      <li key={oi} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Show rating preview */}
                {qType === "rating" && (
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-sm text-gray-400 font-bold">
                        {n}
                      </div>
                    ))}
                  </div>
                )}

                {/* Show yes/no preview */}
                {qType === "yes_no" && (
                  <div className="flex gap-3 mt-2">
                    {["Yes", "No"].map((opt) => (
                      <span key={opt} className="border-2 border-gray-200 text-gray-400 px-5 py-1 rounded-full text-sm font-semibold">
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
