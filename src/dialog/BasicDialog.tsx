import React from 'react';

import IconButton from '../button/IconButton';
import ExitIcon from '../icon/ExitIcon';

interface IBasicDialogProps {
  children: React.ReactNode;
  outerClassName?: string;
  innerClassName?: string;
  open: boolean;
  canClose: boolean;
  onClose: Function;
}

export default function BasicDialog(props: IBasicDialogProps) {
  const {
    open, canClose = true, onClose, outerClassName = '', innerClassName = '',
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
  ) : (
    <></>
  );

  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto bg-gray-400 bg-opacity-80 flex ${outerClassName}`}
    >
      <div
        className={`relative p-6 pt-8 bg-white max-w-md m-auto flex-col flex rounded-lg ${innerClassName}`}
      >
        <div>{props.children}</div>
        {closeButton}
      </div>
    </div>
  );
}
