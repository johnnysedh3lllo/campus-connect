
export const AddIcon = ({ size = 24 }) => {
  const aspectRatio = 24 / 25;
  const height = size / aspectRatio;

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12.4531H18M12 18.4531V6.45312"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

