import React from "react";

const CircularProgressBar = ({
  progress,
  text,
  radius = 50,
  strokeWidth = 17,
  textSize = "text-xl",
  bgTextColor = "white",
  textColor = "black",
  baseColor = "stroke-gray-300",
  strokeColor = "stroke-indigo-500",
}) => {
  const normalizedRadius = radius + strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative flex justify-center items-center p-2">
      <svg width={normalizedRadius * 2} height={normalizedRadius * 2} viewBox={`0 0 ${normalizedRadius * 2} ${normalizedRadius * 2}`}>
        <circle cx={normalizedRadius} cy={normalizedRadius} r={radius} className={baseColor} strokeWidth={strokeWidth} fill="transparent" />
        <circle
          cx={normalizedRadius}
          cy={normalizedRadius}
          r={radius}
          className={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <div className={`absolute font-semibold ${textSize} bg-${bgTextColor} ${textColor} p-2 rounded-full`}>{text}</div>
    </div>
  );
};

export default CircularProgressBar;
