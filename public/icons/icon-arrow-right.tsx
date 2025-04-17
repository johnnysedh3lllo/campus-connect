import React from "react";

type ChevronRightIconProps = {
  size?: number;
};

export const RightArrowIcon: React.FC<ChevronRightIconProps> = ({
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.7953 11.9999L9.19531 7.39989L9.90331 6.69189L15.2113 11.9999L9.90331 17.3079L9.19531 16.5999L13.7953 11.9999Z"
      fill="#101010"
    />
  </svg>
);
