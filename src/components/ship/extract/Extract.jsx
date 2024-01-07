import React, { useEffect, useState, memo } from "react";

import { useShipContext } from "../../../context/shipContext";
import { fetchData } from "../../../utils";

import Cooldown from "../../cooldown/Cooldown.jsx";

import "./extract.css";

const Extract = ({ shipSymbol, userToken }) => {
  const { extractRessources, shipData, updateStorage } = useShipContext();
  const [cooldown, setCooldown] = useState(
    shipData && shipData.cooldown ? shipData.cooldown : null
  );
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    if (shipData) {
      setCooldown(shipData.cooldown);
    }
    handleCooldownRunning();
  }, [shipData, cooldown]);

  const handleClickExtract = async () => {
    setIsExtracting(true);

    try {
      const response = await extractRessources(shipSymbol);
      console.log(response);
    } catch (error) {
      console.error(error);

      setIsExtracting(false);
      console.log(isExtracting);
    }
  };

  const handleCooldownRunning = async () => {
    const options = {
      endpoint: `my/ships/${shipSymbol}/cooldown`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    };

    try {
      const data = await fetchData(options);
      console.log(data);
      data === null ? setIsExtracting(false) : setIsExtracting(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCooldownEnd = async () => {
    console.log("Cooldown ended");
    setIsExtracting(false);
    await updateStorage(shipSymbol);
  };

  return (
    <div className="extract">
      <div className="extract__wrapper">
        <button
          className="extract__button"
          onClick={handleClickExtract}
          disabled={isExtracting}
        >
          Extract Ressources
        </button>
        <Cooldown
          startTime={cooldown?.remainingSeconds}
          endTime={cooldown?.expiration}
          onCooldownEnd={handleCooldownEnd}
        />
      </div>
    </div>
  );
};

export default memo(Extract);
