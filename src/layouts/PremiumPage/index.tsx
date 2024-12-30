import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const PremiumPage = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const plans = [
    {
      id: "1",
      title: "1 Month Plan",
      price: "$5/month",
      payNow: "$5 after 7 days",
      features: [
        "Unlimited access to the book library",
        "Offline reading support",
        "Weekly new book updates",
      ],
    },
    {
      id: "6",
      title: "6 Months Plan",
      price: "$4.17/month",
      payNow: "$25 after 7 days",
      features: [
        "All features of the 1-month plan",
        "1 free month included",
        "Special gift: exclusive ebook",
      ],
    },
    {
      id: "12",
      title: "1 Year Plan",
      price: "$3.33/month",
      payNow: "$40 after 7 days",
      features: [
        "All features of the 6-month plan",
        "2 free months included",
        "VIP membership privileges",
      ],
    },
  ];

  const handleSubscribe = (planId: string) => {
    if (!accessToken) {
      alert("Bạn cần đăng nhập để đăng ký gói dịch vụ này.");
      return;
    }

    console.log(`User ${userInfo?.name || "Unknown"} đăng ký gói ${planId}`);
    alert(`Đăng ký gói ${planId} thành công!`);
  };

  return (
    <div
      className="premium-page"
      style={{ padding: "20px", marginTop: "20px", height: "80vh" }}>
      <h1>Choose a plan for after your 7-day free trial</h1>
      <div
        className="plans-container"
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginTop: "70px",
        }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="plan-card"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              maxWidth: "300px",
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255,0.6)",
              boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
            }}>
            <h2>{plan.title}</h2>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {plan.price}
            </p>
            <p
              style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#888" }}>
              {plan.payNow}
            </p>
            <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleSubscribe(plan.id)}>
              Try Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumPage;
