import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.css"; // Import the scoped styles

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      fetchTransactionHistory(storedUser.id);
    }
  }, []);

  const fetchTransactionHistory = async (userId) => {
    try {
      const response = await axios.post("http://localhost/Schemes/Backend/getHistory.php", {
        user_id: userId,
      });

      if (response.data.status === "success") {
        setTransactions(response.data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
    setLoading(false);
  };

  return (
    <div className="history-container">
      <h2 className="history-title">Transaction History</h2>

      {loading ? (
        <p className="history-message">Loading...</p>
      ) : transactions.length > 0 ? (
        <table className="history-table">
          <thead>
            <tr>
              <th>Sl no</th>
              <th>Scheme</th>
              <th>Order Id</th>
              <th>Payment Id</th>
              <th>Saving Amount</th>
              <th>Installment Amount</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
  {transactions.map((transaction, index) => (
    <tr key={index}>
      <td>{index + 1}</td> {/* Auto-incremented Serial Number */}
      <td>{transaction.scheme}</td>
      <td>{transaction.order_id}</td>
      <td>{transaction.payment_id}</td>
      <td>{transaction.saving_amount}</td>
      <td>{transaction.installment_amount}</td>
      <td>{transaction.created_at}</td>
    </tr>
  ))}
</tbody>

        </table>
      ) : (
        <p className="history-message">No transactions found.</p>
      )}
    </div>
  );
};

export default History;
