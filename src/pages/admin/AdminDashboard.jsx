import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UsersAdmin from './UsersAdmin';
import Products from './Products';
import Reviews from './Reviews';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, collection, getCountFromServer } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Session and token expiration check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const userSession = JSON.parse(localStorage.getItem('user'));

      if (!userSession || userSession.role !== 'admin') {
        await signOut(auth);
        localStorage.removeItem('user');
        navigate('/');
        return;
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Sync activePage with current route
  useEffect(() => {
    if (location.pathname === '/admin/users') {
      setActivePage('users');
    } else if (location.pathname === '/admin/products') {
      setActivePage('products');
    } else if (location.pathname === '/admin/reviews') {
      setActivePage('reviews');
    } else {
      setActivePage('dashboard');
    }
  }, [location]);

  // Fetch total users from Firebase Firestore
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getCountFromServer(usersCollection);
        setTotalUsers(snapshot.data().count);
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
      case 'reviews':
        return <Reviews />;
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-layout">
      <header className="top-navbar">
        <div className="logo">
          <img src="/logo3.new.png" alt="Logo" className="logo-img" />
        </div>
        <div className="user-actions">
          <span>Welcome, Admin</span>
          <button
            onClick={async () => {
              await signOut(auth);
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="main-wrapper">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li onClick={() => handleSidebarClick('dashboard')}>Dashboard</li>
              <li onClick={() => handleSidebarClick('users')}>Users</li>
              <li onClick={() => handleSidebarClick('products')}>Products</li>
              <li onClick={() => handleSidebarClick('reviews')}>Reviews</li>
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
