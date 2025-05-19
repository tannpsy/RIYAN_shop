import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../lib/firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import NavBar from '../../../components/NavBar'; 
import Footer from '../../../components/Footer';
import '../../../css/ItemsPage.css';

export default function ItemsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const session = localStorage.getItem('user');

      if (!session) {
        navigate('/login');
        return;
      }

      const { uid, role } = JSON.parse(session);

      if (role !== 'user') {
        navigate('/login');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error('User not found in database');
          navigate('/login');
          return;
        }

        setUserData(userDoc.data());
        fetchMerchandise(); // Only fetch items after confirming user
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchMerchandise = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching merchandise:", error.message);
    }
  };

  if (isLoading) {
      return (
        <div className="loading-screen">
          <div className="spinner" />
          <p>Loading Items...</p>
        </div>
      );
    }


  return (
    <>
      <NavBar /> 
      <div className="items-container">
        <h1 className="page-title">Available Merchandise</h1>
        <p className="page-description">
          Explore official PresUniv merchandise designed for students, alumni, and fans!
        </p>

        <div className="items-grid">
          {items.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-badge">New</div>
              <h2 className="item-title">
                <span className="blue-text">{item.name?.split(' ')[0]} </span>
                <span className="red-text">{item.name?.split(' ').slice(1).join(' ')}</span>
              </h2>
              <img src={item.image} alt={item.name} className="item-image" />
              <button className="details-button" onClick={() => navigate(`/items/${item.id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
