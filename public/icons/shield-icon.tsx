import { SVGProps } from "react";

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="72"
      height="73"
      viewBox="0 0 72 73"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M32.2785 1.12217L12.5807 8.49989C8.82025 9.93246 5.74023 14.3734 5.74023 18.4204V47.4299C5.74023 50.3308 7.63839 54.163 9.96631 55.882L29.6641 70.6017C33.1381 73.2161 38.8325 73.2161 42.3065 70.6017L62.0043 55.882C64.3322 54.1272 66.2304 50.3308 66.2304 47.4299V18.4204C66.2304 14.4092 63.1504 9.93246 59.3899 8.53571L39.6921 1.15799C37.6865 0.370077 34.3199 0.370077 32.2785 1.12217Z"
        fill="#56B56A"
      />
      <g filter="url(#filter0_d_2547_17155)">
        <path
          d="M31.9797 43.3818C31.4097 43.3818 30.8397 43.1718 30.3897 42.7218L25.5597 37.8918C24.6897 37.0218 24.6897 35.5818 25.5597 34.7118C26.4297 33.8418 27.8697 33.8418 28.7397 34.7118L31.9797 37.9518L43.2897 26.6418C44.1597 25.7718 45.5997 25.7718 46.4697 26.6418C47.3397 27.5118 47.3397 28.9518 46.4697 29.8218L33.5697 42.7218C33.1197 43.1718 32.5497 43.3818 31.9797 43.3818Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2547_17155"
          x="20.9072"
          y="25.9893"
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
            result="effect1_dropShadow_2547_17155"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2547_17155"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
