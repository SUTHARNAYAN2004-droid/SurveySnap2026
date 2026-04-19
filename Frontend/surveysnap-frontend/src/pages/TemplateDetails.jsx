// TemplateDetails.jsx - Template ka preview aur use karne ka page
import { useParams, useNavigate } from "react-router-dom";
import { TEMPLATES } from "../data/templates";

const TYPE_LABEL = {
  rating: "Rating (1-5)",
  yes_no: "Yes / No",
  multiple_choice: "Multiple Choice",
  text: "Short Text",
};

export default function TemplateDetails() {
  const { name } = useParams();
  const navigate = useNavigate();

  const template = TEMPLATES.find((t) => t.id === name);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Template Not Found</h2>
          <p className="text-gray-500 mb-4">This template does not exist.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const useTemplate = () => {
    navigate("/CreateSurvey", {
      state: { templateQuestions: template.questions, templateName: template.name },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-8">

        <div className="mb-6">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Template Preview</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">{template.name}</h1>
          <p className="text-gray-500 mt-2">{template.description}</p>
        </div>

        <hr className="mb-6" />

        <div className="space-y-4 mb-8">
          {template.questions.map((q, i) => (
            <div key={i} className="bg-gray-50 border rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Question {i + 1}</p>
              <p className="text-gray-800 font-semibold">{q.text}</p>
              <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                {TYPE_LABEL[q.type] || q.type}
              </span>
              {q.type === "multiple_choice" && q.options.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {q.options.map((opt, oi) => (
                    <li key={oi} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={useTemplate}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
          >
            Use This Template
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
