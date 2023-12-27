import React, { useState } from "react";
import { useAuthContext } from "../../../context/authContext";

const Login = () => {
  const { login } = useAuthContext();
  const [token, setToken] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (token.trim() !== "") {
      login(token);
      setToken("");
      alert("Login successful");
    } else {
      alert("Please enter a valid token");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
