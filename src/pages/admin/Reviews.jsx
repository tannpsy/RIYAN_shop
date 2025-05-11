import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../lib/firebase';
import "../../css/Reviews.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const reviewsCol = collection(db, "reviews");
      const snapshot = await getDocs(reviewsCol);
      const reviewsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="reviews-container">
      <h2>Review Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Review ID</th>
              <th>Item ID</th>
              <th>User ID</th>
              <th>Review</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="5">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.itemId}</td>
                  <td>{r.userId}</td>
                  <td>{r.review}</td>
                  <td>{r.sentiment}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reviews;
