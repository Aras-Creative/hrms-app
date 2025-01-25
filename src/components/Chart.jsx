import React from "react";

export const DonutChart = ({
  progress,
  text,
  radius = 50,
  strokeWidth = 17,
  textSize = "text-xl",
  bgTextColor = "white",
  textColor = "black",
  strokeColor = "red-500",
}) => {
  const normalizedRadius = radius + strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDasharray = circumference;
  const strokeDashoffset2 = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center p-2">
      <svg width={normalizedRadius * 2} height={normalizedRadius * 2} viewBox={`0 0 ${normalizedRadius * 2} ${normalizedRadius * 2}`}>
        <circle cx={normalizedRadius} cy={normalizedRadius} r={radius} className="stroke-red-500" strokeWidth={strokeWidth} fill="transparent" />

        <circle
          cx={normalizedRadius}
          cy={normalizedRadius}
          r={radius}
          className={`stroke-${strokeColor}`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset2}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>

      <div className={`absolute font-semibold ${textSize} bg-${bgTextColor} ${textColor} p-2 rounded-full`}>{text}</div>
    </div>
  );
};

export default DonutChart;
