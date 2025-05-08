import { SVGProps } from "react";

export function SuccessShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="72"
      height="74"
      viewBox="0 0 72 74"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M32.2785 1.546L12.5807 8.92372C8.82025 10.3563 5.74023 14.7972 5.74023 18.8442V47.8537C5.74023 50.7547 7.63839 54.5868 9.96631 56.3059L29.6641 71.0255C33.1381 73.6399 38.8325 73.6399 42.3065 71.0255L62.0043 56.3059C64.3322 54.551 66.2304 50.7547 66.2304 47.8537V18.8442C66.2304 14.8331 63.1504 10.3563 59.3899 8.95954L39.6921 1.58182C37.6865 0.793905 34.3199 0.793905 32.2785 1.546Z"
        fill="#56B56A"
      />
      <g filter="url(#filter0_d_4754_33090)">
        <path
          d="M31.9807 43.8051C31.4107 43.8051 30.8407 43.5951 30.3907 43.1451L25.5607 38.3151C24.6907 37.4451 24.6907 36.0051 25.5607 35.1351C26.4307 34.2651 27.8707 34.2651 28.7407 35.1351L31.9807 38.3751L43.2907 27.0651C44.1607 26.1951 45.6007 26.1951 46.4707 27.0651C47.3407 27.9351 47.3407 29.3751 46.4707 30.2451L33.5707 43.1451C33.1207 43.5951 32.5507 43.8051 31.9807 43.8051Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4754_33090"
          x="20.9082"
          y="26.4126"
          width="30.2148"
          height="25.3926"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.478431 0 0 0 0 0.196078 0 0 0 0.48 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4754_33090"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4754_33090"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
