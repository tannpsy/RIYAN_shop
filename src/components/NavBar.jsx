import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();

  const checkSessionAndNavigate = (targetPath) => {
    const session = localStorage.getItem('user');
    if (session) {
      navigate(targetPath);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/logo3.png" alt="PresUniv" className="logo-img" />
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
        <button className="sign-in" onClick={() => checkSessionAndNavigate('/home')}>
          Sign In
        </button>
        <button className="get-started" onClick={() => checkSessionAndNavigate('/register')}>
          Get Started
        </button>
      </div>
    </header>
  );
};

export default NavBar;
