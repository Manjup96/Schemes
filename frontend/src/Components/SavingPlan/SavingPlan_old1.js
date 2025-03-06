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

  const checkTransactionHistory = async (userId) => {
    try {
      const response = await axios.post("http://localhost/Schemes/Backend/checkHistory.php", {
        user_id: userId,
      });

      setHasHistory(response.data.status === "success" && response.data.hasTransactions);
    } catch (error) {
      console.error("Error checking transaction history:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedScheme");
    window.alert("You have been logged out! Redirecting to Home Page...");
    navigate("/");
  };

  const handlePayment = async () => {
    if (!savingAmount || savingAmount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      // Step 1: Create an order in Razorpay
      const orderResponse = await axios.post("http://localhost/Schemes/Backend/createOrder.php", {
        amount: savingAmount,
      });

      if (orderResponse.data.status !== "success") {
        alert("Failed to create order");
        return;
      }

      const { order_id, amount } = orderResponse.data;

      // Step 2: Open Razorpay Payment Window
      const options = {
        key: "rzp_live_u06TaXfHPjw0dN",
        amount: amount * 100,
        currency: "INR",
        name: "SadāShrī Jewelkart",
        description: "Savings Plan Payment",
        order_id: order_id,
        handler: async (response) => {
          // Step 3: Save Transaction After Payment
          await axios.post("http://localhost/Schemes/Backend/saveTransaction.php", {
            user_id: userData.id,
            scheme: selectedScheme,
            saving_amount: savingAmount,
            transaction_id: response.razorpay_payment_id,
          });

          alert("Payment Successful");
          setHasHistory(true);
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: mobile,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error processing payment");
    }
  };

  return (
    <div className="container">
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
          <Link to="/schemes" className="btn btn-primary">Schemes</Link>
          {hasHistory && <Link to="/history" className="btn btn-secondary">History</Link>}
        </div>

        <h2 className="form-title">Schemes</h2>
        <form className="form">
          <div className="form-group">
            <label>Scheme</label>
            <input type="text" className="input-field" value={selectedScheme} readOnly />
          </div>

          <div className="form-group">
            <label>Mobile No.</label>
            <input type="tel" className="input-field" value={mobile} readOnly />
          </div>

          <div className="form-group">
            <label>Saving Amount</label>
            <input
              type="number"
              className="input-field"
              placeholder="Enter amount"
              value={savingAmount}
              onChange={(e) => setSavingAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" className="input-field" value={userData?.name || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input-field" value={userData?.email || ""} readOnly />
          </div>

          <div className="full-width">
            <button type="button" className="submit-btn" onClick={handlePayment}>
              Pay & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingPlan;
