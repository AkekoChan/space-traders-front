import React from "react";

import "./storage.css";

const Storage = ({ data }) => {
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
          {data?.cargo.inventory.map((item, index) => (
            <tr key={index}>
              <td>
                <span>{item.name}</span>
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
