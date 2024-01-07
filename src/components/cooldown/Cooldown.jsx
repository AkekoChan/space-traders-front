import React, { useState, useEffect } from "react";
import "./cooldown.css";

const Cooldown = ({ startTime, endTime, onCooldownEnd }) => {
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
      <div className="cooldown-bar-container">
        <div
          className="cooldown-bar"
          style={{ width: `${elapsedPercentage}%` }}
        ></div>
      </div>
      <span className="cooldown-label">{remainingTimeLabel}s</span>
    </div>
  );
};

export default Cooldown;
