// Templates.jsx - Saare available templates ki list
import { useNavigate } from "react-router-dom";
import { TEMPLATES } from "../data/templates";

export default function Templates() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Survey Templates</h1>
          <p className="text-gray-500 mt-2">Choose a template to get started quickly.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">{template.name}</h2>
                <p className="text-gray-500 text-sm mt-2">{template.description}</p>
                <p className="text-indigo-500 text-sm mt-3 font-medium">
                  {template.questions.length} Questions
                </p>
              </div>
              <button
                onClick={() => navigate(`/template/${template.id}`)}
                className="mt-6 bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700"
              >
                Preview Template
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
