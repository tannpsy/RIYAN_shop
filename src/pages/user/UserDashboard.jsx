import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import NavBar from '../../components/NavBar.jsx';
import Footer from '../../components/Footer.jsx';
import '../../css/Dashboard.css';
import '../../css/HomePage.css';

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

      <main className="main">
        <div className="hero-text">
          <h1 className="gradient-text">
            MERCHANDISE <br /> CENTER
          </h1>
          <p className="enhanced-text">Experience a high quality clothes and be part of President University</p>
        </div>
        <div className="hero-logo">
          <img src="/logo2.png" alt="PresUniv Merchandise Center" className="hero-img" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
