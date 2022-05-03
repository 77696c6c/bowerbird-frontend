import React from 'react';

import DialogButton from '../button/DialogButton';
import BasicDialog from './BasicDialog';

interface IConfirmDialogProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  canClose: boolean;
  onClose: Function;
  onConfirm: Function;
  onConfirmData: any;
  confirmButtonText: string;
}

export default function ConfirmDialog(props: IConfirmDialogProps) {
  const {
    open, canClose, onClose, title, children, onConfirm, onConfirmData, confirmButtonText,
  } = props;
  if (!open) {
    return <></>;
  }

  return (
    <BasicDialog open={open} onClose={onClose} canClose={canClose} outerClassName="" innerClassName="">
      <h2 className="py-2 text-xl font-bold">{title}</h2>
      <div className="py-5">{children}</div>
      <div className="flex justify-center">
        <div className="">
          <DialogButton
            onClick={() => {
              onConfirm(onConfirmData);
            }}
          >
            {confirmButtonText}
          </DialogButton>
        </div>
      </div>
    </BasicDialog>
  );
}
