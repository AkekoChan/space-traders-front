import { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router";
import { useFetch } from "../hook/useFetch";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const login = (token) => {
    const options = {
      endpoint: "my/agent",
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: null,
    };
    const { data, error } = useFetch(options);
    setUserToken(token);

    {
      error ? console.log(error) : console.log(data);
    }
    localStorage.setItem("token", token);
    navigate("/");
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
