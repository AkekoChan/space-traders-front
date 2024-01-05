import React, { useEffect, useState } from "react";

import { SendOutlined, EnvironmentOutlined } from "@ant-design/icons";

import { useShipContext } from "../../../context/shipContext";

import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
  distance,
  travelTime,
} from "../../../utils";

const NavigateRow = ({
  waypoint,
  coordinatesShip,
  speedShip,
  flightMode,
  isOrbited,
  fuel,
  symbolShip,
  waypointShip,
}) => {
  const { shipData, shipNavigate } = useShipContext();

  const [flightModeShip, setFlightModeShip] = useState(
    shipData && shipData.flightMode ? shipData.flightMode : flightMode
  );
  const [fuelCapacity, setFuelCapacity] = useState(
    shipData && shipData.fuel ? shipData.fuel.current : fuel
  );
  const [isLocating, setIsLocating] = useState(
    shipData && shipData.nav
      ? shipData.nav.route.destination.symbol
      : waypointShip
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

  const getFuelConsumption = (distance, flightMode) => {
    switch (flightMode) {
      case "CRUISE":
        return Math.round(distance);
      case "DRIFT":
        return 1;
      case "BURN":
        return 2 * Math.round(distance);
      case "STEALTH":
        return Math.round(distance);
      default:
        return 0;
    }
  };

  const handleClickNavigate = async () => {
    const res = await shipNavigate(waypoint.symbol, symbolShip);
    setIsLocating(res.nav.route.destination.symbol);
  };

  useEffect(() => {
    if (shipData && shipData.flightMode) {
      setFlightModeShip(shipData.flightMode);
    }
    if (shipData && shipData.fuel) {
      setFuelCapacity(shipData.fuel.current);
    }
    if (shipData && shipData.nav) {
      setIsLocating(shipData.nav.route.destination.symbol);
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
        <button
          className="navigate-table__button"
          onClick={handleClickNavigate}
          disabled={
            isOrbited ||
            getFuelConsumption(distanceToWaypoint, flightModeShip) >
              fuelCapacity ||
            isLocating === waypoint.symbol
          }
        >
          {isLocating === waypoint.symbol ? (
            <EnvironmentOutlined
              style={{ fontSize: "1.5rem", color: "#171c21" }}
            />
          ) : (
            <SendOutlined style={{ fontSize: "1.5rem", color: "#171c21" }} />
          )}
        </button>
      </td>
    </tr>
  );
};

export default NavigateRow;
