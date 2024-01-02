import React from "react";

import "./extract.css";

const Extract = () => {
  return (
    <div className="extract">
      <div className="extract__wrapper">
        <button className="extract__button">Extract Ressources</button>
        <div className="extract__cooldown">
          <div className="cooldown-bar-container">
            <div className="time-bar"></div>
          </div>
          <span className="cooldown-label">0s</span>
        </div>
      </div>
    </div>
  );
};

export default Extract;
