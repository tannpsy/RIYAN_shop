import '../css/HomePage.css';
import {
  FaLinkedin,
  FaInstagram,
  FaPhone,
  FaShoppingCart,
  FaEnvelope,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ItemList from '../components/ItemButton';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="app">
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
          </nav>
        </div>

        <div className="header-right">
          <button className="sign-in" onClick={() => navigate('/admin')}>Sign In</button>
          <button className="get-started">Get Started</button>
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

      <div>
        <h1>Popular Clothes</h1>
        <ItemList />
      </div>

      <footer className="footer">
        <p>Don't See What Are You Looking For?</p>
        <button className="contact-us">
          <FaEnvelope className="icon" /> Contact Us
        </button>
        <div className="social-icons">
          <FaLinkedin className="icon" />
          <FaInstagram className="icon" />
          <FaPhone className="icon" />
        </div>
      </footer>
    </div>
  );
}

