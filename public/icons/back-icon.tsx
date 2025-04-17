import React from "react";

interface BackIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  onClick?: () => void;
}

export const BackIcon: React.FC<BackIconProps> = ({
  size = 40,
  color = "#101010",
  strokeWidth = 1.5,
  className = "",
  onClick,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <rect y="0.84375" width="40" height="40" rx="8" fill="#F8F8F8" />
      <path
        d="M22 24.8438L18 20.8438L22 16.8438"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

