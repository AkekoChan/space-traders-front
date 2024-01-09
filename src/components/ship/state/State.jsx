import React, { useEffect, useState } from "react";
import { useShipContext } from "../../../context/shipContext";
import "../ship.css";
import "./state.css";
import fuelIcon from "../../../assets/icons/fuel.svg";
import cargoIcon from "../../../assets/icons/cargo.svg";
import wrenchIcon from "../../../assets/icons/wrench.svg";

const State = ({ data }) => {
  const { shipData, refuelShip } = useShipContext();

  const [isFull, setIsFull] = useState(
    data.fuel.current === data.fuel.capacity
  );
  const [isDocked, setIsDocked] = useState(data.nav.status);
  const [fuelCapacity, setFuelCapacity] = useState(data.fuel.current);
  const [cargoUnits, setCargoUnits] = useState(data.cargo.units);

  useEffect(() => {
    if (shipData && shipData.nav) {
      setIsDocked(shipData.nav.status);
    }
    if (data.fuel.current === data.fuel.capacity) {
      setIsFull(true);
    }
    if (shipData && shipData.fuel) {
      setFuelCapacity(shipData.fuel.current);
    }
    if (shipData && shipData.cargo) {
      setCargoUnits(shipData.cargo.units);
    }
  }, [shipData]);

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
            <img src={fuelIcon} alt="Fuel Icon" />
            <span className="ship-state__item-value">
              {fuelCapacity} / {data.fuel.capacity}
            </span>
          </div>
          <button
            className="ship-state__item-button"
            onClick={handleClickRefuel}
            disabled={
              isFull || isDocked === "IN_ORBIT" || isDocked === "IN_TRANSIT"
            }
          >
            Refuel
          </button>
        </li>
        <li className="ship-state__item">
          <p>Cargo</p>
          <div className="ship-state__item-value-container">
            <img src={cargoIcon} alt="Cargo Icon" />
            <span className="ship-state__item-value">
              {cargoUnits} / {data.cargo.capacity}
            </span>
          </div>
        </li>
        <li className="ship-state__item">
          <p>Condition</p>
          <div className="ship-state__item-value-container">
            <img src={wrenchIcon} alt="Wrench Icon" />
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
