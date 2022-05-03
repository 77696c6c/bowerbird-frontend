import * as React from 'react';

type IBNEOIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

function BNEOIcon(props: IBNEOIconProps) {
  const { className = '', width = 128, height = 128 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 26 26"
      xmlSpace="preserve"
    >
      <circle cx={13} cy={13} r={13} fill="#231f20" />
      <path
        d="M5.8 7.8v10.7l6.9 2.5V10.2l7.5-2.8L13.4 5 5.8 7.8z"
        fill="#f5c36d"
      />
      <path d="M13.2 10.6v5.7l7 2.5V8l-7 2.6z" fill="#dfa74f" />
    </svg>
  );
}

export { BNEOIcon };
