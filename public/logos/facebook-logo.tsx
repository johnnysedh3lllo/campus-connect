import { SVGProps } from "react";

export function FacebookLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.5 13.5H17L18 9.5H14.5V7.5C14.5 6.47 14.5 5.5 16.5 5.5H18V2.14C17.674 2.097 16.443 2 15.143 2C12.428 2 10.5 3.657 10.5 6.7V9.5H7.5V13.5H10.5V22H14.5V13.5Z"
        fill="#3D5A98"
      />
    </svg>
  );
}
