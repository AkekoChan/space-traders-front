import React, { useState, useEffect } from "react";
import "./storage.css";
import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
} from "../../../utils";
import { useShipContext } from "../../../context/shipContext";

const Storage = ({ data }) => {
  const { getCargo, cargo } = useShipContext();

  // const [isClicked, setIsClicked] = useState({});
  // const [quantity, setQuantity] = useState({});

  // const handleSellItem = async (item) => {
  //   setIsClicked({ ...isClicked, [item.symbol]: !isClicked[item.symbol] });
  //   setQuantity({ ...quantity, [item.symbol]: 0 });

  //   if (isClicked[item.symbol] && quantity[item.symbol] > 0) {
  //     try {
  //       const response = await sellCargo(
  //         item.symbol,
  //         data.symbol,
  //         quantity[item.symbol]
  //       );
  //       updateStorage(response.cargo);
  //     } catch (error) {
  //       console.error("Error selling item:", error);
  //     }
  //   }
  // };

  // const handleChangeQuantity = (event, item) => {
  //   setQuantity({ ...quantity, [item.symbol]: event.target.value });
  // };

  useEffect(() => {
    getCargo(data.symbol);
  }, [data.symbol]);

  return (
    <div className="ship-storage">
      <table className="fleet-table">
        <thead>
          <tr>
            <th style={{ width: "60%" }}>Name</th>
            <th style={{ width: "40%" }}>Quantity</th>
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
                <td>x{item.units}</td>
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
