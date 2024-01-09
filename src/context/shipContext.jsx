import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./authContext";
import { fetchData } from "../utils";

const ShipContext = createContext();

export const ShipContextProvider = ({ children }) => {
  const { userToken } = useAuthContext();
  const [shipData, setShipData] = useState({});

  const updateShipData = async (options) => {
    try {
      const result = await fetchData(options);
      setShipData(result);
      return result;
    } catch (error) {
      console.error(`Error: ${options.method} ${options.endpoint}`, error);
    }
  };

  const dockShip = async (shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/dock`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    return updateShipData(options);
  };

  const orbitShip = async (shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/orbit`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    return updateShipData(options);
  };

  const updateNavigationMode = async (shipSymbol, mode) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/nav`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: `{"flightMode": "${mode}"}`,
    };

    return updateShipData(options);
  };

  const refuelShip = async (shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/refuel`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    return updateShipData(options);
  };

  const fetchSystemWaypoints = async (systemSymbol) => {
    const waypoints = [];
    const limit = 10;

    const fetchWaypointsForPage = async (page) => {
      const optionsAllWaypoints = {
        endpoint: `systems/${systemSymbol}/waypoints?page=${page}&limit=${limit}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      };

      const dataAllWaypoints = await fetchData(optionsAllWaypoints);
      waypoints.push(...dataAllWaypoints);
    };

    const optionsCountWaypoints = {
      endpoint: `systems/${systemSymbol}`,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    const data = await fetchData(optionsCountWaypoints);
    const countWaypoints = data.waypoints.length;

    const totalPages = Math.ceil(countWaypoints / limit);
    const delayBetweenRequests = 3000;

    const fetchPromises = [];

    for (let page = 1; page <= totalPages; page++) {
      fetchPromises.push(
        new Promise((resolve) => {
          setTimeout(async () => {
            await fetchWaypointsForPage(page);
            resolve();
          }, delayBetweenRequests);
        })
      );
    }

    await Promise.all(fetchPromises);

    localStorage.setItem("waypoints", JSON.stringify(waypoints));
  };

  const shipNavigate = async (waypoint, shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/navigate`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: `{"waypointSymbol": "${waypoint}"}`,
    };

    return updateShipData(options);
  };

  const extractRessources = async (shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/extract`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    return updateShipData(options);
  };

  const updateStorage = async (shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/cargo`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    return updateShipData(options);
  };

  const getMarket = async (systemSymbol, waypointSymbol) => {
    const options = {
      endpoint: `systems/${systemSymbol}/waypoints/${waypointSymbol}/market`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    return fetchData(options);
  };

  const sellItem = async (item, shipSymbol, units) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/sell`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: `{"symbol":"${item}","units":"${units}"}`,
    };

    return fetchData(options);
  };

  const contextValue = {
    dockShip,
    orbitShip,
    updateNavigationMode,
    shipData,
    refuelShip,
    fetchSystemWaypoints,
    shipNavigate,
    extractRessources,
    updateStorage,
    getMarket,
    sellItem,
  };

  return (
    <ShipContext.Provider value={contextValue}>{children}</ShipContext.Provider>
  );
};

export const useShipContext = () => {
  const context = useContext(ShipContext);
  if (!context) {
    throw new Error("useShipContext must be used within a ShipContextProvider");
  }
  return context;
};
