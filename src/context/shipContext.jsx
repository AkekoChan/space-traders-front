import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./authContext";
import { fetchData } from "../utils";

const ShipContext = createContext();

export const ShipContextProvider = ({ children }) => {
  const { userToken } = useAuthContext();
  const [shipData, setShipData] = useState({});
  const [cargo, setCargo] = useState();
  const [fuel, setFuel] = useState();
  const [market, setMarket] = useState([]);

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

  const updateFuel = (fuel) => {
    setFuel(fuel);
  };

  const getFuel = async (shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    try {
      const response = await fetchData(options);
      setFuel(response.fuel);
    } catch (error) {
      console.error(error);
    }
  };

  const listWaypoints = async (systemSymbol, params) => {
    const options = {
      endpoint: `systems/${systemSymbol}/waypoints?limit=${params.limit}&page=${params.page}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    try {
      const response = await fetchData(options, true);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const getWaypoint = async (systemSymbol, waypointSymbol) => {
    const options = {
      endpoint: `systems/${systemSymbol}/waypoints/${waypointSymbol}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    try {
      const response = await fetchData(options);
      return response;
    } catch (error) {
      console.error(error);
    }
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

  const updateStorage = (cargo) => {
    setCargo(cargo);
  };

  const getCargo = async (shipSymbol) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/cargo`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    try {
      const response = await fetchData(options);
      setCargo(response);
    } catch (error) {
      console.error(error);
    }
  };

  const sellCargo = async (item, shipSymbol, units) => {
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

    return updateShipData(options);
  };

  const buyCargo = async (item, shipSymbol, units) => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/purchase`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: `{"symbol":"${item}","units":"${units}"}`,
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

    try {
      const response = await fetchData(options);
      setMarket(response);
      return response;
    } catch (error) {
      setMarket([]);
      console.error(error);
    }
  };

  const contextValue = {
    dockShip,
    orbitShip,
    updateNavigationMode,
    shipData,
    refuelShip,
    listWaypoints,
    shipNavigate,
    extractRessources,
    updateStorage,
    getMarket,
    sellCargo,
    cargo,
    getCargo,
    updateFuel,
    fuel,
    getFuel,
    market,
    getWaypoint,
    buyCargo,
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
