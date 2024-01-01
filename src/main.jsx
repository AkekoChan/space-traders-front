import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Login from "./components/login/Login.jsx";
import Fleet from "./components/fleet/Fleet.jsx";
import Ship from "./components/ship/Ship.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Navigate to="/fleet" />} />
            <Route path="fleet" element={<Fleet />} />
            <Route path="/fleet/:shipSymbol" element={<Ship />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
