import React from "react";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingOverlay,
} from "@floating-ui/react";

import "./navigate.css";

import {
  CloseOutlined,
  SendOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import fuel from "../../assets/icons/fuel.svg";
import cargo from "../../assets/icons/cargo.svg";
import wrench from "../../assets/icons/wrench.svg";
import fastForwad from "../../assets/icons/fast-forward.svg";
import fastBackward from "../../assets/icons/fast-backward.svg";
import burn from "../../assets/icons/burn.svg";
import eyeSlash from "../../assets/icons/eye-slash.svg";

const Dialog = ({ isOpen, onClose }) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: onClose,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
  });
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      {isOpen && (
        <FloatingOverlay
          lockScroll
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            padding: "1.5rem",
            zIndex: 1000,
          }}
        >
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              className="navigate"
            >
              <div className="navigate-container">
                <div className="navigate-header">
                  <h2 className="navigate-title">
                    Ship Navigate:{" "}
                    <span className="navigate-ship-name">AKEKO-1</span>
                  </h2>
                  <button onClick={onClose} className="navigate-close-button">
                    <CloseOutlined
                      style={{ fontSize: "1.5rem", color: "#fff" }}
                    />
                  </button>
                </div>
                <div className="navigate-info-container">
                  <div className="navigate-info">
                    <p>System</p>
                    <span className="navigate-waypoint badge-gradient">
                      X1-JR22
                    </span>
                  </div>
                  <div className="navigate-info">
                    <p>Waypoint</p>
                    <span className="navigate-waypoint badge-gradient">
                      X1-JR22-A2
                    </span>
                  </div>
                  <div className="navigate-status">
                    <div className="navigate-badges">
                      <span className="badge-gray">In orbit</span>
                      <span className="badge-gray">Cruise</span>
                    </div>
                  </div>
                  <div className="navigate-state">
                    <ul className="navigate-state__list">
                      <li className="navigate-state__item">
                        <p>Fuel</p>
                        <div className="navigate-state__item-value-container">
                          <img src={fuel} alt="Fuel Icon" />
                          <span className="navigate-state__item-value">
                            400 / 400
                          </span>
                        </div>
                        <button className="navigate-sate__item-button">
                          Refuel
                        </button>
                      </li>
                      <li className="navigate-state__item">
                        <p>Cargo</p>
                        <div className="navigate-state__item-value-container">
                          <img src={cargo} alt="Cargo Icon" />
                          <span className="navigate-state__item-value">
                            40 / 40
                          </span>
                        </div>
                      </li>
                      <li className="navigate-state__item">
                        <p>Condition</p>
                        <div className="navigate-state__item-value-container">
                          <img src={wrench} alt="Wrench Icon" />
                          <span className="navigate-state__item-value">
                            100 / 100
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="navigate-buttons">
                  <button className="navigate-btn__mode-primary">Dock</button>
                  <div className="navigate-flight-mode">
                    <ul className="navigate-mode-list">
                      <li className="navigate-mode-list-item">
                        <button className="navigate-btn__mode-secondary">
                          <img src={fastForwad} alt="Fast Forward Icon" />
                          Cruise
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button className="navigate-btn__mode-secondary">
                          <img src={fastBackward} alt="Fast Backward Icon" />
                          Drift
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button className="navigate-btn__mode-secondary">
                          <img src={burn} alt="Burn Icon" />
                          Burn
                        </button>
                      </li>
                      <li className="navigate-mode-list-item">
                        <button className="navigate-btn__mode-secondary">
                          <img src={eyeSlash} alt="Eye Slash Icon" />
                          Stealth
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="navigate-table-container">
                <table className="navigate-table">
                  <thead>
                    <tr>
                      <th style={{ width: "25%" }}>Waypoint</th>
                      <th style={{ width: "20%" }}>Distance (Time)</th>
                      <th style={{ width: "15%" }}>Type</th>
                      <th style={{ width: "30%" }}>Traits</th>
                      <th style={{ width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="navigate-table__waypoint">Hd-d52-dzd</td>
                      <td className="navigate-table__distance">
                        152 <span>(15s)</span>
                      </td>
                      <td>
                        <span className="badge-gray">Planet</span>
                      </td>
                      <td>
                        <div className="navigate-table__traits">
                          <span className="badge-gray">Market</span>
                          <span className="badge-gray">Shipyard</span>
                        </div>
                      </td>
                      <td>
                        <button className="navigate-table__button">
                          <SendOutlined
                            style={{ fontSize: "1.5rem", color: "#171c21" }}
                          />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
};

export default Dialog;
