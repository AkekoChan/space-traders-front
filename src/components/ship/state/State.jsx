import React, { useEffect, useState } from "react";
import { useShipContext } from "../../../context/shipContext";
import "../ship.css";
import "./state.css";
import fuelIcon from "../../../assets/icons/fuel.svg";
import cargoIcon from "../../../assets/icons/cargo.svg";
import wrenchIcon from "../../../assets/icons/wrench.svg";

const State = ({ data }) => {
  const {
    shipData,
    refuelShip,
    updateFuel,
    fuel,
    getFuel,
    statusNavigation,
    updateStatusNavigation,
  } = useShipContext();

  const [isFull, setIsFull] = useState();
  const [cargoUnits, setCargoUnits] = useState();

  useEffect(() => {
    if (shipData?.nav) {
      updateStatusNavigation(shipData.nav.status);
    }
    if (fuel === data.fuel.capacity) {
      setIsFull(true);
    }
    if (shipData?.cargo) {
      setCargoUnits(shipData.cargo.units);
    }
  }, [shipData, fuel]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fuelData = await getFuel(data.symbol);
        if (fuelData) {
          updateFuel(fuelData);
          setIsFull(fuelData.current === data.fuel.capacity);
        }
      } catch (error) {
        console.error("Error fetching fuel data", error);
      }
    };

    updateStatusNavigation(data.nav.status);
    setCargoUnits(data.cargo.units);
    setIsFull(data.fuel.current === data.fuel.capacity);
    fetchData();
  }, [data.symbol]);

  const handleClickRefuel = async () => {
    if (
      isFull ||
      statusNavigation === "IN_ORBIT" ||
      statusNavigation === "IN_TRANSIT"
    ) {
      return;
    }
    try {
      const res = await refuelShip(data.symbol);
      updateFuel(res.fuel);
      setIsFull(res.fuel.current === res.fuel.capacity);
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
              {fuel?.current ?? "N/A"} / {data.fuel.capacity}
            </span>
          </div>
          <button
            className="ship-state__item-button"
            onClick={handleClickRefuel}
            disabled={
              isFull ||
              statusNavigation === "IN_ORBIT" ||
              statusNavigation === "IN_TRANSIT"
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
