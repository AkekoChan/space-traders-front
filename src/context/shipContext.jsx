// shipContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./authContext";
import { fetchData } from "../utils";

const ShipContext = createContext();

export const ShipContextProvider = ({ children }) => {
  const { userToken } = useAuthContext();
  const [shipData, setShipData] = useState({});

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

    try {
      const result = await fetchData(options);
      setShipData(result);
      return result;
    } catch (error) {
      console.error("Error docking ship:", error);
    }
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

    try {
      const result = await fetchData(options);
      setShipData(result);
      return result;
    } catch (error) {
      console.error("Error orbiting ship:", error);
    }
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
    try {
      const result = await fetchData(options);
      setShipData(result);
      return result;
    } catch (error) {
      console.error("Error updating ship navigation mode:", error);
    }
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

    try {
      const result = await fetchData(options);
      return result;
    } catch (error) {
      console.error("Error refueling ship:", error);
    }
  };

  const contextValue = {
    dockShip,
    orbitShip,
    updateNavigationMode,
    shipData,
    refuelShip,
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
