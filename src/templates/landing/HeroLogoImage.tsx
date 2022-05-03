import * as React from 'react';

type IHeroLogoImageProps = {
  className?: string;
  width?: number;
  height?: number;
};

function HeroLogoImage(props: IHeroLogoImageProps) {
  const { className = '', width = 360, height = 250 } = props;
  return (
    <svg
      id="HeroLogo-01_svg__Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 440 272"
      xmlSpace="preserve"
    >
      <defs>
        <style>
          {
            '.HeroLogo-01_svg__cls-1,.HeroLogo-01_svg__cls-2{fill:none;stroke-linecap:round;stroke:#231f20;stroke-miterlimit:10}.HeroLogo-01_svg__cls-2{stroke:#12335a;stroke-width:11px}.HeroLogo-01_svg__cls-5{letter-spacing:.01em}'
          }
        </style>
      </defs>
      <g id="HeroLogo-01_svg__HeroLogo">
        <path
          className="HeroLogo-01_svg__cls-1"
          d="M321.92 122.81a191.47 191.47 0 01-40.54 20.87c-31.51 11.69-58 11.92-58 11.54s24.93.83 48.25-13.16c18.93-11.34 30.06-28.67 36.83-43.24M156 68.45c-.65 4.16-5.06 35.82 18.52 60.54 17.54 18.39 39.71 21.54 46 22.22"
        />
        <path
          className="HeroLogo-01_svg__cls-1"
          d="M121.92 122.84a191.55 191.55 0 0040.55 20.88c31.51 11.68 58 11.92 58 11.53s-24.92.83-48.25-13.15c-18.93-11.35-30.06-28.67-36.82-43.24M287.78 68.41c.69 4.16 5.28 35.84-19.31 60.57-18.31 18.4-41.44 21.55-48 22.23"
        />
        <path
          className="HeroLogo-01_svg__cls-2"
          d="M321.92 122.81a191.47 191.47 0 01-40.54 20.87c-31.51 11.69-58 11.92-58 11.54s24.93.83 48.25-13.16c18.93-11.34 30.06-28.67 36.83-43.24M156 68.45c-.65 4.16-5.06 35.82 18.52 60.54 17.54 18.39 39.71 21.54 46 22.22"
        />
        <path
          className="HeroLogo-01_svg__cls-2"
          d="M121.92 122.84a191.55 191.55 0 0040.55 20.88c31.51 11.68 58 11.92 58 11.53s-24.92.83-48.25-13.15c-18.93-11.35-30.06-28.67-36.82-43.24M287.78 68.41c.69 4.16 5.28 35.84-19.31 60.57-18.31 18.4-41.44 21.55-48 22.23"
        />
      </g>
      <text
        transform="translate(187.9 127.07)"
        fill="#12335a"
        fontFamily="Overpass-Medium,Overpass"
        fontWeight={500}
        fontSize={100}
        stroke="#12335a"
        strokeMiterlimit={10}
      >
        B
      </text>
      <text
        transform="translate(24.21 238.33)"
        fontSize={84}
        fill="#12335a"
        fontFamily="Overpass-Medium,Overpass"
        fontWeight={500}
        stroke="#12335a"
        strokeMiterlimit={10}
      >
        <tspan className="HeroLogo-01_svg__cls-5">B</tspan>
        <tspan x={56.74} y={0} letterSpacing="-.01em">
          o
        </tspan>
        <tspan x={103.02} y={0} letterSpacing="-.01em">
          w
        </tspan>
        <tspan className="HeroLogo-01_svg__cls-5" x={163.29} y={0}>
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

export { HeroLogoImage };
