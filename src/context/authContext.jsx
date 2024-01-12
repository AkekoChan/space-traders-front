import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router";

import { fetchData } from "../utils";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [agent, setAgent] = useState();
  const navigate = useNavigate();

  const login = async (token) => {
    const options = {
      endpoint: "my/agent",
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: null,
    };

    try {
      const response = await fetch(
        `https://api.spacetraders.io/v2/${options.endpoint}`,
        {
          method: options.method,
          headers: options.headers,
          body: options.body,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error during login:", errorData);
        throw new Error("Your token is invalid.");
      } else {
        setUserToken(token);
        localStorage.setItem("token", token);
        navigate("/");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUserToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getAgent = async () => {
    const options = {
      endpoint: `my/agent`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };
    try {
      const response = await fetchData(options);
      setAgent(response);
      return response;
    } catch (error) {
      setAgent(null);
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, getAgent, agent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
