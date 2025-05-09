import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import '../../css/Auth.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Mock user data - in a real app, this would be your API call
  const users = {
    user: { username: 'user', password: '1234', role: 'user' },
    admin: { username: 'admin', password: 'admin', role: 'admin' },
  };

  // Check if user is already logged in
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole) {
      // Redirect to appropriate dashboard
      navigate(userRole === 'admin' ? '/admin' : '/home');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API request
    setTimeout(() => {
      const user = users[username];
      
      if (user && user.password === password) {
        // Save authentication state
        localStorage.setItem('role', user.role);
        
        // Redirect based on role
        navigate(user.role === 'admin' ? '/admin' : '/home');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Sign in to your account</h2>
          <p className="auth-subtitle">Enter your credentials to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-wrapper">
              <div className="icon-container">
                <User size={20} color="#9ca3af" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <div className="icon-container">
                <Lock size={20} color="#9ca3af" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="flex-row">
            <div className="checkbox-container">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox"
              />
              <label htmlFor="remember-me" className="checkbox-label">
                Remember me
              </label>
            </div>

            <div>
              <a href="#" className="auth-link">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">
            Don't have an account?
          </span>
        </div>

        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button className="secondary-button">
            Sign up
          </button>
        </Link>
      </div>
    </div>
  );
}