import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

// Teen answer types support kiye hain
const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "rating", label: "Rating (1-5)" },
  { value: "yes_no", label: "Yes / No" },
];

// Naye question ka default structure
const defaultQuestion = () => ({ text: "", type: "multiple_choice", options: ["", ""] });

// RatingSelector - 1 se 5 tak circle buttons
function RatingSelector({ name, value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="mt-3 flex gap-3 items-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange && onChange(n)}
          className={`w-9 h-9 rounded-full border-2 transition-all duration-150 font-bold text-sm
            ${n <= active
              ? "bg-indigo-600 border-indigo-600 text-white scale-110"
              : "bg-white border-gray-300 text-gray-400"
            }`}
        >
          {n}
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-indigo-600 font-semibold">
          {value} / 5 selected
        </span>
      )}
    </div>
  );
}

export default function CreateSurvey() {
  const navigate = useNavigate();
  const location = useLocation();

  // Template se aaya ho to pre-fill karo
  const templateQuestions = location.state?.templateQuestions;
  const templateName = location.state?.templateName || "";

  const [surveyName, setSurveyName] = useState(templateName);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState(
    templateQuestions ? templateQuestions.map((q) => ({ ...q })) : [defaultQuestion()]
  );
  const [ratingValues, setRatingValues] = useState({});
  const [yesNoValues, setYesNoValues] = useState({});
  const [mcValues, setMcValues] = useState({});

  const addQuestion = () => setQuestions([...questions, defaultQuestion()]);

  const deleteQuestion = (index) =>
    setQuestions(questions.filter((_, i) => i !== index));

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    const opts = [...updated[qIndex].options];
    opts[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: opts };
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex] = {
      ...updated[qIndex],
      options: [...updated[qIndex].options, ""],
    };
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex] = {
      ...updated[qIndex],
      options: updated[qIndex].options.filter((_, i) => i !== oIndex),
    };
    setQuestions(updated);
  };

  const [shareLink, setShareLink] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [savedSurveyTitle, setSavedSurveyTitle] = useState("");

  const handleEmailShare = async () => {
    if (!shareEmail) return alert("Enter an email address");
    setEmailSending(true);
    try {
      await axios.post("http://10.169.7.128:5000/api/surveys/share-email", {
        email: shareEmail,
        surveyLink: shareLink,
        surveyTitle: savedSurveyTitle
      });
      alert(`Survey link sent to ${shareEmail}`);
      setShareEmail("");
    } catch (err) {
      alert("Failed to send email.");
    } finally {
      setEmailSending(false);
    }
  };

  const createSurvey = async () => {
    if (!surveyName) { alert("Survey name required"); return; }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const surveyData = {
      title: surveyName,
      description,
      creator: user._id || user.id,
      isPublic: true,
      status: "active",
      questions: questions.map((q) => ({
        text: q.text,
        type: q.type,
        options: q.options || []
      }))
    };

    try {
      const res = await fetch("http://10.169.7.128:5000/api/surveys/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyData)
      });
      const saved = await res.json();
      const link = `${window.location.origin}/survey/${saved._id}`;
      setShareLink(link);
      setSavedSurveyTitle(surveyName);
    } catch (err) {
      alert("Failed to create survey. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-12">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Your Survey</h1>

        {/* Survey Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Survey Name</label>
          <input
            type="text"
            className="w-full border p-3 rounded"
            value={surveyName}
            onChange={(e) => setSurveyName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            className="w-full border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Questions */}
        <h2 className="text-xl font-semibold mb-4">Survey Questions</h2>
        {questions.map((question, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                className="w-full border p-3 rounded"
                value={question.text}
                onChange={(e) => updateQuestion(index, "text", e.target.value)}
              />
              {questions.length > 1 && (
                <button
                  onClick={() => deleteQuestion(index)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Answer type selector */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Answer Type
              </label>
              <select
                className="border p-2 rounded w-full bg-white"
                value={question.type}
                onChange={(e) => updateQuestion(index, "type", e.target.value)}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Answer options - type ke hisaab se selectable */}
            {question.type === "rating" && (
              <RatingSelector
                name={`rating-${index}`}
                value={ratingValues[index] || 0}
                onChange={(n) => setRatingValues({ ...ratingValues, [index]: n })}
              />
            )}

            {question.type === "yes_no" && (
              <div className="mt-3 flex gap-3">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setYesNoValues({ ...yesNoValues, [index]: opt })}
                    className={`w-16 h-16 rounded-full border-2 font-semibold transition-all duration-150
                      ${yesNoValues[index] === opt
                        ? "bg-indigo-600 border-indigo-600 text-white scale-110"
                        : "bg-white border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-500"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {question.type === "multiple_choice" && (
              <div className="mt-3 space-y-2">
                {question.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const current = mcValues[index] || [];
                        const already = current.includes(oIndex);
                        setMcValues({
                          ...mcValues,
                          [index]: already ? current.filter((i) => i !== oIndex) : [...current, oIndex],
                        });
                      }}
                      className={`w-9 h-9 rounded-full border-2 font-bold text-sm flex-shrink-0 transition-all duration-150
                        ${(mcValues[index] || []).includes(oIndex)
                          ? "bg-indigo-600 border-indigo-600 text-white scale-110"
                          : "bg-white border-gray-300 text-gray-400 hover:border-indigo-400"
                        }`}
                    >
                      {oIndex + 1}
                    </button>
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      className="border-b p-1 flex-1 outline-none text-gray-800"
                      value={opt}
                      onChange={(e) => updateOption(index, oIndex, e.target.value)}
                    />
                    {question.options.length > 2 && (
                      <button
                        onClick={() => removeOption(index, oIndex)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addOption(index)}
                  className="text-blue-600 text-sm mt-1 hover:underline"
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-green-600 text-white px-5 py-2 rounded mt-4 hover:bg-green-700"
        >
          + Add Question
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={createSurvey}
            className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700"
          >
            Submit Survey
          </button>
        </div>

        {/* Share link - survey create hone ke baad dikhega */}
        {shareLink && (
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-700 font-semibold mb-3">✅ Survey Created! Share this link:</p>
            <div className="flex items-center gap-2 mb-3">
              <input readOnly value={shareLink}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white" />
              <button
                onClick={() => { navigator.clipboard.writeText(shareLink); alert("Link copied!"); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>

            {/* QR Code button */}
            <button
              onClick={() => setShowQR(!showQR)}
              className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-900 transition mb-3"
            >
              {showQR ? "Hide QR Code" : "📷 Click to Generate QR"}
            </button>

            {showQR && (
              <div className="flex flex-col items-center mt-3">
                <div className="bg-white p-4 rounded-xl shadow-md inline-block" id="qr-canvas">
                  <QRCodeCanvas value={shareLink} size={180} id="survey-qr" />
                </div>
                <p className="text-xs text-gray-400 mt-2">Scan to open survey</p>
                <button
                  onClick={() => {
                    const canvas = document.getElementById("survey-qr");
                    const url = canvas.toDataURL("image/png");
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "survey-qr.png";
                    a.click();
                  }}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                >
                  ⬇ Download QR
                </button>
              </div>
            )}

            <div>
              <button onClick={() => navigate("/dashboard")}
                className="mt-3 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
                Go to Dashboard →
              </button>
            </div>

            {/* Email share */}
            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">📧 Share via Email</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter recipient email"
                  value={shareEmail}
                  onChange={e => setShareEmail(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={handleEmailShare}
                  disabled={emailSending}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  {emailSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
