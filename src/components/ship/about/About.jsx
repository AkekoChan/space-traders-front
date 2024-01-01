import React from "react";

import {
  formatFirstLetterToUpperCase,
  formatDateToEuropean,
} from "../../../utils";

import "./about.css";
import "../ship.css";

import greaterThan from "../../../assets/icons/greater-than.svg";

const About = ({ data }) => {
  console.log(data.length);
  console.log(data);

  // console.log(data.registration.name);

  // return data ? <p>Loaded</p> : <p>Loading</p>;
  return (
    <div className="ship-about">
      <div className="about__wrapper">
        <p className="about__name">{data.registration.name}</p>
        <div className="about__status">
          <span className="about__flight-mode badge-gray">
            {formatFirstLetterToUpperCase(data.nav.flightMode)}
          </span>
          {data.nav.status === "IN_ORBIT" ? (
            <span className="about__in-orbit badge-gray">In orbit</span>
          ) : data.nav.status === "DOCKED" ? (
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
          <p>System</p>
          <span className="badge-gradient">{data.nav.waypointSymbol}</span>
        </div>
      </div>
      <div className="about__wrapper">
        <div className="about__route">
          <p>Route</p>
          <span>
            {data?.nav.route.departure.symbol}
            <img src={greaterThan} alt="Greater than icon" />
            {data?.nav.route.destination.symbol}
          </span>
        </div>
        <div className="about__time">
          <div className="about__departure">
            <p>Departed</p>
            <span>{formatDateToEuropean(data.nav.route.departureTime)}</span>
          </div>
          <div className="about__arrival">
            <p>Arrived</p>
            <span>{formatDateToEuropean(data.nav.route.arrival)}</span>
          </div>
        </div>
        <div className="about__cooldown">
          <div className="cooldown-bar-container">
            <div className="time-bar"></div>
          </div>
          <span className="cooldown-label">350s</span>
        </div>
      </div>
    </div>
  );
};

export default About;
