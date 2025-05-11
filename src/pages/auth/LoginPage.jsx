import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import {
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  doc,
  getDoc
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/Auth.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      if (!user) {
        setError('Login failed: no user returned');
        setIsLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setError('Failed to fetch user info: user not found in database');
        setIsLoading(false);
        return;
      }

      const { fullname, role } = userDoc.data();

      toast.success(`Welcome, ${fullname}`, {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: 'colored',
      });

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }, 1600);

    } catch (err) {
      setError(err.message || 'Unexpected error during login.');
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Sign in to your account</h2>
          <p className="auth-subtitle">Enter your email and password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <div className="icon-container"><Mail size={20} color="#9ca3af" /></div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <div className="icon-container"><Lock size={20} color="#9ca3af" /></div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">Don’t have an account?</span>
        </div>

        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button className="secondary-button">Create Account</button>
        </Link>
      </div>
    </div>
  );
}
