import { SVGProps } from "react";

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.5 19C15.1945 19 19 15.1945 19 10.5C19 5.8055 15.1945 2 10.5 2C5.8055 2 2 5.8055 2 10.5C2 15.1945 5.8055 19 10.5 19Z"
        stroke="#878787"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.3289 7.1715C12.9578 6.79952 12.5169 6.50452 12.0315 6.30348C11.5461 6.10243 11.0258 5.9993 10.5004 6C9.97498 5.9993 9.45462 6.10243 8.96921 6.30348C8.48381 6.50452 8.04291 6.79952 7.67188 7.1715M16.6114 16.611L20.8539 20.8535"
        stroke="#878787"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
