import React from 'react';
import { ArrowRight } from 'lucide-react';

export function FlowButton({ 
  text = "Modern Button", 
  onClick, 
  href, 
  to,
  as = "button",
  variant = "default",
  className = "",
  ...props 
}) {
  const isOutline = variant === "outline";

  const baseClasses = `group relative flex items-center justify-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] px-6 sm:px-8 py-3.5 sm:py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-white hover:rounded-[12px] active:scale-[0.95] ${
    isOutline
      ? "border-slate-600 bg-transparent text-white"
      : "border-accent/60 bg-accent/10 text-accent"
  } ${className}`;

  const circleClasses = `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:rounded-none group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] bg-accent`;

  const arrowStroke = isOutline
    ? "stroke-white"
    : "stroke-accent group-hover:stroke-white";

  const content = (
    <>
      {/* Left arrow - slides in on hover */}
      <ArrowRight
        className={`absolute w-4 h-4 left-[-25%] fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${arrowStroke}`}
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out">
        {text}
      </span>

      {/* Circle expanding on hover */}
      <span className={circleClasses}></span>

      {/* Right arrow - slides out on hover */}
      <ArrowRight
        className={`absolute w-4 h-4 right-4 fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${arrowStroke}`}
      />
    </>
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={baseClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses} {...props}>
      {content}
    </button>
  );
}
