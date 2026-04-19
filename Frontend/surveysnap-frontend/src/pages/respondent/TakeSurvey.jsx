// TakeSurvey.jsx - Public survey page
// URL: /survey/:id - koi bhi bina login ke access kar sakta hai
// Survey load hota hai backend se, response submit hota hai backend mein save
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TakeSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get(`http://10.169.7.128:5000/api/surveys/${id}`)
      .then(res => { setSurvey(res.data); setLoading(false); })
      .catch(() => { setError("Survey not found."); setLoading(false); });
  }, [id]);

  const handleAnswer = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedAnswers = Object.entries(answers).map(([questionIndex, answer]) => ({
      questionIndex: Number(questionIndex),
      answer: String(answer)
    }));
    try {
      await axios.post("http://10.169.7.128:5000/api/surveys/response", {
        surveyId: id,
        respondentEmail: email,
        answers: formattedAnswers
      });
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit. Try again.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading survey...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
        <p className="text-gray-500">Your response has been submitted successfully.</p>
      </div>
    </div>
  );

  const totalQ = survey?.questions?.length || 0;
  const answered = Object.keys(answers).length;
  const progress = totalQ > 0 ? Math.round((answered / totalQ) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
          {survey.description && <p className="text-gray-500 mt-2">{survey.description}</p>}

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{answered} of {totalQ} answered</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {survey.questions?.map((q, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
              <p className="text-xs font-semibold text-indigo-500 uppercase mb-1">Question {index + 1}</p>
              <p className="text-lg font-semibold text-gray-800 mb-4">{q.text}</p>

              {/* Multiple Choice */}
              {q.type === "multiple_choice" && q.options?.map((opt, i) => (
                <label key={i} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input type="radio" name={`q${index}`} value={opt}
                    onChange={() => handleAnswer(index, opt)}
                    className="accent-indigo-600" />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}

              {/* Yes / No */}
              {q.type === "yes_no" && ["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input type="radio" name={`q${index}`} value={opt}
                    onChange={() => handleAnswer(index, opt)}
                    className="accent-indigo-600" />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}

              {/* Rating */}
              {q.type === "rating" && (
                <div className="flex gap-3 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button"
                      onClick={() => handleAnswer(index, n)}
                      className={`w-10 h-10 rounded-full border-2 font-bold text-sm transition-all ${
                        answers[index] >= n
                          ? "bg-indigo-600 border-indigo-600 text-white scale-110"
                          : "border-gray-300 text-gray-400"
                      }`}>
                      {n}
                    </button>
                  ))}
                </div>
              )}

              {/* Text */}
              {q.type === "text" && (
                <textarea rows={3} placeholder="Your answer..."
                  onChange={(e) => handleAnswer(index, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              )}
            </div>
          ))}

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Your Email <span className="text-gray-400">(optional — for confirmation)</span>
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>

          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
            Submit Response
          </button>
        </form>
      </div>
    </div>
  );
}
