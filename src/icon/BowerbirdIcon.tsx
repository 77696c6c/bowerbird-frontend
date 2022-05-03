import * as React from 'react';

type IBowerbirdIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

function BowerbirdIcon(props: IBowerbirdIconProps) {
  const { className = '', width = 128, height = 128 } = props;
  return (
    <svg
      id="BowerbirdToken-01_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 251.4 251.4"
      xmlSpace="preserve"
    >
      <defs>
        <style>
          {
            '.BowerbirdToken-01_svg__cls-2{fill:none;stroke-linecap:round;stroke-width:8px;stroke:#fff;stroke-miterlimit:10}'
          }
        </style>
      </defs>
      <circle cx={125.21} cy={125.76} r={125.7} fill="#0D2B59" />
      <path
        className="BowerbirdToken-01_svg__cls-2"
        d="M235.63 151.7a213.93 213.93 0 01-45.41 23.37c-35.29 13.1-64.95 13.36-65 12.93s27.91.93 54-14.74c21.2-12.7 33.66-32.1 41.24-48.43M49.83 90.82c-.73 4.65-5.67 40.12 20.74 67.8 19.65 20.6 44.48 24.13 51.48 24.89"
      />
      <path
        className="BowerbirdToken-01_svg__cls-2"
        d="M11.63 151.74A214.36 214.36 0 0057 175.12c35.29 13.09 64.95 13.35 65 12.92s-27.92.93-54-14.73c-21.2-12.71-33.67-32.11-41.25-48.44"
      />
      <path
        d="M197.39 90.78c.77 4.66 5.92 40.14-21.63 67.83-20.5 20.61-46.41 24.14-53.71 24.9"
        stroke="#f1f2f2"
        strokeMiterlimit={10}
        fill="none"
        strokeLinecap="round"
        strokeWidth={8}
      />
      <text
        transform="translate(85.52 156.46)"
        fontSize={112}
        fill="#fff"
        fontFamily="Overpass-Medium,Overpass"
        fontWeight={500}
        strokeMiterlimit={10}
        stroke="#fff"
      >
        B
      </text>
    </svg>
  );
}

export { BowerbirdIcon };
