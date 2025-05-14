import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../lib/firebase';
import "../../css/Reviews.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOriginal, setShowOriginal] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

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

  const toggleView = (id) => {
    setShowOriginal((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setOpenMenuId(null);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

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
              <th>Summary</th>
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
                  <td>{r.itemid}</td>
                  <td>{r.userid}</td>
                  <td style={{ position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <span>{showOriginal[r.id] ? r.review : r.summary}</span>
                      <div style={{ position: "relative" }}>
                        <button
                          onClick={() => toggleMenu(r.id)}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "18px",
                            cursor: "pointer",
                            padding: "0 5px"
                          }}
                        >
                          ⋮
                        </button>
                        {openMenuId === r.id && (
                          <div style={{
                            position: "absolute",
                            right: 0,
                            top: "24px",
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            zIndex: 10,
                            minWidth: "150px"
                          }}>
                            <button
                              onClick={() => toggleView(r.id)}
                              style={{
                                width: "100%",
                                padding: "8px",
                                background: "none",
                                border: "none",
                                textAlign: "left",
                                cursor: "pointer",
                              }}
                            >
                              {showOriginal[r.id] ? "See summary" : "See original review"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
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
