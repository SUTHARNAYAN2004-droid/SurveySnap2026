// ============================================================
// ManageUsers.jsx - Admin ke liye users manage karne ka page
// - Backend se saare users fetch karta hai (password exclude)
// - Profile pic dikhata hai - agar nahi hai to first letter ka avatar
// - Upload button se admin kisi bhi user ki profile pic upload kar sakta hai
// - Delete button - admin row pe nahi dikhta (admin ko delete nahi kar sakte)
// - Role badge - admin = purple, user = blue
// - Status badge - active = green, inactive = red
// ============================================================

import { useEffect, useState, useRef } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // fileInputRef - hidden file input ko programmatically trigger karne ke liye
  const fileInputRef = useRef({});

  // Backend se saare users fetch karo
  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  // User delete karo - admin row pe ye button nahi dikhta
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(u => u._id !== id)); // UI se bhi hata do
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // Profile pic upload - multer se file /uploads mein save hoti hai
  const handleProfilePicUpload = async (id, file) => {
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${id}/profile-pic`, formData);
      // UI mein bhi update karo
      setUsers(users.map(u => u._id === id ? { ...u, profilePic: res.data.profilePic } : u));
    } catch (err) {
      alert("Failed to upload profile pic");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Manage Users</h2>
      <div style={tableContainerStyle}>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Photo</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {/* Profile pic ya first letter avatar */}
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="pic" style={avatarStyle} />
                      ) : (
                        <div style={avatarPlaceholder}>
                          {user.firstName?.[0]?.toUpperCase()}
                        </div>
                      )}
                      {/* Hidden file input - Upload button se trigger hota hai */}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={el => fileInputRef.current[user._id] = el}
                        onChange={e => handleProfilePicUpload(user._id, e.target.files[0])}
                      />
                      <button
                        onClick={() => fileInputRef.current[user._id]?.click()}
                        style={uploadBtn}
                      >
                        Upload
                      </button>
                    </div>
                  </td>
                  <td style={tdStyle}>{user.firstName} {user.lastName}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    {/* Role badge */}
                    <span style={{ ...badge, background: user.role === "admin" ? "#4f46e5" : "#0ea5e9" }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {/* Status badge */}
                    <span style={{ ...badge, background: user.status === "active" ? "#22c55e" : "#ef4444" }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {/* Admin ko delete nahi kar sakte */}
                    {user.role !== "admin" && (
                      <button onClick={() => handleDelete(user._id)} style={deleteBtn}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const tableContainerStyle = { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" };
const thStyle = { padding: "12px", textAlign: "left", color: "#64748b", fontWeight: "600" };
const tdStyle = { padding: "12px", color: "#1e293b" };
const badge = { padding: "3px 10px", borderRadius: "20px", color: "white", fontSize: "12px", fontWeight: "bold" };
const deleteBtn = { padding: "6px 14px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
const avatarStyle = { width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" };
const avatarPlaceholder = { width: "36px", height: "36px", borderRadius: "50%", background: "#4f46e5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" };
const uploadBtn = { padding: "4px 10px", background: "#0ea5e9", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" };

export default ManageUsers;
