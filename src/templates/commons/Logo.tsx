import * as React from 'react';

type ILogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

function Logo(props: ILogoProps) {
  const { className = '', width = 200, height = 48 } = props;
  return (
    <svg
      id="Logo-01_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 700 168"
      xmlSpace="preserve"
    >
      <defs>
        <style>
          {
            '.Logo-01_svg__cls-1,.Logo-01_svg__cls-2{fill:none;stroke-linecap:round;stroke:#231f20;stroke-miterlimit:10}.Logo-01_svg__cls-2{stroke:#fff;stroke-width:11px}.Logo-01_svg__cls-5{letter-spacing:.01em}'
          }
        </style>
      </defs>
      <g id="Logo-01_svg__Nest">
        <path
          className="Logo-01_svg__cls-1"
          d="M235.39 110.52a191.08 191.08 0 01-40.55 20.88c-31.51 11.68-58 11.92-58 11.54s24.92.82 48.25-13.16c18.93-11.35 30.06-28.67 36.82-43.24M69.49 56.17C68.84 60.33 64.43 92 88 116.71c17.55 18.39 39.72 21.54 46 22.22"
        />
        <path
          className="Logo-01_svg__cls-1"
          d="M35.39 110.56a190.75 190.75 0 0040.54 20.87c31.51 11.69 58 11.92 58 11.54s-24.93.83-48.26-13.15c-18.92-11.35-30-28.67-36.82-43.25M201.25 56.13c.68 4.16 5.28 35.84-19.32 60.57-18.3 18.4-41.43 21.55-48 22.23"
        />
        <path
          className="Logo-01_svg__cls-2"
          d="M235.39 110.52a191.08 191.08 0 01-40.55 20.88c-31.51 11.68-58 11.92-58 11.54s24.92.82 48.25-13.16c18.93-11.35 30.06-28.67 36.82-43.24M69.49 56.17C68.84 60.33 64.43 92 88 116.71c17.55 18.39 39.72 21.54 46 22.22"
        />
        <path
          className="Logo-01_svg__cls-2"
          d="M35.39 110.56a190.75 190.75 0 0040.54 20.87c31.51 11.69 58 11.92 58 11.54s-24.93.83-48.26-13.15c-18.92-11.35-30-28.67-36.82-43.25M201.25 56.13c.68 4.16 5.28 35.84-19.32 60.57-18.3 18.4-41.43 21.55-48 22.23"
        />
      </g>
      <text
        transform="translate(101.36 114.78)"
        fill="#fff"
        fontFamily="Overpass-Medium,Overpass"
        fontWeight={500}
        fontSize={100}
        stroke="#fff"
        strokeMiterlimit={10}
      >
        B
      </text>
      <text
        transform="translate(281.08 116.8)"
        fontSize={84}
        fill="#fff"
        fontFamily="Overpass-Medium,Overpass"
        fontWeight={500}
        stroke="#fff"
        strokeMiterlimit={10}
      >
        <tspan className="Logo-01_svg__cls-5">B</tspan>
        <tspan x={56.74} y={0} letterSpacing="-.01em">
          o
        </tspan>
        <tspan x={103.02} y={0} letterSpacing="-.01em">
          w
        </tspan>
        <tspan className="Logo-01_svg__cls-5" x={163.29} y={0}>
          e
        </tspan>
        <tspan x={209.7} y={0} letterSpacing={0}>
          r
        </tspan>
        <tspan x={242.72} y={0}>
          bi
        </tspan>
        <tspan x={312.48} y={0} letterSpacing="-.02em">
          r
        </tspan>
        <tspan x={343.81} y={0}>
          d
        </tspan>
      </text>
    </svg>
  );
}

export { Logo };
