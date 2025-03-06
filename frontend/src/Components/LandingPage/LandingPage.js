import React from "react";
import "./LandingPage.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

// Import images
import earRing from "./images/ear_ring.png";
import necklace from "./images/Gold-Necklace.png";
import ring from "./images/ring.jpeg";
import schemes from "./images/th.jpg"

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Elegant Jewellery Collection
      </div>

      {/* About Us Section */}
      <div className="about-section">
        <h2>About Us</h2>
        <p>
          Welcome to our exclusive jewellery store, where timeless elegance
          meets modern craftsmanship. We pride ourselves on offering
          high-quality, handcrafted pieces that tell a story of luxury and
          sophistication.
        </p>
      </div>

      {/* Collection Section */}
      <div className="collection-section">
        <h2>Our Collection</h2>
        <div className="collection-container">
          {/* Collection Items with Images */}
          <div className="collection-item">
            <img src={ring} alt="Exquisite Rings" />
            <h3>Exquisite Rings</h3>
          </div>

          <div className="collection-item">
            <img src={earRing} alt="Luxury Earrings" />
            <h3>Luxury Earrings</h3>
          </div>

          <div className="collection-item">
            <img src={necklace} alt="Elegant Necklaces" />
            <h3>Elegant Necklaces</h3>
          </div>

          {/* Jewellery Scheme (Redirects to Saving Plan) */}
          <div
            className="collection-item"
            onClick={() => navigate("/saving-plan")}
            style={{ cursor: "pointer" }}
          >
            <img
              // src="https://images.pexels.com/photos/4386369/pexels-photo-4386369.jpeg"
              src={schemes}
              alt="Jewellery Scheme"
            />
            <h3>Exclusive Jewellery Schemes</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
