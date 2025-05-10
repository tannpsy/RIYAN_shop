import React from 'react';
import { useParams } from 'react-router-dom';

const ItemDetailPage = () => {
  const { itemId } = useParams();

  return (
    <div>
      <h2>Item Details</h2>
      <p>Showing details for item ID: {itemId}</p>
    </div>
  );
};

export default ItemDetailPage;
