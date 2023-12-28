import React, { useState } from "react";
import { useAuthContext } from "../../../context/authContext";
import { WarningOutlined } from "@ant-design/icons";

import "../login.css";

const FormLogin = () => {
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const { login } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (token.trim() !== "") {
        await login(token);
        setToken("");
        setErrorMessage(null);
      } else {
        setErrorMessage("Please enter a valid token");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-form">
      <h2 className="login-form__title">Connect to your dashboard</h2>
      <form onSubmit={handleLogin} className="login-form__form">
        <div className="login-form__input-container">
          <label htmlFor="token" className="login-form__label">
            Your token :
          </label>
          <input
            name="token"
            type="text"
            id="token"
            className="login-form__input"
            required
            placeholder="i.g : {rcj9h93=F(V6.WZ35WfaE3?..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <button type="submit" className="login-form__button">
          Login
        </button>
        {errorMessage && (
          <p className="login-form__error">
            <WarningOutlined style={{ fontSize: "1.5rem" }} /> {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default FormLogin;
