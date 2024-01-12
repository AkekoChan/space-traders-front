import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useAuthContext } from "../../context/authContext";

import SubHeader from "./subheader/SubHeader.jsx";

import {
  LogoutOutlined,
  UserOutlined,
  HeatMapOutlined,
} from "@ant-design/icons";

import logo from "../../assets/img/logo.svg";
import "./header.css";

const Header = () => {
  const { logout, userToken, agent, getAgent } = useAuthContext();

  const [isSubHeaderOpen, setIsSubHeaderOpen] = useState(false);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const handleProfileClick = () => {
    setIsSubHeaderOpen(!isSubHeaderOpen);
  };

  useEffect(() => {
    if (userToken) {
      getAgent();
    }
  }, [userToken]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setIsSubHeaderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonRef, popupRef]);

  return (
    <header className="header">
      <nav className="header__nav">
        <ul className="header__list">
          <li className="header__item">
            <Link to="/" className="header__logo">
              <img src={logo} alt="Logo Aurora" aria-label="Back to homepage" />
            </Link>
          </li>
          <li className="header__item header__item--credits">
            <HeatMapOutlined style={{ fontSize: "1.5rem", color: "#f1ffc4" }} />
            <span className="header__credits">{agent?.credits}</span>
          </li>
          <li className="header__item  header__item--right">
            <ul className="header__list">
              <li className="header__item header__item--profile">
                <button
                  ref={buttonRef}
                  onClick={handleProfileClick}
                  className="header__profile"
                  aria-label="Your profile"
                  aria-haspopup="true"
                >
                  <UserOutlined style={{ fontSize: "1.5rem", color: "#fff" }} />
                </button>
                {isSubHeaderOpen && (
                  <SubHeader agent={agent} token={userToken} ref={popupRef} />
                )}
              </li>
              <li className="header__item">
                <button
                  onClick={logout}
                  className="header__logout"
                  aria-label="Disconnect"
                >
                  <LogoutOutlined
                    style={{ fontSize: "1.5rem", color: "#fff" }}
                  />
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
