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
  symbolShip,
  waypointShip,
}) => {
  const { shipData, shipNavigate, fuel, updateFuel } = useShipContext();

  const [flightModeShip, setFlightModeShip] = useState(
    shipData?.flightMode || flightMode
  );

  const [isLocating, setIsLocating] = useState(
    shipData?.nav?.route?.destination?.symbol || waypointShip
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
    console.log(res);
    updateFuel(res.fuel);
    setIsLocating(res?.nav?.route?.destination?.symbol);
  };

  useEffect(() => {
    if (shipData?.flightMode) {
      setFlightModeShip(shipData.flightMode);
    }
    if (shipData?.nav?.route?.destination?.symbol) {
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
          {waypoint.traits
            .filter(
              (trait) =>
                trait.name === "Marketplace" || trait.name === "Shipyard"
            )
            .map((trait, index) => (
              <span className="badge-gray" key={index}>
                {formatFirstLetterToUpperCase(trait.name)}
              </span>
            ))}
        </div>
      </td>
      <td>
        <button
          className="navigate-table__button"
          onClick={handleClickNavigate}
          disabled={
            !isOrbited ||
            (fuel.current !== undefined &&
              fuel.current !== null &&
              fuel.current !== 0 &&
              getFuelConsumption(distanceToWaypoint, flightModeShip) >
                fuel.current) ||
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
