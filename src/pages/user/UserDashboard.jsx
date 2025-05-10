import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import NavBar from '../../components/NavBar.jsx';
import '../../css/Dashboard.css';

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate('/login');
        return;
      }

      const { data: userDetails, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('uid', user.id)
        .single();

      if (fetchError || !userDetails) {
        console.error('Failed to fetch user details:', fetchError);
        navigate('/login');
        return;
      }

      setUserData(userDetails);
      setIsLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('role'); // optional, depending on your app
    navigate('/login');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <NavBar/>
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
    </div>
  );
}
