import React, { useState, useEffect } from "react";

import "./storage.css";

import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
} from "../../../utils";

import { useShipContext } from "../../../context/shipContext";

const Storage = ({ data }) => {
  const { shipData } = useShipContext();
  console.log(shipData);
  const [storage, setstorage] = useState(
    shipData && shipData.inventory ? shipData.inventory : data.cargo.inventory
  );

  useEffect(() => {
    setstorage(
      shipData && shipData.inventory ? shipData.inventory : data.cargo.inventory
    );
  }, [shipData]);

  return (
    <div className="ship-storage">
      <table className="fleet-table">
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Name</th>
            <th style={{ width: "20%" }}>Quantity</th>
            <th style={{ width: "20%" }}>Purchase Price</th>
            <th style={{ width: "20%" }}>Sell Price</th>
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
              <td>-</td>
              <td>-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Storage;
