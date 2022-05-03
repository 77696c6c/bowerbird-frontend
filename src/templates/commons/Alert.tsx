import React from 'react';

type IAlertProps = {
  open: boolean;
  text: string;
  onClose: Function;
};

const Alert = (props: IAlertProps) => {
  if (!props.open) {
    return <></>;
  }
  return (
    <div className="transition-all fixed inset-0 z-50 overflow-auto bg-gray-400 bg-opacity-80 flex">
      <div
        className="mt-2 m-auto relative flex bg-red-100 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <span className="inline">{props.text}</span>
        <span className="inline pl-4">
          <svg
            className="fill-current h-6 w-6 text-red-500"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            onClick={() => props.onClose()}
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export { Alert };
