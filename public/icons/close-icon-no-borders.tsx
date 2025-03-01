import { SVGProps } from "react";

export function CloseIconNoBorders(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 8.35474L8 16.3547M8 8.35474L16 16.3547"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
