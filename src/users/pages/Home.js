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
          <p>
            Get the medically accurate<br></br> food suggestion according
            <br></br> to your disease
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
