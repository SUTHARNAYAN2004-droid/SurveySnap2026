// Home.jsx - Landing page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEMPLATES } from "../data/templates";
import Logo from "../Component/Common/Logo";

const FEATURES = [
  {
    icon: "🛠️",
    title: "Easy Survey Builder",
    desc: "Create surveys in minutes with our drag-and-drop style builder. No coding needed.",
  },
  {
    icon: "📨",
    title: "Collect Responses",
    desc: "Share via link, email or social media and watch responses come in real-time.",
  },
  {
    icon: "📊",
    title: "Real-time Analytics",
    desc: "Visualize results instantly with beautiful charts and detailed reports.",
  },
];

const STATS = [
  { value: "10K+", label: "Surveys Created" },
  { value: "500K+", label: "Responses Collected" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "150+", label: "Countries Reached" },
];

export default function Home() {
  const navigate = useNavigate();
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleTemplateClick = (templateId) => {
    navigate(`/template/${templateId}`);
  };

  return (
    <div className="bg-white font-sans">

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center shadow-sm">
        <Logo size={36} />
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold px-5 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 pt-20">
        {/* decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative text-center text-white px-6 max-w-4xl mx-auto animate-fadeInUp">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
            🚀 The smartest way to collect feedback
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Build Surveys <br />
            <span className="text-yellow-300">That Get Results</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Create beautiful surveys, share them instantly, and get actionable insights — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <button
              onClick={() => navigate("/login")}
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-indigo-600 transition-all text-lg"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-indigo-600 py-14 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {STATS.map((s, i) => (
            <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className="text-4xl font-extrabold">{s.value}</p>
              <p className="text-indigo-200 mt-1 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-indigo-500 font-semibold uppercase tracking-widest text-sm mb-3">Why SurveySnap</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-16">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 animate-fadeInUp"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="text-5xl mb-5">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-500 font-semibold uppercase tracking-widest text-sm mb-3">Simple Process</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Create", desc: "Pick a template or build from scratch using our easy builder." },
              { step: "02", title: "Share", desc: "Send your survey link via email, WhatsApp or social media." },
              { step: "03", title: "Analyze", desc: "View responses and insights on your dashboard in real-time." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center animate-fadeInUp" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-extrabold mb-5 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-indigo-500 font-semibold uppercase tracking-widest text-sm mb-3">Ready to use</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
            Start With a Template
          </h2>
          <p className="text-center text-gray-500 mb-14 text-lg max-w-xl mx-auto">
            Choose from our ready-made templates and launch your survey in seconds.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {TEMPLATES.map((template, i) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 animate-fadeInUp"
                style={{ animationDelay: `${(i % 4) * 0.1}s` }}
              >
                <div className="relative overflow-hidden h-44">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 bg-white/90 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
                    {template.questions.length} Questions
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">{template.name}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{template.description}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => navigate("/login", { state: { from: "/CreateSurvey", templateQuestions: template.questions, templateName: template.name } })}
                      className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors"
                    >
                      Try Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="relative max-w-2xl mx-auto animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5">Ready to Get Started?</h2>
          <p className="text-white/80 text-lg mb-10">
            Join thousands of users already using SurveySnap to collect insights.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl hover:bg-yellow-300 hover:text-indigo-800 transition-all shadow-xl text-lg"
          >
            Create Your First Survey →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo size={32} />
          <p className="text-sm">© 2026 SurveySnap. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <button onClick={() => navigate("/login")} className="hover:text-white transition-colors">Login</button>
            <button onClick={() => navigate("/signup")} className="hover:text-white transition-colors">Sign Up</button>
            <button onClick={() => navigate("/contact")} className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>

      {/* ── PREVIEW MODAL ── */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Template Preview</span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1">{previewTemplate.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none ml-4"
              >
                ✕
              </button>
            </div>

            {/* Questions */}
            <div className="px-6 py-4 space-y-3">
              {previewTemplate.questions.map((q, i) => (
                <div key={i} className="bg-gray-50 border rounded-xl p-4">
                  <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Question {i + 1}</p>
                  <p className="text-gray-800 font-semibold">{q.text}</p>
                  <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                    {{ rating: "Rating (1-5)", yes_no: "Yes / No", multiple_choice: "Multiple Choice", text: "Short Text" }[q.type] || q.type}
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

            {/* Modal footer */}
            <div className="px-6 pb-6 pt-2 flex gap-3">
              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  navigate("/login", { state: { from: "/CreateSurvey", templateQuestions: previewTemplate.questions, templateName: previewTemplate.name } });
                }}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
              >
                Try This Template
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
