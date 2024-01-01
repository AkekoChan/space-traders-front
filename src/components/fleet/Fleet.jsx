import React from "react";
import { useNavigate } from "react-router";
import useFetch from "../../hook/useFetch";

import { useAuthContext } from "../../context/authContext";

import { RedoOutlined, WarningOutlined } from "@ant-design/icons";
import { ThreeDots } from "react-loader-spinner";

import "./fleet.css";

import ShipRow from "./shiprow/ShipRow.jsx";

const Fleet = () => {
  const { userToken } = useAuthContext();
  const navigate = useNavigate();

  if (!userToken) {
    navigate("/login");
  }

  const options = {
    endpoint: "my/ships?page=1&limit=10",
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  };
  const { data, isLoading, error, refetch } = useFetch(options);

  return (
    <section className="fleet-container">
      <div className="fleet">
        <h1 className="fleet-title">Fleet</h1>
        <div className="fleet-refresh">
          Refresh
          <button className="fleet-refresh__button" onClick={refetch}>
            <RedoOutlined style={{ fontSize: "1.5rem", color: "#fff" }} />
          </button>
        </div>
      </div>
      {isLoading ? (
        <ThreeDots color="#F1FFC4" />
      ) : error ? (
        <p className="fleet-error">
          <WarningOutlined style={{ fontSize: "3rem" }} />
          Oops ! something went wrong !
        </p>
      ) : (
        <div className="fleet-table-container">
          <table className="fleet-table">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Symbol</th>
                <th style={{ width: "20%" }}>System</th>
                <th style={{ width: "20%" }}>Waypoint</th>
                <th style={{ width: "20%" }}></th>
                <th style={{ width: "10%" }}>Fuel</th>
                <th style={{ width: "10%" }}>Cargo</th>
                <th style={{ width: "5%" }}></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((ship, index) => {
                return <ShipRow ship={ship} key={index} token={userToken} />;
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Fleet;
