import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsersAdmin from './UsersAdmin'; // Assuming this component exists
import { supabase } from '../../lib/supabase'; // Import supabase

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  // Fetch total users count
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id', { count: 'exact' }); // Use count: 'exact' to get total number of users

        if (error) {
          throw error;
        }

        setTotalUsers(data.length); // Set the total user count
      } catch (error) {
        console.error("Error fetching total users:", error.message);
      }
    };

    fetchTotalUsers(); // Fetch total users count when component mounts
  }, []);

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-header-row">
              <div className="dashboard-card flex-grow">
                <h2>Admin Control Panel</h2>
                <p>This is a static admin panel accessible without authentication.</p>
              </div>
              <div className="stat-card admin-stat fixed-width">
                <h3>Total Users</h3>
                <p className="stat-number">{totalUsers}</p> {/* Display dynamic total users */}
              </div>
            </div>
            <div className="dashboard-card">
              <h2>User Management</h2>
              <UsersAdmin setTotalUsers={setTotalUsers} /> {/* Pass setTotalUsers function to UsersAdmin */}
            </div>
          </>
        );
      case 'users':
        return <UsersAdmin setTotalUsers={setTotalUsers} />;
      default:
        return <div>Page not found</div>;
    }
  };

  const handleSidebarClick = (page) => {
    setActivePage(page);
    // Navigate to the corresponding route
    if (page === 'dashboard') {
      navigate('/admin');
    } else if (page === 'users') {
      navigate('/admin/users');
    }
  };

  return (
    <div className="dashboard-layout">
      <header className="top-navbar">
        <div className="logo">
          <img src="/logo3.png" alt="Logo" className="logo-img" />
        </div>
        <div className="user-actions">
          <span>Welcome, Admin</span>
        </div>
      </header>

      <div className="main-wrapper">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li onClick={() => handleSidebarClick('dashboard')}>Dashboard</li>
              <li onClick={() => handleSidebarClick('users')}>Users</li>
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
