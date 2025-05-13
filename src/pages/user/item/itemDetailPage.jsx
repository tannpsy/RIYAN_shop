import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import "../../../css/ItemDetails.css";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const getSentimentFromRating = (rating) => {
  if (rating >= 4) return "POSITIVE";
  if (rating === 3) return "NEUTRAL";
  return "NEGATIVE";
};

const getColorBySentiment = (sentiment) => {
  switch (sentiment) {
    case "POSITIVE":
      return "green";
    case "NEUTRAL":
      return "orange";
    case "NEGATIVE":
      return "red";
    default:
      return "black";
  }
};

const ItemDetails = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [userData, setUserData] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState("ALL");

  useEffect(() => {
    const session = localStorage.getItem("user");
    if (!session) {
      navigate("/login");
      return;
    }

    const { uid, role } = JSON.parse(session);
    if (role !== "user") {
      navigate("/login");
      return;
    }

    setUserData({ uid });

    const fetchItem = async () => {
      const itemRef = doc(db, "items", itemId);
      const itemSnap = await getDoc(itemRef);
      if (itemSnap.exists()) {
        setItem({ id: itemSnap.id, ...itemSnap.data() });
      } else {
        console.error("Item not found");
        navigate("/");
      }
    };

    const fetchReviewsWithUsers = async () => {
      setIsReviewLoading(true);
      const q = query(
        collection(db, "reviews"),
        where("itemid", "==", itemId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const reviewList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? new Date(0),
      }));
      setReviews(reviewList);

      const userIds = [...new Set(reviewList.map((rev) => rev.userid))];
      const userDocs = await Promise.all(
        userIds.map((uid) => getDoc(doc(db, "users", uid)))
      );

      const userMap = {};
      userDocs.forEach((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          userMap[snap.id] = {
            fullname: data.fullname,
            username: data.username,
          };
        }
      });
      setUserInfoMap(userMap);
      setIsReviewLoading(false);
    };

    fetchItem();
    fetchReviewsWithUsers();
  }, [itemId, navigate]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setIsAddingReview(true);
    try {
      const newReview = {
        itemid: itemId,
        userid: userData.uid,
        review: comment.trim(),
        sentiment: "positive",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "reviews"), newReview);
      setComment("");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err) {
      console.error("Error adding review:", err);
    }
    setIsAddingReview(false);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const mapped = reviews.map((rev) => {
      if (rev.sentiment?.toLowerCase() === "positive") return 5;
      if (rev.sentiment?.toLowerCase() === "neutral") return 3;
      if (rev.sentiment?.toLowerCase() === "negative") return 1;
      return 0;
    });
    const total = mapped.reduce((acc, val) => acc + val, 0);
    return total / mapped.length;
  };

  const averageRating = getAverageRating();
  const avgSentiment = getSentimentFromRating(Math.round(averageRating));
  const sentimentColor = getColorBySentiment(avgSentiment);

  const filteredReviews =
    selectedSentiment === "ALL"
      ? reviews
      : reviews.filter(
          (rev) => rev.sentiment?.toUpperCase() === selectedSentiment
        );

  if (!item) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading item details...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="hoodie-container">
        <div className="hoodie-product-section">
          <div className="hoodie-image-wrapper">
            <img src={item.image} alt={item.name} className="hoodie-image" />
          </div>

          <div className="hoodie-info">
            <h1 className="hoodie-title">{item.name?.toUpperCase()}</h1>
            <hr className="hoodie-divider1" />
            <hr className="hoodie-divider2" />
            <div className="hoodie-rating">
              <span className="hoodie-null">{averageRating.toFixed(1)}</span>
              <div className="hoodie-stars">
                {[...Array(5)].map((_, idx) => (
                  <span
                    key={idx}
                    className="star"
                    style={{
                      color:
                        idx < Math.round(averageRating)
                          ? sentimentColor
                          : "#ccc",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span
                className="hoodie-positive"
                style={{ color: sentimentColor, marginLeft: "10px" }}
              >
                | {avgSentiment}
              </span>
            </div>
            <div className="hoodie-price">
              {formatRupiah(parseInt(item.price))}
            </div>

            <div className="hoodie-description">
              <h2>Product Description</h2>
              <p>
                {showFullDescription ? (
                  <>
                    {item.description}
                    <br />
                    <span
                      className="see-less"
                      onClick={() => setShowFullDescription(false)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      {" "}See Less
                    </span>
                  </>
                ) : (
                  <>
                    {item.description.slice(0, 100)}...
                    <span
                      className="see-more"
                      onClick={() => setShowFullDescription(true)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      {" "}See More …
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="hoodie-buttons">
              <button className="btn-cart">🛒 Add to Cart</button>
              <button className="btn-buy">Buy Now</button>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="hoodie-review-section">
          <div className="review-header">
            <h2 className="review-title">Reviews</h2>
            <div className="review-filters">
              {["ALL", "NEGATIVE", "NEUTRAL", "POSITIVE"].map((sentiment) => (
                <button
                  key={sentiment}
                  className={`filter-btn ${
                    selectedSentiment === sentiment ? "active-filter" : ""
                  }`}
                  onClick={() => setSelectedSentiment(sentiment)}
                >
                  {sentiment}
                </button>
              ))}
            </div>
          </div>

          <div className="review-input-wrapper">
            <input
              type="text"
              placeholder="Write a comment here ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="review-input"
              disabled={isAddingReview}
            />
            <button
              onClick={handleSubmitComment}
              className="submit-cmt"
              disabled={isAddingReview}
            >
              {isAddingReview ? "Adding..." : "Submit"}
            </button>
          </div>

          {isReviewLoading ? (
            <p className="review-loading">Loading reviews...</p>
          ) : (
            <div className="review-list">
              {filteredReviews.map((rev, index) => {
                const user = userInfoMap[rev.userid];
                return (
                  <div className="review-item" key={index}>
                    <div className="review-header-line">
                      <p className="review-user">
                        {user
                          ? `${user.fullname} (@${user.username})`
                          : `Loading user...`}
                      </p>
                      <p
                        className={`label-${rev.sentiment?.toLowerCase()}`}
                        style={{ textTransform: "uppercase" }}
                      >
                        {rev.sentiment}
                      </p>
                    </div>
                    <p className="review-text">{rev.review}</p>
                  </div>
                );
              })}
              {filteredReviews.length === 0 && (
                <p className="no-reviews-msg">No reviews for this filter.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetails;
