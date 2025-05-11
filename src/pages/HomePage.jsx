import '../css/HomePage.css';
import {
  FaLinkedin,
  FaInstagram,
  FaPhone,
  FaShoppingCart,
  FaEnvelope,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ItemList from './user/item/ItemsPage';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';


export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="app">
      <NavBar/>

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

      <Footer/>
    </div>
  );
}

