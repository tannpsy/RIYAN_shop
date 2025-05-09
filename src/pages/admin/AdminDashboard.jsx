import { useEffect, useState } from 'react';
import AuthService from '../../services/AuthService';
import '../../css/Dashboard.css';
import UsersAdmin from './UsersAdmin'; // Ensure path is correct

export default function AdminDashboard() {
  const [username, setUsername] = useState('');
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    setUsername(AuthService.getUsername());
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-header-row">
              <div className="dashboard-card flex-grow">
                <h2>Admin Control Panel</h2>
                <p>This is a protected route accessible only to authenticated users with the role "admin".</p>
              </div>
              <div className="stat-card admin-stat fixed-width">
                <h3>Total Users</h3>
                <p className="stat-number">124</p>
              </div>
            </div>
            <div className="dashboard-card">
              <h2>User Management</h2>
              <UsersAdmin />
            </div>
          </>
        );
      case 'users':
        return <UsersAdmin />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="dashboard-layout">
      <header className="top-navbar">
        <div className="logo">
          <img src="/logo3.png" alt="Logo" className="logo-img" />
        </div>
        <div className="user-actions">
          <span>Welcome, {username} (Admin)</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="main-wrapper">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li onClick={() => setActivePage('dashboard')}>Dashboard</li>
              <li onClick={() => setActivePage('users')}>Users</li>
              <li>Products</li>
              <li>Reviews</li>
            </ul>
          </nav>
        </aside>

        <main className="dashboard-container">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
