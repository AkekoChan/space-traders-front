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
      // Si le temps de fin est déjà dépassé, ne pas démarrer le timer
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

  const totalTime = new Date(endTime).getTime() - new Date(startTime).getTime();
  const elapsedPercentage = ((totalTime - timeLeft) / totalTime) * 100;
  console.log(elapsedPercentage);

  return (
    <div className="cooldown">
      <div className="cooldown-bar-container">
        <div
          className="cooldown-bar"
          style={{ width: `${elapsedPercentage}%` }}
        ></div>
      </div>
      <span className="cooldown-label">{Math.floor(timeLeft / 1000)}s</span>
    </div>
  );
};

export default Cooldown;
