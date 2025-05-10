import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const mockItems = [
  { id: '101', name: 'University Hoodie' },
  { id: '102', name: 'Campus T-Shirt' },
  { id: '103', name: 'PU Tote Bag' },
];

const ItemList = () => {
  const navigate = useNavigate();

  const handleViewDetail = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div>
      <h2>Available Merchandise</h2>
      {mockItems.map((item) => (
        <div key={item.id} style={{ margin: '1rem 0' }}>
          <p>{item.name}</p>
          <button onClick={() => handleViewDetail(item.id)}>
            View Details
          </button>
        </div>
      ))}
      <Outlet />
    </div>
  );
};

export default ItemList;
