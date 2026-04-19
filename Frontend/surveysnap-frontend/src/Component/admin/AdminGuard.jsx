// AdminGuard.jsx - Admin routes ko protect karta hai
// adminToken nahi hai to /admin/login pe redirect karta hai
import { Navigate, Outlet } from "react-router-dom";

export default function AdminGuard() {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
