import React from "react";

import "../ship.css";
import "./state.css";

import fuel from "../../../assets/icons/fuel.svg";
import cargo from "../../../assets/icons/cargo.svg";
import wrench from "../../../assets/icons/wrench.svg";

const State = ({ data }) => {
  return (
    <div className="ship-state">
      <h3 className="ship-state__title">State</h3>
      <ul className="ship-state__list">
        <li className="ship-state__item">
          <p>Fuel</p>
          <div className="ship-state__item-value-container">
            <img src={fuel} alt="Fuel Icon" />
            <span className="ship-state__item-value">
              {data.fuel.current} / {data.fuel.capacity}
            </span>
          </div>
          <button className="ship-state__item-button">Refuel</button>
        </li>
        <li className="ship-state__item">
          <p>Cargo</p>
          <div className="ship-state__item-value-container">
            <img src={cargo} alt="Cargo Icon" />
            <span className="ship-state__item-value">
              {data.cargo.units} / {data.cargo.capacity}
            </span>
          </div>
        </li>
        <li className="ship-state__item">
          <p>Condition</p>
          <div className="ship-state__item-value-container">
            <img src={wrench} alt="Wrench Icon" />
            <span className="ship-state__item-value">
              {data.frame.condition} / 100
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default State;
