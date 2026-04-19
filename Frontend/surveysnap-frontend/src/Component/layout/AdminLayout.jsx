// AdminLayout.jsx - Admin section ka wrapper layout
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <div style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
        <nav style={{ padding: '16px 24px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Admin Control Panel</h3>
          <button
            onClick={handleLogout}
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Logout
          </button>
        </nav>
        <div style={{ padding: '30px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
