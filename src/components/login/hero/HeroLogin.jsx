import React from "react";

import logo from "../../../assets/img/logo.svg";
import "../login.css";

const HeroLogin = () => {
  return (
    <div className="login-hero">
      <img src={logo} alt="Logo Aurora" className="login-hero__logo" />
      <h1 className="login-hero__title">Aurora</h1>
      <p className="login-hero__subtitle">An interface for SpaceTraders API</p>
    </div>
  );
};

export default HeroLogin;
