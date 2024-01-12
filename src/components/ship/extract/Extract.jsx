import { useEffect, useState, useRef } from "react";
import { useShipContext } from "../../../context/shipContext";
import { fetchData } from "../../../utils";
import Cooldown from "../../cooldown/Cooldown.jsx";
import "./extract.css";

const Extract = ({ shipSymbol, userToken }) => {
  const { extractRessources, shipData, updateStorage } = useShipContext();
  const [cooldown, setCooldown] = useState(
    shipData?.cooldown?.remainingSeconds
  );
  const [endTime, setEndTime] = useState(shipData?.cooldown?.expiration);
  const [isExtracting, setIsExtracting] = useState(false);

  const initialCooldownRef = useRef(shipData?.cooldown?.remainingSeconds);

  useEffect(() => {
    setCooldown(shipData?.cooldown?.remainingSeconds);
    setEndTime(shipData?.cooldown?.expiration);
  }, [shipData]);

  const handleClickExtract = async () => {
    setIsExtracting(true);

    try {
      const response = await extractRessources(shipSymbol);
      console.log(response);
      updateStorage(response.cargo);
    } catch (error) {
      console.error(error);
      setIsExtracting(false);
    }
  };

  const handleCooldownEnd = async () => {
    setIsExtracting(false);

    setCooldown(initialCooldownRef.current);
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
      setIsExtracting(data !== null);
      setCooldown(data?.remainingSeconds);
      setEndTime(data?.expiration);

      if (data?.remainingSeconds !== undefined && !isExtracting) {
        initialCooldownRef.current = data.remainingSeconds;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleCooldownRunning();
  }, []);

  return (
    <div className="extract">
      <div className="extract__wrapper">
        <button
          className="extract__button"
          onClick={handleClickExtract}
          disabled={isExtracting}
        >
          Extract Resources
        </button>
        <Cooldown
          startTime={cooldown}
          endTime={endTime}
          onCooldownEnd={handleCooldownEnd}
          isExtractCooldown={true}
        />
      </div>
    </div>
  );
};

export default Extract;
