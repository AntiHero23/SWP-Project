import React from "react";
import "./index.scss";

function Plan() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: ["Basic functions"],
      buttonText: "Your Current Plan",
    },
    {
      name: "Premium",
      price: "$9.99/month",
      features: [
        "Basic functions",
        "Calculate functions",
        "See statistics of your koi fish",
        "Support 24/7",
      ],
      buttonText: "Buy",
    },
  ];

  return (
    <div className="pricing-page">
      <h1>Pricing</h1>
      <div className="pricing-plans">
        {plans.map((plan) => (
          <div className="pricing-plan" key={plan.name}>
            <h2>{plan.name}</h2>
            <p>{plan.price}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button className="buy-button">{plan.buttonText}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Plan;
