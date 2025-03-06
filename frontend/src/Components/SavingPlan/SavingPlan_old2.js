import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import "./SavingPlan.css";

const SavingPlan = () => {
  const [mobile, setMobile] = useState("");
  const [userData, setUserData] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [hasHistory, setHasHistory] = useState(false);
  const navigate = useNavigate();

  // ✅ List of schemes that require "Installment Amount" instead of "Saving Amount"
  const installmentSchemes = [
    "SadāShrī Jewelkart 11-Month Direct Purchase Plan",
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser);
      setMobile(storedUser.phone);
      checkTransactionHistory(storedUser.id);
    }

    const storedScheme = JSON.parse(localStorage.getItem("selectedScheme"));
    if (storedScheme) {
      setSelectedScheme(storedScheme.scheme_name);
    }
  }, []);

  // ✅ Fetch transaction history and last installment amount if available
  const checkTransactionHistory = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost/Schemes/Backend/checkHistory.php",
        {
          user_id: userId,
        }
      );

      if (response.data.status === "success" && response.data.hasTransactions) {
        setHasHistory(true);

        // ✅ Prefill last installment amount if available
        if (response.data.last_installment_amount) {
          setSavingAmount(response.data.last_installment_amount);
        }
      } else {
        setHasHistory(false);
      }
    } catch (error) {
      console.error("Error checking transaction history:", error);
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedScheme");
    window.alert("You have been logged out! Redirecting to Home Page...");
    navigate("/");
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      window.alert("Please enter a valid mobile number to fetch user details.");
      return;
    }

    const transactionData = {
      user_id: userData.id,
      scheme: selectedScheme,
    };

    if (installmentSchemes.includes(selectedScheme)) {
      transactionData.installment_amount = savingAmount;
    } else {
      transactionData.saving_amount = savingAmount;
    }

    try {
      const response = await axios.post(
        "http://localhost/Schemes/Backend/saveTransaction.php",
        transactionData
      );

      if (response.data.status === "success") {
        setHasHistory(true);
      }

      window.alert(response.data.message);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  return (
    <div className="container">
      {/* ✅ User Info & Logout */}
      <div className="header-container">
        {userData && (
          <>
            <div className="user-info">
              <p className="user-name">Name: {userData.name}</p>
              <p className="user-email">Email: {userData.email}</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt size={24} color="red" /> Logout
            </button>
          </>
        )}
      </div>

      <div className="card">
        <div className="d-flex justify-content-between">
          <Link to="/schemes" className="btn btn-primary">
            Schemes
          </Link>

          {/* ✅ Show History button only if user has transactions */}
          {hasHistory && (
            <Link to="/history" className="btn btn-secondary">
              History
            </Link>
          )}
        </div>

        <h2 className="form-title">Schemes</h2>
        <p className="form-subtitle">Turn Your Jewellery Desire into Reality</p>

        <form className="form" onSubmit={handleSubmit}>
          {/* ✅ Scheme Selection */}
          <div className="form-group">
            <label>Scheme</label>
            {selectedScheme ? (
              <input
                type="text"
                className="input-field"
                value={selectedScheme}
                readOnly
              />
            ) : (
              <select
                className="input-field"
                onChange={(e) => setSelectedScheme(e.target.value)}
              >
                <option value="">Select Plan</option>
                <option value="daily_gold_and_silver_savings">
                  Daily Gold & Silver Savings
                </option>
                <option value="daily_silver_savings">
                  Daily Silver Savings
                </option>
              </select>
            )}
          </div>

          {/* ✅ Mobile Number */}
          <div className="form-group">
            <label>Mobile No.</label>
            <input
              type="tel"
              className="input-field"
              placeholder="E.g 9146265687"
              value={mobile}
              disabled
            />
          </div>

          {/* ✅ Dynamic Field (Saving Amount or Installment Amount) */}
          <div className="form-group">
            <label>
              {installmentSchemes.includes(selectedScheme)
                ? "Installment Amount"
                : "Saving Amount"}
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="Enter amount"
              value={savingAmount}
              onChange={(e) => setSavingAmount(e.target.value)}
            />
          </div>

          {/* ✅ Show Name & Email if user exists */}
          {userData && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={userData.name}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={userData.email}
                  readOnly
                />
              </div>
            </>
          )}

          {/* ✅ Submit Button */}
          <div className="full-width">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingPlan;
