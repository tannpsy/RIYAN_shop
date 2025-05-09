import { useEffect, useState } from 'react';
import AuthService from '../../services/AuthService';
import '../../css/Dashboard.css';


export default function UserDashboard() {
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    // Get the username when the component mounts
    setUsername(AuthService.getUsername());
  }, []);
  
  const handleLogout = () => {
    AuthService.logout();
  };
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="user-actions">
          <span>Welcome, {username}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Welcome to Your User Dashboard</h2>
          <p>This is a protected route accessible only to authenticated users with the role "user".</p>
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