import React, { useState, useEffect } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { formatFirstLetterToUpperCase, fetchData } from "../../../utils/index";

import fuelIcon from "../../../assets/icons/fuel.svg";
import cargoIcon from "../../../assets/icons/cargo.svg";

import {
  useFloating,
  offset,
  useDismiss,
  useInteractions,
  useClick,
} from "@floating-ui/react";

const ShipRow = ({ ship, token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOrbited, setIsOrbited] = useState();
  const [isStateChanged, setIsStateChanged] = useState("");

  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      offset({
        mainAxis: -5,
        crossAxis: -45,
      }),
    ],
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  useDismiss(context, {
    referencePress: true,
  });

  const click = useClick(context, {});

  const { getReferenceProps } = useInteractions([click]);

  useEffect(() => {
    setIsOrbited(ship.nav.status === "IN_ORBIT");
    setIsStateChanged(ship.nav.status);
    console.log();
  }, [ship.nav.status]);

  const handleOrbitClick = async () => {
    if (isStateChanged === "DOCKED") {
      const options = {
        endpoint: `my/ships/${ship.symbol}/orbit`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const data = await fetchData(options);

      setIsStateChanged(data.nav.status);
      setIsOrbited(true);

      console.log("Orbited");
    } else {
      const options = {
        endpoint: `my/ships/${ship.symbol}/dock`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const data = await fetchData(options);

      setIsStateChanged(data.nav.status);
      setIsOrbited(false);

      console.log("Docked");
    }
  };

  return (
    <tr>
      <td style={{ width: "15%" }}>
        <div className="fleet-table__symbol-container">
          <span className="fleet-table__symbol">{ship.symbol}</span>
          <span className="fleet-table__frame badge-gray">
            {ship.frame.name}
          </span>
        </div>
      </td>
      <td style={{ width: "20%" }}>
        <span className="fleet-table__system badge-gradient">
          {ship.nav.systemSymbol}
        </span>
      </td>
      <td style={{ width: "20%" }}>
        <span className="fleet-table__waypoint badge-gradient">
          {ship.nav.waypointSymbol}
        </span>
      </td>
      <td style={{ width: "15%" }}>
        <div className="fleet-table__status-container">
          {isStateChanged == "IN_TRANSIT" ? (
            <span className="fleet-table__status transit badge-gray">
              In transit
            </span>
          ) : isStateChanged == "IN_ORBIT" ? (
            <span className="fleet-table__status orbit badge-gray">
              In orbit
            </span>
          ) : (
            <span className="fleet-table__status docked badge-gray">
              Docked
            </span>
          )}
          <span className="fleet-table__flight-mode badge-gray">
            {formatFirstLetterToUpperCase(ship.nav.flightMode)}
          </span>
        </div>
      </td>
      <td style={{ width: "15%" }}>
        <div className="fleet-table__fuel-container">
          <img src={fuelIcon} alt="Icon fuel" />
          <span className="fleet-table__fuel">
            {ship.fuel.current} / {ship.fuel.capacity}
          </span>
        </div>
      </td>
      <td style={{ width: "10%" }}>
        <div className="fleet-table__cargo-container">
          <img src={cargoIcon} alt="Icon cargo" />
          <span className="fleet-table__fuel">
            {ship.cargo.units} / {ship.cargo.capacity}
          </span>
        </div>
      </td>
      <td style={{ width: "5%" }}>
        <button
          className="fleet-table__button"
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <EllipsisOutlined style={{ fontSize: "1.5rem", color: "#fff" }} />
        </button>
        {isOpen && (
          <div
            className="fleet-submenu"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getReferenceProps()}
          >
            <button
              className="fleet-submenu__button"
              onClick={handleOrbitClick}
            >
              {isOrbited ? "Dock" : "Orbit"}
            </button>
            {isOrbited ? (
              <button className="fleet-submenu__button">Navigate</button>
            ) : null}
          </div>
        )}
      </td>
    </tr>
  );
};

export default ShipRow;
