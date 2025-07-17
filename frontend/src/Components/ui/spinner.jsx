// CircularSpinner.tsx
import React from "react";
import "./spinner.css"
export default function CircularSpinner() {
  const bars = new Array(12).fill(0);

  return (
    <div className="relative text-black w-20 h-20">
      {bars.map((_, i) => {
        const rotation = (i * 30); // 360 / 12
        const delay = (i * 0.1).toFixed(2);
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-5 rounded-sm origin-center"
            style={{
              transform: `rotate(${rotation}deg) translateY(-40%)`,
              animation: `spinnerFade 1.2s linear infinite`,
              animationDelay: `${delay}s`,
              backgroundColor: "red",
              opacity: 0.1,
            }}
          ></div>
        );
      })}
    </div>
  );
}
