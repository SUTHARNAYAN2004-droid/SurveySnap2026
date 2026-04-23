// FillSurvey.jsx - Public survey fill karne ka page
// URL se survey ID leke backend se questions fetch karta hai
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../config";

export default function FillSurvey() {
  // URL se survey ID lo (e.g. /fill-survey/abc123)
  const { id } = useParams();

  const [survey, setSurvey] = useState({});
  const [answers, setAnswers] = useState([]); // Har question ka answer index-wise store hoga

  // Component mount hone par survey data fetch karo
  useEffect(() => {
    axios.get(`${BASE_URL}/api/survey/` + id)
      .then((res) => setSurvey(res.data))
      .catch((err) => console.error("Survey fetch error:", err));
  }, []);

  // Survey submit karo - saare answers backend pe bhejo
  const submit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/response/submit`, {
        surveyId: id,
        answers,
      });
      alert("Response Submitted");
    } catch (err) {
      alert("Submit karne mein error aaya!");
    }
  };

  return (
    <div>
      <h1>{survey.title}</h1>

      {/* Har question ke liye answer input - type ke hisaab se */}
      {survey.questions?.map((q, i) => {
        const qText = typeof q === "object" ? q.text : q;
        const qType = typeof q === "object" ? q.type : "text";
        const qOptions = typeof q === "object" ? q.options : [];

        const handleChange = (value) => {
          const a = [...answers];
          a[i] = value;
          setAnswers(a);
        };

        return (
          <div key={i} className="mb-4">
            <p className="font-medium mb-2">{qText}</p>
            {qType === "text" && (
              <input
                className="w-full border p-2 rounded"
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
            {qType === "rating" && (
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className="flex flex-col items-center gap-1">
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={n}
                      onChange={() => handleChange(String(n))}
                    />
                    {n}
                  </label>
                ))}
              </div>
            )}
            {qType === "yes_no" && (
              <div className="flex gap-6">
                {["Yes", "No"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      onChange={() => handleChange(opt)}
                    /> {opt}
                  </label>
                ))}
              </div>
            )}
            {qType === "multiple_choice" && (
              <div className="space-y-1">
                {qOptions.map((opt, oi) => (
                  <label key={oi} className="block">
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      onChange={() => handleChange(opt)}
                    /> {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button onClick={submit}>Submit</button>
    </div>
  );
}
