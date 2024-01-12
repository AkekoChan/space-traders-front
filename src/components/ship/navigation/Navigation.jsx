import React, { useEffect, useState } from "react";
import { useShipContext } from "../../../context/shipContext";
import Navigate from "../../navigate/Navigate.jsx";
import "./navigation.css";
import "../ship.css";
import fastForwad from "../../../assets/icons/fast-forward.svg";
import fastBackward from "../../../assets/icons/fast-backward.svg";
import burn from "../../../assets/icons/burn.svg";
import eyeSlash from "../../../assets/icons/eye-slash.svg";

const Navigation = ({ data }) => {
  const { orbitShip, dockShip, updateNavigationMode, shipData } =
    useShipContext();
  const [isOrbited, setIsOrbited] = useState(
    shipData?.nav?.status === "IN_ORBIT" || data.nav.status === "IN_ORBIT"
  );
  const [isTransited, setIsTransited] = useState(
    shipData?.nav?.status === "IN_TRANSIT" || data.nav.status === "IN_TRANSIT"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClickOrbit = async () => {
    if (isOrbited) {
      await dockShip(data.symbol);
      setIsOrbited(false);
    } else {
      await orbitShip(data.symbol);
      setIsOrbited(true);
    }
  };

  const handleClickMode = async (mode) => {
    try {
      await updateNavigationMode(data.symbol, mode);
    } catch (error) {
      console.error("Error in navigation operation", error);
    }
  };

  useEffect(() => {
    if (shipData?.nav) {
      setIsOrbited(shipData.nav.status === "IN_ORBIT");
      setIsTransited(shipData.nav.status === "IN_TRANSIT");
    }
  }, [shipData]);

  return (
    <div className="ship-navigation">
      <h3 className="ship-navigation__title">Navigation</h3>
      <button
        className="ship-navigation__btn-primary btn-disabled"
        onClick={() => handleClickOrbit()}
        disabled={isTransited}
      >
        {isOrbited ? "Dock" : "Orbit"}
      </button>
      <ul className="ship-navigation__list">
        <li>
          <button
            className="ship-navigation__btn-secondary btn-disabled"
            onClick={() => handleClickMode("CRUISE")}
            disabled={isTransited}
          >
            <img src={fastForwad} alt="fast forward icon" />
            Cruise
          </button>
        </li>
        <li>
          <button
            className="ship-navigation__btn-secondary btn-disabled"
            onClick={() => handleClickMode("DRIFT")}
            disabled={isTransited}
          >
            <img src={fastBackward} alt="fast backward icon" />
            Drift
          </button>
        </li>
        <li>
          <button
            className="ship-navigation__btn-secondary btn-disabled"
            onClick={() => handleClickMode("BURN")}
            disabled={isTransited}
          >
            <img src={burn} alt="burn icon" />
            Burn
          </button>
        </li>
        <li>
          <button
            className="ship-navigation__btn-secondary btn-disabled"
            onClick={() => handleClickMode("STEALTH")}
            disabled={isTransited}
          >
            <img src={eyeSlash} alt="eye slash icon" />
            Stealth
          </button>
        </li>
      </ul>
      <button
        className="ship-navigation__btn-primary btn-disabled"
        onClick={handleOpenModal}
        disabled={!isOrbited}
      >
        Navigate
      </button>
      <Navigate isOpen={isModalOpen} onClose={handleCloseModal} ship={data} />
    </div>
  );
};

export default Navigation;
