import React, { useEffect, useState } from "react";
import { useShipContext } from "../../../context/shipContext";
import Cooldown from "../../cooldown/Cooldown.jsx";
import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
  formatDateToEuropean,
} from "../../../utils";
import "./about.css";
import "../ship.css";
import greaterThan from "../../../assets/icons/greater-than.svg";

const About = ({ data }) => {
  const { shipData, orbitShip } = useShipContext();
  const [status, setStatus] = useState(data.nav.status);
  const [flightMode, setFlightMode] = useState(data.nav.flightMode);
  const [arrivalDate, setArrivalDate] = useState({
    time: data.nav.route.arrival,
    waypoint: data.nav.route.destination.symbol,
    type: data.nav.route.destination.type,
  });
  const [departureDate, setDepartureDate] = useState({
    time: data.nav.route.departureTime,
    waypoint: data.nav.route.departure.symbol,
  });

  const handleCooldownEnd = () => {
    setTimeout(async () => {
      await orbitShip(data.symbol);
    }, 3000);
  };

  useEffect(() => {
    if (shipData) {
      setStatus(shipData?.nav?.status || data.nav.status || shipData?.status);
      setFlightMode(shipData?.flightMode || data.nav.flightMode);
      setArrivalDate({
        time: shipData?.nav?.route?.arrival || data.nav.route.arrival,
        waypoint:
          shipData?.nav?.route?.destination?.symbol ||
          data.nav.route.destination.symbol,
        type:
          shipData?.nav?.route?.destination?.type ||
          data.nav.route.destination.type,
      });
      setDepartureDate({
        time:
          shipData?.nav?.route?.departureTime || data.nav.route.departureTime,
        waypoint:
          shipData?.nav?.route?.departure?.symbol ||
          data.nav.route.departure.symbol,
      });
    }
  }, [shipData]);

  return (
    <div className="ship-about">
      <div className="about__wrapper">
        <p className="about__name">{data.registration.name}</p>
        <div className="about__status">
          <span className="about__flight-mode badge-gray">
            {formatFirstLetterToUpperCase(flightMode)}
          </span>
          {status === "IN_ORBIT" ? (
            <span className="about__in-orbit badge-gray">In orbit</span>
          ) : status === "DOCKED" ? (
            <span className="about__docked badge-gray">Docked</span>
          ) : (
            <span className="about__in-transit badge-gray">In transit</span>
          )}
        </div>
      </div>
      <div className="about__wrapper">
        <div className="about__role">
          <p>Role</p>
          <span className="badge-gradient">
            {formatFirstLetterToUpperCase(data.registration.role)}
          </span>
        </div>
        <div className="about__system">
          <p>System</p>
          <span className="badge-gradient">{data.nav.systemSymbol}</span>
        </div>
        <div className="about__waypoint">
          <p>Waypoint</p>
          <span className="badge-gradient">{arrivalDate.waypoint}</span>
        </div>
        <div className="about__type">
          <p>Type</p>
          <span className="badge-gradient">
            {replaceUnderscoreWithSpace(
              formatFirstLetterToUpperCase(arrivalDate.type)
            )}
          </span>
        </div>
      </div>
      <div className="about__wrapper">
        <div className="about__route">
          <p>Route</p>
          <span>
            {departureDate.waypoint}
            <img src={greaterThan} alt="Greater than icon" />
            {arrivalDate.waypoint}
          </span>
        </div>
        <div className="about__time">
          <div className="about__departure">
            <p>Departed</p>
            <span>{formatDateToEuropean(departureDate.time)}</span>
          </div>
          <div className="about__arrival">
            <p>Arrived</p>
            <span>{formatDateToEuropean(arrivalDate.time)}</span>
          </div>
        </div>

        <Cooldown
          startTime={new Date(departureDate.time)}
          endTime={arrivalDate.time}
          shipSymbol={data.symbol}
          onCooldownEnd={handleCooldownEnd}
        />
      </div>
    </div>
  );
};

export default About;
