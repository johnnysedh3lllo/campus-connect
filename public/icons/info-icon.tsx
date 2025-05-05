import { SVGProps } from "react";

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.5 8.35449V12.3545M12.5 16.3545H12.51M22.5 12.3545C22.5 17.8773 18.0228 22.3545 12.5 22.3545C6.97715 22.3545 2.5 17.8773 2.5 12.3545C2.5 6.83164 6.97715 2.35449 12.5 2.35449C18.0228 2.35449 22.5 6.83164 22.5 12.3545Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
