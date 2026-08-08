import React from 'react';
import './BorderBeamCard.css';

export const BorderBeamCard = ({ children, className = "" }) => {
  return (
    <div className={`border-beam-wrapper ${className}`}>
      {/* Animated gradient spinning in the background */}
      <div className="border-beam-gradient"></div>
      
      {/* Inner card that masks the center of the gradient, leaving only the border */}
      <div className="relative z-10 bg-secondary rounded-[14px] w-full h-full flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};
