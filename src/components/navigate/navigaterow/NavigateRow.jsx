import React, { useEffect, useState } from "react";

import { SendOutlined, EnvironmentOutlined } from "@ant-design/icons";

import { useShipContext } from "../../../context/shipContext";

import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
  distance,
  travelTime,
} from "../../../utils";

const NavigateRow = ({ waypoint, coordinatesShip, speedShip, flightMode }) => {
  const { shipData } = useShipContext();

  const [flightModeShip, setFlightModeShip] = useState(
    shipData && shipData.flightMode ? shipData.flightMode : flightMode
  );

  const multiplier = {
    CRUISE: 25,
    DRIFT: 250,
    BURN: 12.5,
    STEALTH: 30,
  };

  const distanceToWaypoint = distance(
    waypoint.x,
    waypoint.y,
    coordinatesShip.x,
    coordinatesShip.y
  );

  const timeToWaypoint = travelTime(
    distanceToWaypoint,
    multiplier[flightModeShip],
    speedShip
  );

  useEffect(() => {
    if (shipData && shipData.flightMode) {
      setFlightModeShip(shipData.flightMode);
    }
  }, [shipData]);

  return (
    <tr>
      <td className="navigate-table__waypoint">{waypoint.symbol}</td>
      <td className="navigate-table__distance">
        {distanceToWaypoint.toFixed(0)} <span>({timeToWaypoint}s)</span>
      </td>
      <td>
        <span className="badge-gray">
          {formatFirstLetterToUpperCase(
            replaceUnderscoreWithSpace(waypoint.type)
          )}
        </span>
      </td>
      <td>
        <div className="navigate-table__traits">
          {waypoint.traits.map((trait, index) => {
            if (trait.name === "Marketplace" || trait.name === "Shipyard") {
              return (
                <span className="badge-gray" key={index}>
                  {formatFirstLetterToUpperCase(trait.name)}
                </span>
              );
            }
            return null;
          })}
        </div>
      </td>
      <td>
        <button className="navigate-table__button">
          <SendOutlined style={{ fontSize: "1.5rem", color: "#171c21" }} />
        </button>
      </td>
    </tr>
  );
};

export default NavigateRow;
