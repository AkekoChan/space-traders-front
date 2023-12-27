import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

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
    };

    try {
      const response = await fetch(
        `https://api.spacetraders.io/v2/${options.endpoint}`,
        {
          method: options.method,
          headers: options.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      setUserToken(token);
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      console.error(error);
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
