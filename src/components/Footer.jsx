import { FaEnvelope, FaLinkedin, FaInstagram, FaPhone } from 'react-icons/fa';
import '../css/HomePage.css'; 
const Footer = () => {
  return (
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
  );
};

export default Footer;
