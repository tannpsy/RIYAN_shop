import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import '../css/HomePage.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('user');
    if (session) {
      setUser(JSON.parse(session));
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
            <span className="welcome-msg">Hi, {user.username || 'User'}</span>
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
