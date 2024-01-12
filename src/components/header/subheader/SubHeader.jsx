import React, { useState } from "react";

import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

import "./subheader.css";

const SubHeader = React.forwardRef(({ agent, token }, ref) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(token);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className="header__subheader" ref={ref}>
      <ul className="header__sublist">
        <li className="header__subitem-name">
          <span className="bold">{agent?.symbol}</span>
        </li>
        <li className="header__subitem-count">
          Ship count: <span className="bold">{agent?.shipCount}</span>
        </li>
        <li className="header__subitem-hq">
          Headquaters: <span className="bold">{agent?.headquarters}</span>
        </li>
        <li className="header__subitem-faction">
          Faction: <span className="bold">{agent?.startingFaction}</span>
        </li>
        <li className="header__subitem-token">
          <button className="header__subitem-button" onClick={handleCopy}>
            {isCopied ? (
              <CheckOutlined style={{ fontSize: "1.5rem", color: "#171c21" }} />
            ) : (
              <CopyOutlined style={{ fontSize: "1.5rem", color: "#171c21" }} />
            )}
            Copy your token
          </button>
        </li>
      </ul>
    </div>
  );
});

export default SubHeader;
