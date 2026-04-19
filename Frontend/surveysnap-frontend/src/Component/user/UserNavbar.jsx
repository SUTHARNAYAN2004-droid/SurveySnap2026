// UserNavbar.jsx - Logged-in user ke liye top navigation bar
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Common/Logo";

export default function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm">

      {/* Logo */}
      <div className="cursor-pointer" onClick={() => navigate("/dashboard")}>
        <Logo size={32} />
      </div>

      {/* Navigation links */}
      <div className="flex items-center gap-6">
        {/* <Link to="/dashboard" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">
          Dashboard
        </Link> */}
        <Link to="/CreateSurvey" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">
          Create Survey
        </Link>
        <Link to="/analytics" className="text-gray-600 font-medium hover:text-indigo-600 transition-colors">
          Analytics
        </Link>
        <button
          onClick={handleLogout}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
