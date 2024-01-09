import { useEffect, useState } from "react";
import { useShipContext } from "../../../context/shipContext";
import { fetchData } from "../../../utils";
import Cooldown from "../../cooldown/Cooldown.jsx";
import "./extract.css";

const Extract = ({ shipSymbol, userToken }) => {
  const { extractRessources, shipData, updateStorage } = useShipContext();
  const [cooldown, setCooldown] = useState(shipData?.cooldown || null);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    setCooldown(shipData?.cooldown);
    handleCooldownRunning();
  }, [shipData]);

  const handleClickExtract = async () => {
    setIsExtracting(true);

    try {
      const response = await extractRessources(shipSymbol);
      console.log(response);
    } catch (error) {
      console.error(error);
      setIsExtracting(false);
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
      setIsExtracting(data !== null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCooldownEnd = async () => {
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
          Extract Resources
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

export default Extract;
