import { useState, useEffect } from "react";
import "./storage.css";
import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
} from "../../../utils";
import { useShipContext } from "../../../context/shipContext";

const Storage = ({ data }) => {
  const { shipData, getMarket } = useShipContext();
  const initialStorage = shipData?.inventory || data.cargo.inventory;
  const initialSymbol = {
    systemSymbol: shipData?.nav?.systemSymbol || data.nav.systemSymbol,
    waypointSymbol: shipData?.nav?.waypointSymbol || data.nav.waypointSymbol,
  };

  const [storage, setStorage] = useState(initialStorage);
  const [symbol, setSymbol] = useState(initialSymbol);
  const [market, setMarket] = useState({});
  const [isClicked, setIsClicked] = useState(false);

  const handleGetMarket = async () => {
    try {
      const market = await getMarket(
        symbol.systemSymbol,
        symbol.waypointSymbol
      );
      const formattedMarket = market?.tradeGoods?.map((item) => ({
        symbolMarket: formatFirstLetterToUpperCase(
          replaceUnderscoreWithSpace(item.symbol)
        ),
        sellPrice: item.sellPrice,
      }));
      return formattedMarket;
    } catch (error) {
      console.error("Error fetching market data:", error);
      return null;
    }
  };

  const handleSellItem = async (item) => {};

  useEffect(() => {
    const fetchData = async () => {
      setStorage(initialStorage);
      setSymbol(initialSymbol);

      const marketData = await handleGetMarket();
      if (marketData) {
        const matchingItems = marketData.filter((item) =>
          data.cargo.inventory.some(
            (cargoItem) =>
              item.symbolMarket ===
              replaceUnderscoreWithSpace(
                formatFirstLetterToUpperCase(cargoItem.symbol)
              )
          )
        );

        setMarket(matchingItems);
      } else {
        setMarket([]);
      }
    };

    fetchData();
  }, [shipData]);

  return (
    <div className="ship-storage">
      <table className="fleet-table">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Name</th>
            <th style={{ width: "20%" }}>Quantity</th>
            <th style={{ width: "40%" }}>Sell Price</th>
          </tr>
        </thead>
        <tbody>
          {storage.map((item, index) => (
            <tr key={index}>
              <td>
                <span>
                  {replaceUnderscoreWithSpace(
                    formatFirstLetterToUpperCase(item.symbol)
                  )}
                </span>
                <p>{item.description}</p>
              </td>
              <td>{item.units}</td>
              <td>
                {Array.isArray(market) && (
                  <>
                    <span>
                      {market.find(
                        (marketItem) =>
                          marketItem.symbolMarket ===
                          replaceUnderscoreWithSpace(
                            formatFirstLetterToUpperCase(item.symbol)
                          )
                      )?.sellPrice || "-"}
                    </span>

                    {market.find(
                      (marketItem) =>
                        marketItem.symbolMarket ===
                        replaceUnderscoreWithSpace(
                          formatFirstLetterToUpperCase(item.symbol)
                        )
                    ) && (
                      <>
                        <button onClick={() => setIsClicked(true)}>Sell</button>

                        {isClicked && <input type="number" min={0} />}
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Storage;
