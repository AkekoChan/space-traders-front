import { useState, useEffect } from "react";
import "./storage.css";
import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
} from "../../../utils";
import { useShipContext } from "../../../context/shipContext";

const Storage = ({ data }) => {
  const { shipData, getMarket, sellCargo } = useShipContext();

  const [storage, setStorage] = useState(
    shipData?.inventory || data.cargo.inventory
  );
  const [symbol, setSymbol] = useState({
    systemSymbol: shipData?.nav?.systemSymbol || data.nav.systemSymbol,
    waypointSymbol: shipData?.nav?.waypointSymbol || data.nav.waypointSymbol,
  });
  const [market, setMarket] = useState({});
  const [isClicked, setIsClicked] = useState({});
  const [quantity, setQuantity] = useState({});

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
    }
  };

  const handleSellItem = async (item) => {
    setIsClicked({ ...isClicked, [item.symbol]: !isClicked[item.symbol] });
    setQuantity({ ...quantity, [item.symbol]: 0 });

    if (isClicked[item.symbol] && quantity[item.symbol] > 0) {
      await sellCargo(item.symbol, data.symbol, quantity[item.symbol]);
    }

    console.log(quantity);
  };

  const handleChangeQuantity = (event, item) => {
    setQuantity({ ...quantity, [item.symbol]: event.target.value });
  };

  useEffect(() => {
    setStorage(shipData?.inventory || data.cargo.inventory);
    setSymbol({
      systemSymbol: shipData?.nav?.systemSymbol || data.nav.systemSymbol,
      waypointSymbol: shipData?.nav?.waypointSymbol || data.nav.waypointSymbol,
    });
  }, [shipData]);

  useEffect(() => {
    const fetchMarket = async () => {
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
        console.log(matchingItems);
      } else {
        setMarket([]);
      }
    };

    fetchMarket();
  }, [symbol.waypointSymbol]);

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
                        <button onClick={() => handleSellItem(item)}>
                          Sell
                        </button>

                        {isClicked[item.symbol] && (
                          <input
                            type="number"
                            name="quantity"
                            min={1}
                            onChange={(event) =>
                              handleChangeQuantity(event, item)
                            }
                            placeholder="Quantity"
                            value={quantity[item.symbol] || ""}
                          />
                        )}
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
