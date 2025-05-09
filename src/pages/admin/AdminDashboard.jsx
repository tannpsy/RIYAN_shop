import { useEffect, useState } from 'react';
import AuthService from '../../services/AuthService';
import '../../css/Dashboard.css';

export default function AdminDashboard() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(AuthService.getUsername());
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="dashboard-layout">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="logo">
          <img src="/logo3.png" alt="Logo" className="logo-img" />
        </div>
        <div className="user-actions">
          <span>Welcome, {username} (Admin)</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      {/* Wrapper for sidebar and content */}
      <div className="main-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li>Dashboard</li>
              <li>Users</li>
              <li>Products</li>
              <li>Reports</li>
              <li>Settings</li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-container">
          <div className="dashboard-card">
            <h2>Admin Control Panel</h2>
            <p>This is a protected route accessible only to authenticated users with the role "admin".</p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card admin-stat">
              <h3>Total Users</h3>
              <p className="stat-number">124</p>
            </div>
            <div className="stat-card admin-stat">
              <h3>Active Projects</h3>
              <p className="stat-number">37</p>
            </div>
            <div className="stat-card admin-stat">
              <h3>System Status</h3>
              <p className="stat-number">Online</p>
            </div>
          </div>

          <div className="admin-controls">
            <h3>Quick Actions</h3>
            <div className="admin-buttons">
              <button className="admin-action-button">Manage Users</button>
              <button className="admin-action-button">System Settings</button>
              <button className="admin-action-button">View Reports</button>
              <button className="admin-action-button">Audit Logs</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
