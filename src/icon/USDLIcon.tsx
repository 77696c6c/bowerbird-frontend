import * as React from 'react';

type IUSDLIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

function USDLIcon(props: IUSDLIconProps) {
  const { className = '', width = 128, height = 128 } = props;
  return (
    <svg
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
        <linearGradient
          id="USDLCircular_svg__a"
          x1={51.74}
          y1={28.24}
          x2={200.83}
          y2={224.7}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopColor="#00abee" />
          <stop offset={0} stopColor="#00b3ee" />
          <stop offset={1} stopColor="#009fee" />
        </linearGradient>
      </defs>
      <circle
        cx={125.7}
        cy={125.7}
        r={125.7}
        fill="url(#USDLCircular_svg__a)"
      />
      <text
        transform="translate(68.27 194.97)"
        style={{
          isolation: 'isolate',
        }}
        fontSize={204.54}
        fill="#fff"
        fontFamily="Roboto-Regular,Roboto"
      >
        $
      </text>
    </svg>
  );
}

export { USDLIcon };
