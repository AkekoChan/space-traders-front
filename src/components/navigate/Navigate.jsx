import React, { useState, useEffect } from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
} from "@floating-ui/react";

import { formatFirstLetterToUpperCase, distance } from "../../utils";
import { useShipContext } from "../../context/shipContext";

import "./navigate.css";

import {
  CloseOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";

import fuel from "../../assets/icons/fuel.svg";
import cargo from "../../assets/icons/cargo.svg";
import wrench from "../../assets/icons/wrench.svg";
import fastForwad from "../../assets/icons/fast-forward.svg";
import fastBackward from "../../assets/icons/fast-backward.svg";
import burn from "../../assets/icons/burn.svg";
import eyeSlash from "../../assets/icons/eye-slash.svg";

import NavigateRow from "./navigaterow/NavigateRow.jsx";

const Dialog = ({ isOpen, onClose, ship }) => {
  const {
    shipData,
    orbitShip,
    dockShip,
    updateNavigationMode,
    refuelShip,
    fetchSystemWaypoints,
  } = useShipContext();
  const [coordinatesShip, setCoordinatesShip] = useState({});
  const [status, setStatus] = useState(
    shipData && shipData.nav ? shipData.nav.status : ship.nav.status
  );
  const [flightMode, setFlightMode] = useState(
    shipData && shipData.flightMode ? shipData.flightMode : ship.nav.flightMode
  );
  const [changeWaypoint, setChangeWaypoint] = useState(
    shipData && shipData.nav
      ? shipData.nav.waypointSymbol
      : ship.nav.waypointSymbol
  );
  const [isOrbited, setIsOrbited] = useState(ship.nav.status === "IN_ORBIT");
  const [isFull, setIsFull] = useState(false);
  const [fuelCapacity, setFuelCapacity] = useState(ship.fuel.current);
  const [sortOrder, setSortOrder] = useState("asc");
  const [waypoints, setWaypoints] = useState(
    JSON.parse(localStorage.getItem("waypoints"))
  );

  const sortWaypoints = (waypoints, order) => {
    return waypoints.slice().sort((a, b) => {
      const distanceA = distance(
        a.x,
        a.y,
        coordinatesShip.x,
        coordinatesShip.y
      );
      const distanceB = distance(
        b.x,
        b.y,
        coordinatesShip.x,
        coordinatesShip.y
      );

      return order === "asc" ? distanceA - distanceB : distanceB - distanceA;
    });
  };

  const sortedWaypoints = sortWaypoints(waypoints, sortOrder);

  const handleSortByDistance = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
  };

  const handleClickOrbit = async () => {
    try {
      if (isOrbited) {
        console.log(isOrbited);
        await dockShip(ship.symbol);
        setIsOrbited(false);
      } else {
        console.log(isOrbited);
        await orbitShip(ship.symbol);
        setIsOrbited(true);
      }
    } catch (error) {
      console.error("Error in orbit/dock operation", error);
    }
  };

  const handleClickMode = async (mode) => {
    try {
      await updateNavigationMode(ship.symbol, mode);
    } catch (error) {
      console.error("Error in navigation operation", error);
    }
  };

  const handleClickRefuel = async () => {
    if (isFull || status === "IN_ORBIT" || status === "IN_TRANSIT") {
      return;
    }
    try {
      const res = await refuelShip(ship.symbol);
      setIsFull(res.fuel.current === res.fuel.capacity);
      setFuelCapacity(res.fuel.current);
    } catch (error) {
      console.error("Error in refuel operation", error);
    }
  };

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: onClose,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
  });
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  useEffect(() => {
    if (shipData && shipData.nav) {
      setStatus(shipData.nav.status);
    }

    if (shipData && shipData.flightMode) {
      setFlightMode(shipData.flightMode);
    }

    if (shipData && shipData.nav) {
      setIsOrbited(shipData.nav.status === "IN_ORBIT");
    }

    if (fuelCapacity === ship.fuel.capacity) {
      setIsFull(true);
    }

    if (
      shipData &&
      shipData.fuel &&
      shipData.fuel.current === ship.fuel.capacity
    ) {
      setFuelCapacity(true);
    }

    if (shipData && shipData.fuel) {
      setFuelCapacity(shipData.fuel.current);
    }

    if (shipData && shipData.nav) {
      setChangeWaypoint(shipData.nav.waypointSymbol);
    }

    if (!waypoints) {
      const fetchWaypoints = async () => {
        await fetchSystemWaypoints(ship.nav.systemSymbol);
      };
      fetchWaypoints();
    }

    setCoordinatesShip({
      x: ship.nav.route.destination.x,
      y: ship.nav.route.destination.y,
    });
  }, [shipData]);

  return (
    <>
      {isOpen && (
        <FloatingOverlay
          lockScroll
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            padding: "1.5rem",
            zIndex: 1000,
          }}
        >
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              className="navigate"
            >
              <div className="navigate-container">
                <div className="navigate-header">
                  <h2 className="navigate-title">
                    Ship Navigate:{" "}
                    <span className="navigate-ship-name">{ship.symbol}</span>
                  </h2>
                  <button onClick={onClose} className="navigate-close-button">
                    <CloseOutlined
                      style={{ fontSize: "1.5rem", color: "#fff" }}
                    />
                  </button>
                </div>
                <div className="navigate-info-container">
                  <div className="navigate-info">
                    <p>System</p>
                    <span className="navigate-system badge-gradient">
                      {ship.nav.systemSymbol}
                    </span>
                  </div>
                  <div className="navigate-info">
                    <p>Waypoint</p>
                    <span className="navigate-waypoint badge-gradient">
                      {changeWaypoint}
                    </span>
                  </div>
                  <div className="navigate-status">
                    <div className="navigate-badges">
                      {status === "IN_ORBIT" ? (
                        <span className="badge-gray">In orbit</span>
                      ) : status === "DOCKED" ? (
                        <span className=" badge-gray">Docked</span>
                      ) : (
                        <span className="badge-gray">In transit</span>
                      )}
                      <span className="badge-gray">
                        {formatFirstLetterToUpperCase(flightMode)}
                      </span>
                    </div>
                  </div>
                  <div className="navigate-state">
                    <ul className="navigate-state__list">
                      <li className="navigate-state__item">
                        <p>Fuel</p>
                        <div className="navigate-state__item-value-container">
                          <img src={fuel} alt="Fuel Icon" />
                          <span className="navigate-state__item-value">
                            {fuelCapacity} / {ship.fuel.capacity}
                          </span>
                        </div>
                        <button
                          className="navigate-sate__item-button"
                          onClick={handleClickRefuel}
                          disabled={
                            isFull ||
                            status === "IN_ORBIT" ||
                            status === "IN_TRANSIT"
                          }
                        >
                          Refuel
                        </button>
                      </li>
                      <li className="navigate-state__item">
                        <p>Cargo</p>
                        <div className="navigate-state__item-value-container">
                          <img src={cargo} alt="Cargo Icon" />
                          <span className="navigate-state__item-value">
                            {ship.cargo.units} / {ship.cargo.capacity}
                          </span>
                        </div>
                      </li>
                      <li className="navigate-state__item">
                        <p>Condition</p>
                        <div className="navigate-state__item-value-container">
                          <img src={wrench} alt="Wrench Icon" />
                          <span className="navigate-state__item-value">
                            {ship.frame.condition} / 100
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="navigate-buttons">
                  <button
                    className="navigate-btn__mode-primary"
                    onClick={handleClickOrbit}
                  >
                    {isOrbited ? "Dock" : "Orbit"}
                  </button>
                  <div className="navigate-flight-mode">
                    <ul className="navigate-mode-list">
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("CRUISE")}
                        >
                          <img src={fastForwad} alt="Fast Forward Icon" />
                          Cruise
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("DRIFT")}
                        >
                          <img src={fastBackward} alt="Fast Backward Icon" />
                          Drift
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("BURN")}
                        >
                          <img src={burn} alt="Burn Icon" />
                          Burn
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("STEALTH")}
                        >
                          <img src={eyeSlash} alt="Eye Slash Icon" />
                          Stealth
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="navigate-table-container">
                <table className="navigate-table">
                  <thead>
                    <tr>
                      <th style={{ width: "25%" }}>Waypoint</th>
                      <th style={{ width: "20%" }}>
                        Distance (Time)
                        <button
                          onClick={handleSortByDistance}
                          className="navigate-table__sort-button"
                        >
                          {sortOrder === "asc" ? (
                            <SortAscendingOutlined
                              style={{ color: "#fff", fontSize: "1.5rem" }}
                            />
                          ) : (
                            <SortDescendingOutlined
                              style={{ color: "#fff", fontSize: "1.5rem" }}
                            />
                          )}
                        </button>
                      </th>
                      <th style={{ width: "15%" }}>Type</th>
                      <th style={{ width: "30%" }}>Traits</th>
                      <th style={{ width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWaypoints.map((waypoint) => (
                      <NavigateRow
                        key={waypoint.symbol}
                        waypoint={waypoint}
                        coordinatesShip={coordinatesShip}
                        speedShip={ship.engine.speed}
                        symbolShip={ship.symbol}
                        waypointShip={ship.nav.waypointSymbol}
                        flightMode={flightMode}
                        isOrbited={!isOrbited}
                        fuel={fuelCapacity}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
};

export default Dialog;
