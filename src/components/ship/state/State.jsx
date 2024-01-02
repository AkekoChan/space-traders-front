import React, { useEffect, useState } from "react";
import { useShipContext } from "../../../context/shipContext";

import "../ship.css";
import "./state.css";

import fuel from "../../../assets/icons/fuel.svg";
import cargo from "../../../assets/icons/cargo.svg";
import wrench from "../../../assets/icons/wrench.svg";

const State = ({ data }) => {
  const { shipData, refuelShip } = useShipContext();
  const [isFull, setIsFull] = useState(false);
  const [isDocked, setIsDocked] = useState(
    shipData && shipData.nav ? shipData.nav.status : data.nav.status
  );
  const [fuelCapacity, setFuelCapacity] = useState(data.fuel.current);

  useEffect(() => {
    if (shipData && shipData.nav) {
      setIsDocked(shipData.nav.status);
    }
    if (data.fuel.current === data.fuel.capacity) {
      setIsFull(true);
    }
  });

  const handleClickRefuel = async () => {
    if (isFull || isDocked === "IN_ORBIT" || isDocked === "IN_TRANSIT") {
      return;
    }
    try {
      const res = await refuelShip(data.symbol);
      setIsFull(res.fuel.current === res.fuel.capacity);
      setFuelCapacity(res.fuel.current);
    } catch (error) {
      console.error("Error in refuel operation", error);
    }
  };
  return (
    <div className="ship-state">
      <h3 className="ship-state__title">State</h3>
      <ul className="ship-state__list">
        <li className="ship-state__item">
          <p>Fuel</p>
          <div className="ship-state__item-value-container">
            <img src={fuel} alt="Fuel Icon" />
            <span className="ship-state__item-value">
              {fuelCapacity} / {data.fuel.capacity}
            </span>
          </div>
          <button
            className="ship-state__item-button"
            onClick={handleClickRefuel}
            disabled={isFull || isDocked === "IN_ORBIT"}
          >
            Refuel
          </button>
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
