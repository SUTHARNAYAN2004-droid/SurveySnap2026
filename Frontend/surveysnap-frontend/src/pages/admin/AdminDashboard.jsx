// ============================================================
// AdminDashboard.jsx - Admin ka overview page
// - Backend se real-time stats fetch karta hai
// - Total Users (sirf role=user wale count hote hain)
// - Total Surveys (saare surveys)
// - Total Responses (saare submitted responses)
// - Loading state mein "..." dikhata hai
// ============================================================

import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalSurveys: 0, totalResponses: 0 });
  const [loading, setLoading] = useState(true);

  // Backend se stats fetch karo - /api/admin/stats
  useEffect(() => {
    axios.get(`${BASE_URL}/api/admin/stats`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // localStorage se admin ka naam lo
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  return (
    <div>
      <h2>Welcome Back, {adminUser.name || "Admin"}</h2>

      {/* 3 stats cards - Users, Surveys, Responses */}
      <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        <div style={cardStyle}>
          <h4>Total Users</h4>
          <p style={numStyle}>{loading ? "..." : stats.totalUsers}</p>
        </div>
        <div style={cardStyle}>
          <h4>Total Surveys</h4>
          <p style={numStyle}>{loading ? "..." : stats.totalSurveys}</p>
        </div>
        <div style={cardStyle}>
          <h4>Total Responses</h4>
          <p style={numStyle}>{loading ? "..." : stats.totalResponses}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  padding: "20px",
  background: "white",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const numStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#4f46e5",
  margin: 0
};

export default AdminDashboard;
