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
  const [autoPay, setAutoPay] = useState(false);
  const navigate = useNavigate();

  const installmentSchemes = ["SadāShrī Jewelkart 11-Month Direct Purchase Plan"];

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
      const response = await axios.post("http://localhost/Schemes/Backend/checkHistory.php", { user_id: userId });
      if (response.data.status === "success" && response.data.hasTransactions) {
        setHasHistory(true);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedScheme");
    window.alert("You have been logged out! Redirecting to Home Page...");
    navigate("/");
  };

  const scheduleAutoPayments = async (userId, amount) => {
    try {
      await axios.post("http://127.0.0.1/Schemes/Backend/scheduleAutoPayments.php", {
        user_id: userId,
        scheme: selectedScheme,
        installment_amount: amount,
        months: 10, // Schedule for next 10 months
      });

      alert("Auto Payment scheduled for the next 10 months!");
    } catch (error) {
      console.error("Error scheduling auto payments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData || !selectedScheme) {
      alert("Please select a valid scheme and enter details.");
      return;
    }

    let amount = parseFloat(savingAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const isInstallmentScheme = installmentSchemes.includes(selectedScheme);
    const requestData = {
      user_id: userData.id,
      scheme: selectedScheme,
      saving_amount: isInstallmentScheme ? 0 : amount,
      installment_amount: isInstallmentScheme ? amount : 0,
      auto_pay: autoPay ? 1 : 0,
    };

    try {
      const response = await axios.post("http://127.0.0.1/Schemes/Backend/createOrder.php", requestData);

      if (response.data.status === "success") {
        const options = {
          key: "rzp_live_VXenWuBxkeRLy6",
          amount: response.data.amount * 100,
          currency: "INR",
          name: "SadāShrī Jewelkart",
          order_id: response.data.order_id,
          handler: async function (response) {
            try {
              const verifyResponse = await axios.post("http://127.0.0.1/Schemes/Backend/verifyPayment.php", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_id: userData.id,
                scheme: selectedScheme,
                saving_amount: requestData.saving_amount,
                installment_amount: requestData.installment_amount,
                auto_pay: autoPay ? 1 : 0,
              });

              if (verifyResponse.data.status === "success") {
                setHasHistory(true);
                alert("Payment successful! Transaction saved.");
                if (autoPay) {
                  scheduleAutoPayments(userData.id, amount);
                }
              } else {
                alert("Payment verification failed: " + verifyResponse.data.message);
              }
            } catch (error) {
              console.error("Verification error:", error);
            }
          },
          prefill: { name: userData.name, email: userData.email, contact: mobile },
          theme: { color: "#3399cc" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Transaction error:", error);
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
          {userData && hasHistory && <Link to="/history" className="btn btn-secondary">History</Link>}
        </div>

        <h2 className="form-title">Schemes</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Scheme</label>
            <input type="text" className="input-field" value={selectedScheme} readOnly />
          </div>

          <div className="form-group">
            <label>Mobile No.</label>
            <input type="tel" className="input-field" value={mobile} disabled />
          </div>

          <div className="form-group">
            <label>{installmentSchemes.includes(selectedScheme) ? "Installment Amount" : "Saving Amount"}</label>
            <input type="number" className="input-field" value={savingAmount} onChange={(e) => setSavingAmount(e.target.value)} />
          </div>

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

          {installmentSchemes.includes(selectedScheme) && (
            <div className="form-group mt-3">
              <input type="checkbox" checked={autoPay} onChange={(e) => setAutoPay(e.target.checked)} />
              <label className="mt-4"> Auto Payment for Next Months</label>
            </div>
          )}

          <div className="full-width">
            <button type="submit" className="submit-btn">Pay</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingPlan;
