import * as React from 'react';

type ILiquidationImageProps = {
  className?: string;
  width?: number;
  height?: number;
};

function LiquidationImage(props: ILiquidationImageProps) {
  const { className = '', width = 360, height = 250 } = props;
  return (
    <svg
      id="BowerbirdSwap-01_svg__Layer_1"
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
          id="BowerbirdLiquidation-01_svg__a"
          x1={52.94}
          y1={36.3}
          x2={67.17}
          y2={17.55}
          gradientTransform="matrix(1 0 0 -1 0 52)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#2ea9e0" />
          <stop offset={0} stopColor="#24b1e6" />
          <stop offset={1} stopColor="#389bd6" />
        </linearGradient>
      </defs>
      <circle
        cx={60}
        cy={25}
        r={12}
        fill="url(#BowerbirdLiquidation-01_svg__a)"
      />
      <text
        transform="translate(54.52 31.61)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={19.53}
        fill="#fff"
        fontFamily="Roboto-Regular,Roboto"
      >
        $
      </text>
      <circle cx={12} cy={25} r={12} fill="#231f20" />
      <path
        d="M5.35 20.2v9.88l6.37 2.3v-10l6.93-2.59-6.28-2.21z"
        fill="#f4c26d"
      />
      <path d="M12.18 22.78v5.27l6.47 2.3v-10z" fill="#dfa74f" />
      <path
        d="M45.36 24.33s-.06-.07-.09-.1l-5-5.22v-.05a1.65 1.65 0 00-2.33 2.33l2 2h-.28a2.16 2.16 0 01.29 1.41 2.19 2.19 0 01-.36 1.89h.37l-2.58 2a1.66 1.66 0 00-.62 1.09A1.62 1.62 0 0037 30.9a1.69 1.69 0 001.09.62 1.62 1.62 0 001.2-.34c1.94-1.5 3.9-3 5.83-4.56a1.64 1.64 0 00.24-2.29z"
        fill="#000b2f"
      />
      <path
        fill="none"
        stroke="#0b132e"
        strokeMiterlimit={10}
        strokeWidth={3.4}
        d="M26.3 25h18"
      />
    </svg>
  );
}

export { LiquidationImage };
