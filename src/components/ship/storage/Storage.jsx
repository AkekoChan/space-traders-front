import React, { useState, useEffect } from "react";
import "./storage.css";
import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
} from "../../../utils";
import { useShipContext } from "../../../context/shipContext";

const Storage = ({ data }) => {
  const { shipData, getMarket, sellCargo, getCargo, cargo, updateStorage } =
    useShipContext();

  const [symbol, setSymbol] = useState({
    systemSymbol: shipData?.nav?.systemSymbol || data.nav.systemSymbol,
    waypointSymbol:
      shipData?.nav?.route.destination.symbol || data.nav.waypointSymbol,
  });
  const [market, setMarket] = useState([]);
  const [isClicked, setIsClicked] = useState({});
  const [quantity, setQuantity] = useState({});

  const handleGetMarket = async () => {
    try {
      const marketData = await getMarket(
        symbol.systemSymbol,
        symbol.waypointSymbol
      );
      return (
        marketData?.tradeGoods?.map((item) => ({
          symbolMarket: formatFirstLetterToUpperCase(
            replaceUnderscoreWithSpace(item.symbol)
          ),
          sellPrice: item.sellPrice,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching market data:", error);
      return [];
    }
  };

  const handleSellItem = async (item) => {
    setIsClicked({ ...isClicked, [item.symbol]: !isClicked[item.symbol] });
    setQuantity({ ...quantity, [item.symbol]: 0 });

    if (isClicked[item.symbol] && quantity[item.symbol] > 0) {
      try {
        const response = await sellCargo(
          item.symbol,
          data.symbol,
          quantity[item.symbol]
        );
        updateStorage(response.cargo);
      } catch (error) {
        console.error("Error selling item:", error);
      }
    }
  };

  const handleChangeQuantity = (event, item) => {
    setQuantity({ ...quantity, [item.symbol]: event.target.value });
  };

  useEffect(() => {
    setSymbol({
      systemSymbol: shipData?.nav?.systemSymbol || data.nav.systemSymbol,
      waypointSymbol:
        shipData?.nav?.route.destination.symbol || data.nav.waypointSymbol,
    });
  }, [shipData, data.nav.systemSymbol, data.nav.waypointSymbol]);

  useEffect(() => {
    getCargo(data.symbol);
  }, [data.symbol]);

  useEffect(() => {
    const fetchMarket = async () => {
      if (!cargo) return;

      const marketData = await handleGetMarket();
      const matchingItems = marketData.filter((item) =>
        cargo.inventory.some(
          (cargoItem) =>
            item.symbolMarket ===
            replaceUnderscoreWithSpace(
              formatFirstLetterToUpperCase(cargoItem.symbol)
            )
        )
      );

      setMarket(matchingItems);
    };

    fetchMarket();
  }, [cargo, symbol.waypointSymbol]);

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
          {cargo ? (
            cargo.inventory.map((item, index) => (
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
            ))
          ) : (
            <tr>
              <td colSpan="3">No items available in storage</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Storage;
