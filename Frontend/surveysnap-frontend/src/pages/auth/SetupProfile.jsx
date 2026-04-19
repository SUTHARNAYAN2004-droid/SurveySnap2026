import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SetupProfile() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return navigate("/user/surveys");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}/profile-pic`, formData);
      const updatedUser = { ...user, profilePic: res.data.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/user/surveys");
    } catch (err) {
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 text-center">

        <h1 className="text-2xl font-bold text-indigo-600 mb-1">One Last Step!</h1>
        <p className="text-gray-500 text-sm mb-6">Upload a profile picture to personalize your account.</p>

        <div className="flex justify-center mb-6">
          {preview ? (
            <img src={preview} alt="preview" className="w-28 h-28 rounded-full object-cover border-4 border-indigo-400" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-400">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 text-sm text-gray-500" />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-2.5 rounded-lg transition mb-3"
        >
          {loading ? "Uploading..." : "Save & Continue"}
        </button>

        <button
          onClick={() => navigate("/user/surveys")}
          className="w-full text-gray-400 text-sm hover:underline"
        >
          Skip for now
        </button>

      </div>
    </div>
  );
}
