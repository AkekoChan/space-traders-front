import React from "react";
import { useParams } from "react-router";

import useFetch from "../../hook/useFetch";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/authContext";

import { RedoOutlined, WarningOutlined } from "@ant-design/icons";
import { ThreeDots } from "react-loader-spinner";

import About from "./about/About.jsx";
import Navigation from "./navigation/Navigation.jsx";
import State from "./state/State.jsx";

import "./ship.css";

const Ship = () => {
  const { userToken } = useAuthContext();
  const { shipSymbol } = useParams();

  const navigate = useNavigate();

  if (!userToken) {
    navigate("/login");
  }

  const options = {
    endpoint: `my/ships/${shipSymbol}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  };

  const { data, isLoading, error, refetch } = useFetch(options);

  return (
    <section className="ship-container">
      <div className="ship">
        <h1 className="ship-title">Ship</h1>
        <div className="ship-refresh">
          Refresh
          <button className="ship-refresh__button" onClick={refetch}>
            <RedoOutlined style={{ fontSize: "1.5rem", color: "#fff" }} />
          </button>
        </div>
      </div>
      {isLoading ? (
        <ThreeDots color="#F1FFC4" />
      ) : error ? (
        <p className="ship-error">
          <WarningOutlined style={{ fontSize: "3rem" }} /> Oops ! something went
          wrong !
        </p>
      ) : (
        <div className="ship-wrapper">
          <About data={data} />
          <Navigation data={data} />
          <State data={data} />
        </div>
      )}
    </section>
  );
};

export default Ship;
