import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Schemes.css"; // Ensure CSS file exists for styling

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [expandedSchemes, setExpandedSchemes] = useState({});
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("user") !== null;

  useEffect(() => {
    axios
      .get("http://localhost/Schemes/Backend/getSchemes.php")
      .then((response) => {
        setSchemes(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching schemes:", error));
  }, []);

  // const handleJoinClick = (scheme) => {
  //   if (isLoggedIn) {
  //     window.alert("User is logged in! Redirecting to Saving Plan...");
  //     navigate("/saving-plan");
  //   } else {
  //     setSelectedScheme(scheme);
  //     setShowModal(true);
  //   }
  // };

  const handleJoinClick = (scheme) => {
    if (isLoggedIn) {
      localStorage.setItem("selectedScheme", JSON.stringify({ scheme_name: scheme.scheme_name })); // ✅ Store selected scheme
      window.alert("User is logged in! Redirecting to Saving Plan...");
      navigate("/saving-plan");
    } else {
      setSelectedScheme(scheme);
      setShowModal(true);
    }
  };
  
  

  const toggleReadMore = (schemeId) => {
    setExpandedSchemes((prev) => ({
      ...prev,
      [schemeId]: !prev[schemeId],
    }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const redirectToRegister = () => {
    localStorage.setItem("selectedScheme", JSON.stringify(selectedScheme));
    navigate("/register");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center scheme-heading">Available Schemes</h2>

      {loading ? (
        <p className="loading-text">Loading schemes...</p>
      ) : (
        <div className="card-container">
          {schemes.map((scheme) => {
            const isExpanded = expandedSchemes[scheme.scheme_id] || false;

            return (
              <div key={scheme.scheme_id} className="scheme-card">
                <h3 className="scheme-title">{scheme.scheme_name}</h3>

                <div className="scheme-details">
                  <p><strong>Features:</strong></p>
                  <ul className="features-list">
                    {scheme.scheme_features
                      .split("\n")
                      .slice(0, isExpanded ? undefined : 3)
                      .map((feature, index) => (
                        feature.trim() && <li key={index}>{feature}</li>
                      ))}
                  </ul>

                  {scheme.scheme_features.split("\n").length > 3 && (
                    <button
                      className="read-more-btn"
                      onClick={() => toggleReadMore(scheme.scheme_id)}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}

                  <p><strong>Discount:</strong> {scheme.discount_percentage}% on {scheme.discount_applicable_on}</p>
                  <p><strong>Min Amount:</strong> ₹{scheme.scheme_min_amount}</p>
                  <p><strong>Duration:</strong> {scheme.scheme_start_date} to {scheme.scheme_end_date}</p>

                  {isExpanded && (
                    <>
                      <p><strong>Terms:</strong></p>
                      <ul className="terms-list">
                        {scheme.terms_condition.split("\n").map((term, index) => (
                          term.trim() && <li key={index}>{term}</li>
                        ))}
                      </ul>

                      <p><strong>User Benefits:</strong> {scheme.user_benefits}</p>
                    </>
                  )}

                  <button className="btn btn-secondary join-btn" onClick={() => handleJoinClick(scheme)}>Join</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && selectedScheme && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Join Scheme: {selectedScheme.scheme_name}</h3>
            <p><strong>Min Amount:</strong> ₹{selectedScheme.scheme_min_amount}</p>
            <p><strong>Discount:</strong> {selectedScheme.discount_percentage}%</p>

            <button className="btn btn-primary" onClick={redirectToRegister}>Register to Continue</button>
            <button className="btn btn-danger" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
