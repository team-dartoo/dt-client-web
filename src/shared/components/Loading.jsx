import React, { useState } from "react";
import "./loading.css";

const Loading = () => {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <div className="loading">
      <button className="primary-light-bg" onClick={simulateLoading}>
        로딩 시작
      </button>

      {loading && (
        <div className="loading-wrap">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Loading;
