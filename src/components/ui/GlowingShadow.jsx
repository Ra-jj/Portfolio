import React from "react";
import "./GlowingShadow.css";

export function GlowingShadow({ children, className = "" }) {
  return (
    <div className="glow-container">
      <span className="glow"></span>
      <div className={`glow-content ${className}`}>{children}</div>
    </div>
  );
}
