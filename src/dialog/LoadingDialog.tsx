import React from 'react';

import IconButton from '../button/IconButton';
import ExitIcon from '../icon/ExitIcon';

interface ILoadingDialogProps {
  title: string;
  children?: React.ReactNode;
  open: boolean;
  canClose: boolean;
  onClose?: Function;
}

export default function LoadingDialog(props: ILoadingDialogProps) {
  const {
    title,
    children,
    open,
    canClose = true,
    onClose = () => {},
  } = props;
  if (!open) {
    return <></>;
  }
  const closeButton = canClose ? (
    <span className="absolute top-0 right-0 p-2 text-gray-900">
      <IconButton onClick={() => onClose()}>
        <ExitIcon />
      </IconButton>
    </span>
  ) : <></>;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-400 bg-opacity-80 flex">
      <div className="relative p-6 pt-8 bg-white max-w-md m-auto flex-col flex rounded-lg">
        <h2 className="text-xl text-gray-900 font-bold">{title}</h2>
        <div className="flex items-center justify-center py-4">
          <div
            style={{ borderTopColor: 'transparent' }}
            className="w-16 h-16 border-4 border-primary-800 border-solid rounded-full animate-spin"
          />
        </div>
        <div>{children}</div>
        {closeButton}
      </div>
    </div>
  );
}
