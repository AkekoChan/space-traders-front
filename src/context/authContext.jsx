import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import useFetch from "../hook/useFetch";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  console.log("userToken", userToken);
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

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
