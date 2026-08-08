import React, { useState } from "react";
import { Link } from "react-scroll";

export const SpotlightButton = ({ 
  children, 
  to, 
  as = "button", 
  href, 
  className, 
  glowColor = "rgba(255,255,255,0.5)",
  ...props 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const commonProps = {
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setOpacity(1),
    onMouseLeave: () => setOpacity(0),
    className: `relative overflow-hidden ${className}`,
    ...props
  };

  const glow = (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-in-out z-0 mix-blend-overlay"
      style={{
        opacity,
        background: `radial-gradient(120px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
      }}
    />
  );

  const content = <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">{children}</span>;

  if (as === "Link" && to) {
    return (
      <Link to={to} {...commonProps}>
        {glow}
        {content}
      </Link>
    );
  }

  if (as === "a" && href) {
    return (
      <a href={href} {...commonProps}>
        {glow}
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps}>
      {glow}
      {content}
    </button>
  );
};
