import '../css/HomePage.css';
import {
  FaLinkedin,
  FaInstagram,
  FaPhone,
  FaShoppingCart,
  FaEnvelope,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useEffect, useState } from 'react'; 
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="app">
      <NavBar />

      <main className="main">
        <div className="hero-text">
          <h1 className="gradient-text">
            MERCHANDISE <br /> CENTER
          </h1>
          <p className="enhanced-text">
            Experience a high quality clothes and be part of President University
          </p>
        </div>
        <div className="hero-logo">
          <img src="/logo2.png" alt="PresUniv Merchandise Center" className="hero-img" />
        </div>
      </main>

      <div className="popular">
        <h1>POPULAR MERCHANDISE</h1>
        <div className="product-carousel">
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{ clickable: true }}
            navigation
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="swiper_container"
          >
            <SwiperSlide>
              <div className="product-card">
                <img src="/hoodie2.jpg" alt="Hoodie" />
                <p>Hoodie</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="product-card">
                <img src="/tshirt2.webp" alt="T-Shirt" />
                <p>T-Shirt</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="product-card">
                <img src="/totebag2.webp" alt="Totebag" />
                <p>Totebag</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="product-card">
                <div className="coming-soon-badge">Coming Soon</div>
                <img src="/hat.jpg" alt="Hat" />
                <p>Topi</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="product-card">
                  <div className="coming-soon-badge">Coming Soon</div>
                  <img src="/tumbler.jpg" alt="Tumbler" />
                  <p>Tumbler</p>
                </div>
              </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <Footer />
    </div>
  );
}
