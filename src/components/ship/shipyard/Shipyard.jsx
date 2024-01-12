import React, { useState, useEffect } from "react";

import { useShipContext } from "../../../context/shipContext";
import { useAuthContext } from "../../../context/authContext";

import fuelIcon from "../../../assets/icons/fuel.svg";
import cargoIcon from "../../../assets/icons/cargo.svg";

import "./shipyard.css";

const Shipyard = ({ data }) => {
  const {
    shipyard,
    getShipyard,
    shipData,
    statusNavigation,
    updateStatusNavigation,
    buyShip,
  } = useShipContext();
  const { agent, updateAgent } = useAuthContext();
  const [waypoint, setWaypoint] = useState("");

  const purchaseShip = (ship) => {
    buyShip(ship.type, waypoint);
    updateAgent();
  };

  const canBuyShip = (ship) => {
    return agent.credits >= ship.purchasePrice && statusNavigation === "DOCKED";
  };

  const renderBuyButton = (ship) => {
    return (
      <button
        className="shipyard-price__button"
        disabled={!canBuyShip(ship)}
        onClick={() => {
          if (canBuyShip(ship)) {
            purchaseShip(ship);
          }
        }}
      >
        Buy
      </button>
    );
  };

  useEffect(() => {
    if (shipData?.nav) {
      const { systemSymbol, waypointSymbol, status } = shipData.nav;
      getShipyard(systemSymbol, waypointSymbol);
      updateStatusNavigation(status);
      setWaypoint(waypointSymbol);
    }
  }, [shipData]);

  useEffect(() => {
    const { systemSymbol, waypointSymbol } = data.nav;
    getShipyard(systemSymbol, waypointSymbol);
    setWaypoint(waypointSymbol);
  }, []);

  return (
    <div className="shipyard-container">
      {shipyard ? (
        <div className="shipyard">
          {shipyard.ships.map((ship, index) => (
            <div key={index} className="shipyard-card">
              <p className="shipyard-name">{ship.name}</p>
              <div className="shipyard-capacity-container">
                <p className="shipyard-capacity">
                  <img src={cargoIcon} alt="cargo icon" />
                  {ship.crew.capacity}
                </p>
                <p className="shipyard-capacity">
                  <img src={fuelIcon} alt="fuel icon" />
                  {ship.frame.fuelCapacity}
                </p>
              </div>
              <div className="shipyard-price">
                <p className="shipyard-price__text">{ship.purchasePrice}</p>
                {renderBuyButton(ship)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "#fff" }}>No shipyard...</p>
      )}
    </div>
  );
};

export default Shipyard;
