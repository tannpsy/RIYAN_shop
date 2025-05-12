import React, { useState } from "react";
import "../../../css/ItemDetails.css";

const UniversityHoodie = () => {
  const [comment, setComment] = useState("");

  return (
    <div className="hoodie-container">
      {/* Product Section */}
      <div className="hoodie-product-section">
        <div className="hoodie-image-wrapper">
          <img
            src="/hoodie.jpeg"
            alt="University Hoodie"
            className="hoodie-image"
          />
        </div>

        <div className="hoodie-info">
          <h1 className="hoodie-title">HOODIE PRESUNIV MERCHANDISE</h1>
          <hr className="hoodie-divider1" />
          <hr className="hoodie-divider2" />
          <div className="hoodie-rating">
            <span className="hoodie-null">NULL</span>
            <div className="hoodie-stars">
              {[...Array(5)].map((_, idx) => (
                <span key={idx} className="star">☆</span>
              ))}
            </div>
            <span className="hoodie-positive"> | POSITIVE</span>
          </div>
          <div className="hoodie-price">Rp499.000</div>

          <div className="hoodie-description">
            <h2>Product Description</h2>
            <p>
              Bdawdajdkajkdlajdlkajldajwdadajdlkjawkldjakldjakldjwakldjakldjakldjakldjalwkdjaklwjdaklwjdlkadjlawkdjawkldjwkladjwlakdjwlkadjlakwjdklawjdlkwajda 
              <br/>
              <br/>
              dwkjakdjakjdlakjdlkajdklajdkla...
              <span className="see-more"> See More …</span>
            </p>
          </div>

          <div className="hoodie-buttons">
            <button className="btn-cart">
              🛒 Add to Cart
            </button>
            <button className="btn-buy">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="hoodie-review-section">
        <div className="review-header">
          <h2 className="review-title">Reviews</h2>
          <div className="review-filters">
            <button className="filter-btn">NEGATIVE</button>
            <button className="filter-btn">NEUTRAL</button>
            <button className="filter-btn">POSITIVE</button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Write a comment here ..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="review-input"
        />

        <div className="review-list">
          <div className="review-item">
            <div className="review-header-line">
              <p className="review-user">
                User1’s fullname <span>user1’s username</span>
              </p>
              <p className="label-positive">POSITIVE</p>
            </div>
            <p className="review-text">
              dnwandjkwadjkandajk dnawjkndkajndakjdakjndjawkndajwdmajwndawkdnjanskdnwandjawndkandjawnkdnajdsioawodkoskckasjkcakdjbawjdnamsndkajwndnjksand
            </p>
          </div>

          <div className="review-item">
            <div className="review-header-line">
              <p className="review-user">
                User2’s fullname <span>user2’s username</span>
              </p>
              <p className="label-negative">NEGATIVE</p>
            </div>
            <p className="review-text">
              dnwandjkwadjkandajk dnawjkndkajndakjdakjndjawkndajwdmajwndawkdnjanskdnwandjawndkandjawnkdnajdsioawodkoskckasjkcakdjbawjdnamsndkajwndnjksand
            </p>
          </div>

          <div className="review-item">
            <div className="review-header-line">
              <p className="review-user">
                User3’s fullname <span>user3’s username</span>
              </p>
              <p className="label-neutral">NEUTRAL</p>
            </div>
            <p className="review-text">
              dnwandjkwadjkandajk dnawjkndkajndakjdakjndjawkndajwdmajwndawkdnjanskdnwandjawndkandjawnkdnajdsioawodkoskckasjkcakdjbawjdnamsndkajwndnjksand
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default UniversityHoodie;