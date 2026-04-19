// AdminSidebar.jsx - Admin panel ka left sidebar navigation
// Saare admin pages ke links yahan hain
import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div style={sidebarStyle}>
      {/* App logo / title */}
      <h2 style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #1e293b' }}>
        SurveySnap
      </h2>

      {/* Navigation links */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={liStyle}><Link to="/admin" style={linkStyle}>Dashboard</Link></li>
        <li style={liStyle}><Link to="/admin/users" style={linkStyle}>Manage Users</Link></li>
        <li style={liStyle}><Link to="/admin/surveys" style={linkStyle}>Manage Surveys</Link></li>
        {/* Logout - home page pe redirect karta hai (TODO: token clear karna bhi chahiye) */}
        <li style={liStyle}><Link to="/" style={linkStyle}>Logout</Link></li>
      </ul>
    </div>
  );
};

const sidebarStyle = { width: '250px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' };
const liStyle = { padding: '15px 20px', borderBottom: '1px solid #1e293b' };
const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontWeight: 'bold', display: 'block' };

export default AdminSidebar;
