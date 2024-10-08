import React from "react";
import "./index.scss";

function Plan() {
  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      <div className="pricing-plans">
        <div className="pricing-plan">
          <h2>Basic</h2>
          <p>Free</p>
          <ul>
            <li>Basic functions</li>
          </ul>
          <button className="buy-button">Your Current Plan</button>
        </div>
        <div className="pricing-plan">
          <h2>Premium</h2>
          <p>$9.99/month</p>
          <ul>
            <li>Basic functions</li>
            <li>Calculate functions</li>
            <li>See statistics of your koi fish</li>
            <li>Support 24/7</li>
          </ul>
          <button className="buy-button">Buy</button>
        </div>
      </div>
    </div>
  );
}

export default Plan;
