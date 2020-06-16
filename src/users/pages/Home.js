import React from "react";
import banner2 from "../../images/home2.png";
import { NavLink } from "react-router-dom";

import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="banner">
        <div className="hero-left">
          <img src={banner2} className="banner-img" alt="" />
        </div>
        <div className="hero-right">
          <p className="hero-right-title">
            Find medically accurate
            <br></br>foods based on your disease
          </p>
          <p className="hero-right-desc">
            We cross check your all disease and find the most medically accurate
            foods for you
          </p>
          <button>
            <NavLink to="/auth">Get started</NavLink>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
