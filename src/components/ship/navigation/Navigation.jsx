import React from "react";

import { Link } from "react-router-dom";

import "./navigation.css";
import "../ship.css";

import fastForwad from "../../../assets/icons/fast-forward.svg";
import fastBackward from "../../../assets/icons/fast-backward.svg";
import burn from "../../../assets/icons/burn.svg";
import eyeSlash from "../../../assets/icons/eye-slash.svg";

const Navigation = ({ data }) => {
  return (
    <div className="ship-navigation">
      <h3 className="ship-navigation__title">Navigation</h3>
      <button className="ship-navigation__btn-primary">Orbit</button>
      <ul className="ship-navigation__list">
        <li>
          <button className="ship-navigation__btn-secondary">
            <img src={fastForwad} alt="" />
            Cruise
          </button>
        </li>
        <li>
          <button className="ship-navigation__btn-secondary">
            <img src={fastBackward} alt="" />
            Drift
          </button>
        </li>
        <li>
          <button className="ship-navigation__btn-secondary">
            <img src={burn} alt="" />
            Burn
          </button>
        </li>
        <li>
          <button className="ship-navigation__btn-secondary">
            <img src={eyeSlash} alt="" />
            Stealth
          </button>
        </li>
      </ul>
      <Link to="" className="ship-navigation__btn-primary">
        Navigate
      </Link>
    </div>
  );
};

export default Navigation;
