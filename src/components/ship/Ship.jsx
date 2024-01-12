import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/authContext";
import { ShipContextProvider } from "../../context/shipContext";
import useFetch from "../../hook/useFetch";

import { RedoOutlined, WarningOutlined } from "@ant-design/icons";
import { ThreeDots } from "react-loader-spinner";

import About from "./about/About.jsx";
import Navigation from "./navigation/Navigation.jsx";
import State from "./state/State.jsx";
import Extract from "./extract/Extract.jsx";
import Storage from "./storage/Storage.jsx";
import Shipyard from "./shipyard/Shipyard.jsx";
import Market from "./market/Market.jsx";

import "./ship.css";

const Ship = () => {
  const { userToken } = useAuthContext();
  const { shipSymbol } = useParams();
  const [activeButton, setActiveButton] = useState("cargo");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [userToken, navigate]);

  const handleClickButton = (buttonName) => {
    setActiveButton(buttonName);
  };

  const options = {
    endpoint: `my/ships/${shipSymbol}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  };

  const { data, isLoading, error, refetch } = useFetch(options);

  const memoizedExtractComponent = useMemo(
    () => <Extract shipSymbol={data.symbol} userToken={userToken} />,
    [data.symbol, userToken]
  );

  return (
    <ShipContextProvider>
      <section className="ship-container">
        <div className="ship">
          <h1 className="ship-title">Ship</h1>
          <div className="ship-refresh">
            Refresh
            <button
              className="ship-refresh__button"
              onClick={() => setTimeout(refetch, 1000)}
            >
              <RedoOutlined style={{ fontSize: "1.5rem", color: "#fff" }} />
            </button>
          </div>
        </div>
        {isLoading ? (
          <ThreeDots color="#F1FFC4" />
        ) : error ? (
          <p className="ship-error">
            <WarningOutlined style={{ fontSize: "3rem" }} /> Oops! Something
            went wrong!
          </p>
        ) : (
          <div className="ship-wrapper">
            <About data={data} />
            <Navigation data={data} />
            <State data={data} />
            <div className="ship-ressources">
              <div className="ship-ressources__buttons">
                <button
                  className={`ship-ressources__button ${
                    activeButton === "cargo" ? "active" : ""
                  }`}
                  onClick={() => handleClickButton("cargo")}
                >
                  Cargo
                </button>
                <button
                  className={`ship-ressources__button ${
                    activeButton === "resources" ? "active" : ""
                  }`}
                  onClick={() => handleClickButton("resources")}
                >
                  Extract
                </button>
                <button
                  className={`ship-ressources__button ${
                    activeButton === "market" ? "active" : ""
                  }`}
                  onClick={() => handleClickButton("market")}
                >
                  Market
                </button>
                <button
                  className={`ship-ressources__button ${
                    activeButton === "shipyard" ? "active" : ""
                  }`}
                  onClick={() => handleClickButton("shipyard")}
                >
                  Shipyard
                </button>
              </div>
              {activeButton === "cargo" ? (
                <Storage data={data} />
              ) : activeButton === "resources" ? (
                memoizedExtractComponent
              ) : activeButton === "market" ? (
                <Market data={data} />
              ) : (
                <Shipyard data={data} />
              )}
            </div>
          </div>
        )}
      </section>
    </ShipContextProvider>
  );
};

export default Ship;
