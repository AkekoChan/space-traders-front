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
      const data = await fetchData(options);
      setFuel(data.fuel);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSystemWaypoints = async (systemSymbol) => {};

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
      const data = await fetchData(options);
      return data;
    } catch (error) {
      console.error(error);
    }
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
      const data = await fetchData(options);
      setCargo(data);
    } catch (error) {
      console.error(error);
    }
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
      const data = await fetchData(options);
      setMarket(data);
    } catch (error) {
      setMarket([]);
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
    sellCargo,
    cargo,
    getCargo,
    updateFuel,
    fuel,
    getFuel,
    market,
    getWaypoint,
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
