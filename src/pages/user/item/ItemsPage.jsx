// src/components/ItemsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar'; 
import Footer from '../../../components/Footer';
import '../../../css/ItemsPage.css';

const merchandiseItems = [
  {
    id: 'hoodie',
    title: ['University', 'Hoodie'],
    image: '/hoodie2.jpg',
  },
  {
    id: 'tshirt',
    title: ['Campus', 'T-Shirt'],
    image: '/tshirt2.webp',
  },
  {
    id: 'totebag',
    title: ['Tote', 'Bag'],
    image: '/totebag2.webp',
  },
];

export default function ItemsPage() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar /> 
      <div className="items-container">
        <h1 className="page-title">Available Merchandise</h1>
        <p className="page-description">
          Explore official PresUniv merchandise designed for students, alumni, and fans!
        </p>

        <div className="items-grid">
          {merchandiseItems.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-badge">New</div>
              <h2 className="item-title">
                <span className="blue-text">{item.title[0]} </span>
                <span className="red-text">{item.title[1]}</span>
              </h2>
              <img src={item.image} alt={item.title.join(' ')} className="item-image" />
              <button className="details-button" onClick={() => navigate(`/items/${item.id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}
