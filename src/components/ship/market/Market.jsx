import React, { useEffect, useState } from "react";

import "./market.css";

import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
} from "../../../utils";

import { useShipContext } from "../../../context/shipContext";
import { useAuthContext } from "../../../context/authContext";

const Market = ({ data }) => {
  const { agent } = useAuthContext();
  const {
    getWaypoint,
    getMarket,
    getCargo,
    cargo,
    shipData,
    sellCargo,
    buyCargo,
    updateStorage,
  } = useShipContext();
  const [tradeGood, setTradeGood] = useState([]);
  const [trait, setTrait] = useState([]);
  const [isBuyClicked, setIsBuyClicked] = useState({});
  const [isSellClicked, setIsSellClicked] = useState({});
  const [quantity, setQuantity] = useState({});
  const [status, setStatus] = useState();

  const getTradeGood = async () => {
    const reponse = await getMarket(
      data.nav.systemSymbol,
      data.nav.waypointSymbol
    );
    setTradeGood(reponse.tradeGoods);
  };

  const getTrait = async () => {
    const response = await getWaypoint(
      data.nav.systemSymbol,
      data.nav.waypointSymbol
    );
    setTrait(response.traits);
  };

  const isMarket = trait?.some((item) => item.symbol === "MARKETPLACE");

  const handleSellItem = async (item) => {
    setIsSellClicked({
      ...isSellClicked,
      [item.symbol]: !isSellClicked[item.symbol],
    });
    setQuantity({ ...quantity, [item.symbol]: 0 });

    if (isSellClicked[item.symbol] && quantity[item.symbol] > 0) {
      const response = await sellCargo(
        item.symbol,
        data.symbol,
        quantity[item.symbol]
      );
      updateStorage(response.cargo);
      setIsSellClicked({ ...isSellClicked, [item.symbol]: false });
    }
  };

  const handleBuyItem = async (item) => {
    setIsBuyClicked({
      ...isBuyClicked,
      [item.symbol]: !isBuyClicked[item.symbol],
    });
    setQuantity({ ...quantity, [item.symbol]: 0 });

    if (isBuyClicked[item.symbol] && quantity[item.symbol] > 0) {
      const response = await buyCargo(
        item.symbol,
        data.symbol,
        quantity[item.symbol]
      );
      updateStorage(response.cargo);
      setIsBuyClicked({ ...isBuyClicked, [item.symbol]: false });
    }
  };

  const handleChangeQuantity = (event, item) => {
    setQuantity({ ...quantity, [item.symbol]: event.target.value });
  };

  const TradeButton = (tradeGood) => {
    const canSell =
      cargo?.inventory.some((item) => {
        return item.symbol === tradeGood.symbol;
      }) && status === "DOCKED";

    const canBuy = agent.credits >= tradeGood.sellPrice && status === "DOCKED";

    return (
      <>
        <td>
          <span className="buy-price">{tradeGood.purchasePrice}</span>
          <button
            className="buy-button"
            disabled={!canBuy}
            onClick={() => {
              if (canBuy) {
                handleBuyItem(tradeGood);
              }
            }}
          >
            Buy
          </button>
          {isBuyClicked[tradeGood.symbol] && (
            <input
              type="number"
              onChange={(event) => handleChangeQuantity(event, tradeGood)}
            />
          )}
        </td>
        <td>
          <span className="sell-price">{tradeGood.sellPrice}</span>
          <button
            className="sell-button"
            disabled={!canSell}
            onClick={() => {
              if (canSell) {
                handleSellItem(tradeGood);
              }
            }}
          >
            Sell
          </button>
          {isSellClicked[tradeGood.symbol] && (
            <input
              type="number"
              onChange={(event) => handleChangeQuantity(event, tradeGood)}
            />
          )}
        </td>
      </>
    );
  };

  useEffect(() => {
    setStatus(shipData?.nav?.status);
  }, [shipData?.nav]);

  useEffect(() => {
    getTrait();
    if (isMarket) {
      getTradeGood();
    }
    getCargo(data.symbol);
    setStatus(data.nav.status);
  }, [isMarket]);

  return (
    <div className="market">
      <table className="market-table">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Trade Good</th>
            <th style={{ width: "40%" }}>Buy Price</th>
            <th style={{ width: "40%" }}>Sell Price</th>
          </tr>
        </thead>
        <tbody>
          {isMarket ? (
            tradeGood ? (
              tradeGood.map((item, index) => (
                <tr key={index}>
                  <td>
                    {formatFirstLetterToUpperCase(
                      replaceUnderscoreWithSpace(item.symbol)
                    )}
                  </td>
                  {TradeButton(item)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Loading...</td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={3}>No Marketplace</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Market;
