import '../css/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src="/logo3.png" alt="PresUniv" className="logo-img" />
        </div>
        <nav className="nav">
          <a href="#">Home</a>
          <a href="#" className="icon-link">
            <FaShoppingCart className="icon" />
          </a>
          <button className="items" onClick={() => navigate('/items')}>Items</button>
        </nav>
      </div>

      <div className="header-right">
        <button className="sign-in" onClick={() => navigate('/login')}>
          Sign In
        </button>
        <button className="get-started" onClick={() => navigate('/register')}>Get Started</button>
      </div>
    </header>
  );
};

export default NavBar;
