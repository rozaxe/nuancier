import React from "react";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg width="24" height="24" viewBox="-25 -25 400 400">
        <circle
          stroke="var(--ui-text)"
          stroke-opacity="0.1"
          cx="175"
          cy="175"
          r="175"
          stroke-width="50"
          fill="none"
        ></circle>
        <circle
          stroke="var(--ui-text)"
          stroke-opacity="0.3"
          transform="rotate(-90 175 175)"
          cx="175"
          cy="175"
          r="175"
          stroke-dasharray="1100"
          stroke-width="50"
          stroke-dashoffset="1100"
          stroke-linecap="round"
          fill="none"
          style={{
            strokeDashoffset: "748px",
            transition: "stroke-dashoffset 1s ease-out 0s",
          }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 175 175"
            to="360 175 175"
            dur="0.50s"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
      </svg>
    </div>
  );
}
