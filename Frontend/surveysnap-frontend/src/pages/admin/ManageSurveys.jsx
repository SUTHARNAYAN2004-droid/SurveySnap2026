import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const ManageSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/surveys/all`);
      setSurveys(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSurvey = async (id) => {
    if (!window.confirm("Delete this survey?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/surveys/${id}`);
      fetchSurveys();
    } catch (err) {
      alert("Delete failed!");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/surveys/${id}/toggle-status`);
      setSurveys(surveys.map(s => s._id === id ? { ...s, status: res.data.status } : s));
    } catch (err) {
      alert("Status update failed!");
    }
  };

  useEffect(() => { fetchSurveys(); }, []);

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Manage Surveys ({surveys.length})</h2>
        <button onClick={fetchSurveys} style={refreshBtn}>Refresh</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Creator</th>
            <th style={thStyle}>Questions</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Created</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {surveys.length > 0 ? surveys.map((s) => (
            <tr key={s._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={tdStyle}><strong>{s.title}</strong></td>
              <td style={tdStyle}>{s.creator?.firstName || s.creator?.email || "Unknown"}</td>
              <td style={tdStyle}>{s.questions?.length || 0}</td>
              <td style={tdStyle}>
                <span style={badgeStyle(s.status)}>{s.status || "active"}</span>
              </td>
              <td style={tdStyle}>{new Date(s.createdAt).toLocaleDateString()}</td>
              <td style={tdStyle}>
                <button onClick={() => toggleStatus(s._id)} style={toggleBtn(s.status)}>
                  {s.status === "active" ? "Close" : "Activate"}
                </button>
                <button onClick={() => deleteSurvey(s._id)} style={deleteBtn}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No surveys yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const containerStyle = { padding: "25px", background: "white", borderRadius: "15px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" };
const thStyle = { textAlign: "left", padding: "12px", color: "#64748b", fontSize: "14px" };
const tdStyle = { padding: "12px", fontSize: "14px", color: "#1e293b" };
const refreshBtn = { padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const deleteBtn = { color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontWeight: "bold", marginLeft: "10px" };
const toggleBtn = (status) => ({ padding: "4px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "12px", background: status === "active" ? "#fee2e2" : "#dcfce7", color: status === "active" ? "#991b1b" : "#166534" });
const badgeStyle = (status) => ({ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: status === "active" ? "#dcfce7" : "#fee2e2", color: status === "active" ? "#166534" : "#991b1b" });

export default ManageSurveys;
