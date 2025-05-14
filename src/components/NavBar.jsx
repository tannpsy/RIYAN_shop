import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // adjust the path as needed
import '../css/HomePage.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // ✅ Reset session ONLY once per app reload in development mode
    if (import.meta.env.DEV && !sessionStorage.getItem('sessionInitialized')) {
      localStorage.removeItem('user');
      sessionStorage.setItem('sessionInitialized', 'true');
    }

    // ✅ Check session and fetch user info
    const session = localStorage.getItem('user');
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);

      // ✅ Fetch full name from Firestore
      const fetchFullName = async () => {
        try {
          const userDocRef = doc(db, 'users', parsedUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setFullName(userData.fullname);
          } else {
            console.log('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchFullName();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const checkSessionAndNavigate = (targetPath) => {
    if (user) {
      navigate(targetPath);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/logo3.new.png" alt="PresUniv" className="logo-img" />
        </div>
        <nav className="nav">
          <button className="nav-link" onClick={() => navigate('/')}>Home</button>
          <button className="icon-link" onClick={() => checkSessionAndNavigate('/items')}>
            <FaShoppingCart className="icon" />
          </button>
          <button className="items" onClick={() => checkSessionAndNavigate('/items')}>Items</button>
        </nav>
      </div>

      <div className="header-right">
        {user ? (
          <>
            <span className="welcome-msg">Hi, {fullName || 'User'}</span>
            <button className="sign-in" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="sign-in" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="get-started" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
