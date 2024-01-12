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

import { formatFirstLetterToUpperCase } from "../../utils";
import { useShipContext } from "../../context/shipContext";
import NavigateRow from "./navigaterow/NavigateRow.jsx";
import { CloseOutlined } from "@ant-design/icons";

import fuelIcon from "../../assets/icons/fuel.svg";
import cargoIcon from "../../assets/icons/cargo.svg";
import wrenchIcon from "../../assets/icons/wrench.svg";
import fastForwardIcon from "../../assets/icons/fast-forward.svg";
import fastBackwardIcon from "../../assets/icons/fast-backward.svg";
import burnIcon from "../../assets/icons/burn.svg";
import eyeSlashIcon from "../../assets/icons/eye-slash.svg";

import "./navigate.css";

const Dialog = ({ isOpen, onClose, ship }) => {
  const { shipData, updateNavigationMode, listWaypoints, fuel } =
    useShipContext();

  const [status, setStatus] = useState(
    shipData?.nav?.status || ship.nav.status
  );
  const [flightMode, setFlightMode] = useState(
    shipData?.flightMode || ship.nav.flightMode
  );
  const [changeWaypoint, setChangeWaypoint] = useState(
    shipData?.nav?.waypointSymbol || ship.nav.waypointSymbol
  );
  const [isOrbited, setIsOrbited] = useState(
    shipData?.nav?.status === "IN_ORBIT" || ship.nav.status === "IN_ORBIT"
  );

  const [waypoints, setWaypoints] = useState([]);
  const [shipProps, setShipProps] = useState({});

  const fetchAllSystem = async () => {
    const response = await listWaypoints(ship.nav.systemSymbol, {
      limit: 20,
      page: "",
    });
    const pages = Math.ceil(response.meta.total / response.meta.limit);
    console.log(pages);

    let fetchedWaypoints = response.data;

    for (let i = 2; i <= pages; i++) {
      const waypoints = await listWaypoints(ship.nav.systemSymbol, {
        limit: 20,
        page: i,
      });
      fetchedWaypoints = [...fetchedWaypoints, ...waypoints.data];
    }

    localStorage.setItem(
      ship.nav.systemSymbol,
      JSON.stringify(fetchedWaypoints)
    );
    setWaypoints(fetchedWaypoints);
  };

  const handleClickMode = async (mode) => {
    try {
      await updateNavigationMode(ship.symbol, mode);
    } catch (error) {
      console.error("Error in navigation operation", error);
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
    const localSystem = localStorage.getItem(ship.nav.systemSymbol);

    localSystem ? setWaypoints(JSON.parse(localSystem)) : fetchAllSystem();

    setShipProps({
      ...shipProps,
      symbol: ship.symbol,
      x: ship.nav.route.destination.x,
      y: ship.nav.route.destination.y,
      fuel: ship.fuel,
      speed: ship.engine.speed,
      waypoint: ship.nav.waypointSymbol,
    });
  }, []);

  useEffect(() => {
    if (shipData) {
      setStatus(shipData?.nav?.status || ship.nav.status);
      setFlightMode(shipData?.flightMode || ship.nav.flightMode);
      setChangeWaypoint(
        shipData?.nav?.waypointSymbol || ship.nav.waypointSymbol
      );
      setIsOrbited(
        shipData?.nav?.status === "IN_ORBIT" || ship.nav.status === "IN_ORBIT"
      );
    }
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
                  <div className="navigate-info-wrapper">
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
                  </div>
                  <div className="navigate-state">
                    <ul className="navigate-state__list">
                      <li className="navigate-state__item">
                        <p>Fuel</p>
                        <div className="navigate-state__item-value-container">
                          <img src={fuelIcon} alt="Fuel Icon" />
                          <span className="navigate-state__item-value">
                            {fuel.current} / {ship.fuel.capacity}
                          </span>
                        </div>
                      </li>
                      <li className="navigate-state__item">
                        <p>Cargo</p>
                        <div className="navigate-state__item-value-container">
                          <img src={cargoIcon} alt="Cargo Icon" />
                          <span className="navigate-state__item-value">
                            {ship.cargo.units} / {ship.cargo.capacity}
                          </span>
                        </div>
                      </li>
                      <li className="navigate-state__item">
                        <p>Condition</p>
                        <div className="navigate-state__item-value-container">
                          <img src={wrenchIcon} alt="Wrench Icon" />
                          <span className="navigate-state__item-value">
                            {ship.frame.condition} / 100
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="navigate-buttons">
                  <div className="navigate-flight-mode">
                    <ul className="navigate-mode-list">
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("CRUISE")}
                        >
                          <img src={fastForwardIcon} alt="Fast Forward Icon" />
                          Cruise
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("DRIFT")}
                        >
                          <img
                            src={fastBackwardIcon}
                            alt="Fast Backward Icon"
                          />
                          Drift
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("BURN")}
                        >
                          <img src={burnIcon} alt="Burn Icon" />
                          Burn
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button
                          className="navigate-btn__mode-secondary"
                          onClick={() => handleClickMode("STEALTH")}
                        >
                          <img src={eyeSlashIcon} alt="Eye Slash Icon" />
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
                      <th style={{ width: "20%" }}>Distance (Time)</th>
                      <th style={{ width: "15%" }}>Type</th>
                      <th style={{ width: "30%" }}>Traits</th>
                      <th style={{ width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {waypoints.map((waypoint) => (
                      <NavigateRow
                        key={waypoint.symbol}
                        shipProps={shipProps}
                        waypoint={waypoint}
                        flightMode={flightMode}
                        isOrbited={isOrbited}
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
