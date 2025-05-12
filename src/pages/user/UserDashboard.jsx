import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import NavBar from '../../components/NavBar.jsx';
import Footer from '../../components/Footer.jsx';
import '../../css/Dashboard.css';

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const session = localStorage.getItem('user');

      if (!session) {
        navigate('/login');
        return;
      }

      const { uid, role } = JSON.parse(session);

      // Only allow "user" role to access this page
      if (role !== 'user') {
        navigate('/login');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error('User not found in database');
          navigate('/login');
          return;
        }

        setUserData(userDoc.data());
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <NavBar />
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="user-actions">
          <span>Welcome, {userData?.username || 'User'}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Hello {userData.fullname}!</h2>
          <p>This is a protected dashboard only for users with the role <strong>"user"</strong>.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Your Projects</h3>
            <p className="stat-number">5</p>
          </div>
          <div className="stat-card">
            <h3>Tasks</h3>
            <p className="stat-number">12</p>
          </div>
          <div className="stat-card">
            <h3>Messages</h3>
            <p className="stat-number">3</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
