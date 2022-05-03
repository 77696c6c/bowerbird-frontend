import * as React from 'react';

type IDeepositImageProps = {
  className?: string;
  width?: number;
  height?: number;
};

function DepositImage(props: IDeepositImageProps) {
  const { className = '', width = 360, height = 250 } = props;
  return (
    <svg
      id="BowerbirdDeposit-01_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 72 50"
      xmlSpace="preserve"
    >
      <defs>
        <linearGradient
          id="BowerbirdDeposit-01_svg__linear-gradient"
          x1={4.94}
          y1={36.3}
          x2={19.17}
          y2={17.55}
          gradientTransform="matrix(1 0 0 -1 0 52)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#2ea9e0" />
          <stop offset={0} stopColor="#24b1e6" />
          <stop offset={1} stopColor="#389bd6" />
        </linearGradient>
        <style>
          {
            '.BowerbirdDeposit-01_svg__cls-3{fill:#000b2f}.BowerbirdDeposit-01_svg__cls-5{fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke:#fff}'
          }
        </style>
      </defs>
      <circle
        cx={12}
        cy={25}
        r={12}
        fill="url(#BowerbirdDeposit-01_svg__linear-gradient)"
      />
      <text
        transform="translate(6.52 31.61)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={19.53}
        fill="#fff"
        fontFamily="Roboto-Regular,Roboto"
      >
        $
      </text>
      <path
        className="BowerbirdDeposit-01_svg__cls-3"
        d="M21.42 12.09a15.21 15.21 0 012.06-3 16.16 16.16 0 012.75-2.54 14 14 0 011.45-1 15.34 15.34 0 011.56-.82 15 15 0 014.5-1.32 15.38 15.38 0 014.74.11A15.76 15.76 0 0143 5.06a15.92 15.92 0 013.91 2.81c.34.33.64.66.91 1l-3.19-.74a1.68 1.68 0 00-1.24.21 1.6 1.6 0 00-.72 1 1.64 1.64 0 00.21 1.24 1.55 1.55 0 001 .72c2.39.56 4.82 1.11 7.22 1.66a1.64 1.64 0 002-1.22.3.3 0 000-.13l.9-7.22a.2.2 0 000-.07A1.64 1.64 0 0050.72 4l-.32 2.76-.13-.15a15.1 15.1 0 00-1-1.11A19.34 19.34 0 0039.05.26a19 19 0 00-5.74-.12 18.42 18.42 0 00-5.47 1.61c-.65.3-1.26.62-1.85 1s-1.16.73-1.71 1.13a19.85 19.85 0 00-3.48 3.21A18.8 18.8 0 0018.26 11l-.26.53 3.24.88zM50.58 37.91a15.21 15.21 0 01-2.06 3 16.16 16.16 0 01-2.75 2.54 14 14 0 01-1.45 1 15.34 15.34 0 01-1.56.82 15 15 0 01-4.5 1.32 15.38 15.38 0 01-4.74-.11A15.76 15.76 0 0129 44.94a15.92 15.92 0 01-3.91-2.81c-.34-.33-.64-.66-.91-1l3.19.74a1.68 1.68 0 001.24-.21 1.6 1.6 0 00.72-1 1.64 1.64 0 00-.21-1.24 1.55 1.55 0 00-1-.72c-2.39-.56-4.82-1.11-7.22-1.66a1.64 1.64 0 00-2 1.22.3.3 0 000 .13l-.9 7.22a.2.2 0 000 .07 1.64 1.64 0 003.27.34l.32-2.78.13.15a15.1 15.1 0 001 1.11A19.34 19.34 0 0033 49.74a19 19 0 005.74.12 18.42 18.42 0 005.47-1.61c.65-.3 1.26-.62 1.85-1s1.16-.73 1.71-1.13a19.85 19.85 0 003.48-3.25A18.8 18.8 0 0053.74 39l.26-.53-3.24-.88z"
      />
      <circle cx={60} cy={25} r={12} fill="#12335a" />
      <path
        className="BowerbirdDeposit-01_svg__cls-5"
        d="M70.54 27.48a20.49 20.49 0 01-4.33 2.23A18.12 18.12 0 0160 30.94a11 11 0 005.16-1.41 10.35 10.35 0 003.94-4.62M52.8 21.66a7.92 7.92 0 002 6.48 8.11 8.11 0 004.92 2.37"
      />
      <path
        className="BowerbirdDeposit-01_svg__cls-5"
        d="M49.16 27.48a20 20 0 004.33 2.23A18.29 18.29 0 0059.7 31a11.08 11.08 0 01-5.16-1.41 10.4 10.4 0 01-3.94-4.62"
      />
      <path
        d="M66.89 21.66a7.69 7.69 0 01-2.06 6.48 8.63 8.63 0 01-5.13 2.37"
        stroke="#f1f2f2"
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit={10}
      />
      <text
        transform="translate(56.64 27.94)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={11.84}
        fill="#fff"
        fontFamily="Roboto-Regular,Roboto"
      >
        $
      </text>
    </svg>
  );
}

export { DepositImage };
