import React from "react";

type ArrowBoxIconProps = {
  size?: number;
};

export const RightArrowBoxIcon: React.FC<ArrowBoxIconProps> = ({
  size = 40,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="40"
      height="40"
      rx="8"
      transform="matrix(-1 0 0 1 40 0)"
      fill="#F8F8F8"
    />
    <path
      d="M18 24L22 20L18 16"
      stroke="#101010"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
