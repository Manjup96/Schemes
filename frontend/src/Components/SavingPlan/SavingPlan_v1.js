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
        alert("Please enter a valid mobile number to fetch user details.");
        return;
    }

    // Check if the user selected a valid scheme
    if (!selectedScheme) {
        alert("Please select a scheme.");
        return;
    }

    // Convert amount to float and validate
    let amount = parseFloat(savingAmount);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Determine whether it's saving or installment scheme
    const isInstallmentScheme = installmentSchemes.includes(selectedScheme);
    const requestData = {
        user_id: userData.id,
        scheme: selectedScheme,
        saving_amount: isInstallmentScheme ? 0 : amount, // Store only if saving scheme
        installment_amount: isInstallmentScheme ? amount : 0, // Store only if installment scheme
    };

    try {
        const response = await axios.post(
            "http://127.0.0.1/Schemes/Backend/createOrder.php",
            requestData
        );

        if (response.data.status === "success") {
            const options = {
                key: "rzp_live_VXenWuBxkeRLy6",
                amount: response.data.amount * 100, // Convert to paise
                currency: "INR",
                name: "SadāShrī Jewelkart",
                description: "Secure Payment",
                order_id: response.data.order_id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(
                            "http://127.0.0.1/Schemes/Backend/verifyPayment.php",
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                user_id: userData.id,
                                scheme: selectedScheme,
                                saving_amount: requestData.saving_amount,
                                installment_amount: requestData.installment_amount
                            }
                        );

                        if (verifyResponse.data.status === "success") {
                            setHasHistory(true);
                            alert("Payment successful! Transaction saved.");
                        } else {
                            alert("Payment verification failed: " + verifyResponse.data.message);
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Payment verification failed. Check console for details.");
                    }
                },
                prefill: {
                    name: userData.name,
                    email: userData.email,
                    contact: mobile,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error("Transaction error:", error);
        alert("Network error. Please check backend connectivity.");
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
              Pay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingPlan;
