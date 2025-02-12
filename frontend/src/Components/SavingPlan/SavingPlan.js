import React from "react";
import "./SavingPlan.css"; 

const SavingPlan = () => {
  return (
    <div className="container">
      <div className="card">
        <h2 className="form-title">Choose Jewellery Plan</h2>
        <form className="form">
          {/* Select Plan */}
          <div className="form-group">
            <label>Select Plan</label>
            <select className="input-field">
              <option value="">Choose a plan</option>
              <option value="daily_gold_and_sliver_savings">Daily Gold and Silver Savings Scheme</option>
              <option value="daily_sliver_savings">Daily Silver Savings Scheme</option>
            </select>
          </div>

          {/* Saving Amount */}
          <div className="form-group">
            <label>Saving Amount</label>
            <input type="number" className="input-field" placeholder="Enter amount" />
          </div>

          {/* EMI Amount */}
          <div className="form-group">
            <label>EMI Amount</label>
            <input type="number" className="input-field" placeholder="Enter EMI amount" />
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="tel" className="input-field" placeholder="Enter mobile number" />
          </div>

          {/* Submit Button */}
          <button className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SavingPlan;
