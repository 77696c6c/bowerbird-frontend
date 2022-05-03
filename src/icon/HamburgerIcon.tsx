import * as React from 'react';

type IHamburgerIconProps = {
  width?: number;
  height?: number;
  cn?: string;
  onClick: Function;
};

function HamburgerIcon(props: IHamburgerIconProps) {
  const {
    width = 12, height = 12, cn = '', onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0, 0, 24, 24"
      role="button"
      className={cn}
      onClick={() => onClick()}
    >
      <path d="M2 11h20v2H2zm0-6h20v2H2zm0 12h20v2H2z" />
    </svg>
  );
}

export { HamburgerIcon };
