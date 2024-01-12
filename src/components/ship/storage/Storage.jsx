import React, { useState, useEffect } from "react";
import "./storage.css";
import {
  formatFirstLetterToUpperCase,
  replaceUnderscoreWithSpace,
} from "../../../utils";
import { useShipContext } from "../../../context/shipContext";

const Storage = ({ data }) => {
  const { getCargo, cargo } = useShipContext();

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
