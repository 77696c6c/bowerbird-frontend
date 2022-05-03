import * as React from 'react';

type ICopyIconProps = {
  width?: number;
  height?: number;
  cn?: string;
  onClick: Function;
};

function CopyIcon(props: ICopyIconProps) {
  const {
    width = 12, height = 12, cn = '', onClick,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0, 0, 128, 128"
      role="button"
      className={cn}
      onClick={() => onClick()}
    >
      <path d="M112 0H40c-8.836 0-16 7.164-16 16h8c0-4.414 3.59-8 8-8h72c4.414 0 8 3.586 8 8v72c0 4.414-3.586 8-8 8v8c8.836 0 16-7.164 16-16V16c0-8.836-7.164-16-16-16zM88 24H16C7.164 24 0 31.164 0 40v72c0 8.836 7.164 16 16 16h72c8.836 0 16-7.164 16-16V40c0-8.836-7.164-16-16-16zm8 88c0 4.414-3.586 8-8 8H16c-4.41 0-8-3.586-8-8V40c0-4.414 3.59-8 8-8h72c4.414 0 8 3.586 8 8v72zM24 56h56v-8H24v8zm0 16h56v-8H24v8zm0 16h56v-8H24v8zm0 16h32v-8H24v8z" />
    </svg>
  );
}

export { CopyIcon };
