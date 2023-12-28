import React from "react";
import { useAuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

import FormLogin from "./form/FormLogin.jsx";
import HeroLogin from "./hero/HeroLogin.jsx";

import "./login.css";

const Login = () => {
  const { userToken } = useAuthContext();

  return (
    <section className="login-container">
      <HeroLogin />
      <FormLogin />
      {userToken && (
        <div className="login-already">
          <p className="login-already__text">You are already logged in.</p>
          <Link className="login-already__button" to="/">
            Go to dashboard
          </Link>
        </div>
      )}
    </section>
  );
};

export default Login;
