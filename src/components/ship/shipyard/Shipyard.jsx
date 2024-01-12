import React, { useState, useEffect } from "react";

import { useShipContext } from "../../../context/shipContext";
import { useAuthContext } from "../../../context/authContext";

import "./shipyard.css";
const Shipyard = () => {
  const { shipyard, getShipyard } = useShipContext();
  const { agent } = useAuthContext();
  return <div>Shipyard</div>;
};

export default Shipyard;
