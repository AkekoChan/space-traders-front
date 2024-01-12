import React, { useState, useEffect } from "react";
import stopWatchIcon from "../../assets/icons/stopwatch.svg";
import "./cooldown.css";

const Cooldown = ({ startTime, endTime, onCooldownEnd, isExtractCooldown }) => {
  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    const timeRemaining = Math.max(
      0,
      new Date(endTime).getTime() - currentTime
    );
    return timeRemaining;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    if (new Date(endTime).getTime() <= new Date().getTime()) {
      return;
    }

    const interval = setInterval(() => {
      const remainingTime = calculateTimeLeft();
      setTimeLeft(remainingTime);

      if (remainingTime === 0 && onCooldownEnd) {
        onCooldownEnd();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onCooldownEnd]);

  const isCooldownActive = new Date(endTime).getTime() > new Date().getTime();

  if (!isCooldownActive) {
    return null;
  }

  let totalTime;
  if (startTime instanceof Date) {
    totalTime = new Date(endTime).getTime() - startTime.getTime();
  } else {
    totalTime = startTime * 1000;
  }

  const elapsedPercentage = ((totalTime - timeLeft) / totalTime) * 100;
  const remainingTimeLabel = totalTime > 0 ? Math.floor(timeLeft / 1000) : 0;

  return (
    <div className="cooldown">
      {isExtractCooldown === false ? (
        <div className="cooldown-bar-container">
          <div
            className="cooldown-bar"
            style={{ width: `${elapsedPercentage}%` }}
          ></div>
        </div>
      ) : (
        <img
          style={{ width: "3rem", height: "3rem" }}
          src={stopWatchIcon}
          alt="Stopwatch"
          className="cooldown-icon"
        />
      )}
      <span
        className={`cooldown-label ${isExtractCooldown ? "extract-label" : ""}`}
      >
        {remainingTimeLabel}s
      </span>
    </div>
  );
};

export default Cooldown;
