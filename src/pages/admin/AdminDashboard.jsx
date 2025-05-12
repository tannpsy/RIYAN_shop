import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UsersAdmin from './UsersAdmin';
import Products from './Products';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Session check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  // Sync activePage with current route
  useEffect(() => {
    if (location.pathname === '/admin/users') {
      setActivePage('users');
    } else if (location.pathname === '/admin/products') {
      setActivePage('products');
    } else {
      setActivePage('dashboard');
    }
  }, [location]);

  // Fetch total users count
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id', { count: 'exact' });

        if (error) throw error;

        setTotalUsers(data.length);
      } catch (error) {
        console.error("Error fetching total users:", error.message);
      }
    };

    fetchTotalUsers();
  }, []);

  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-header-row">
              <div className="dashboard-card flex-grow">
                <h2>Admin Control Panel</h2>
                <p>This dashboard is accessible only to authenticated admins.</p>
              </div>
              <div className="stat-card admin-stat fixed-width">
                <h3>Total Users</h3>
                <p className="stat-number">{totalUsers}</p>
              </div>
            </div>
            <div className="dashboard-card">
              <h2>User Management</h2>
              <UsersAdmin setTotalUsers={setTotalUsers} />
            </div>
          </>
        );
      case 'users':
        return <UsersAdmin setTotalUsers={setTotalUsers} />;
      case 'products':
        return <Products />;
      default:
        return <div>Page not found</div>;
    }
  };

  const handleSidebarClick = (page) => {
    setActivePage(page);
    if (page === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${page}`);
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
              <li onClick={() => handleSidebarClick('products')}>Products</li>
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
