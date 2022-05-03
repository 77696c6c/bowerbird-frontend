import React, { useContext } from 'react';

import { globalContext, GlobalStore } from '../state/Store';
import { BorrowPage } from '../templates/borrow/BorrowPage';

const Borrow = () => {
  useContext(globalContext);

  return (
    <GlobalStore>
      <BorrowPage />
    </GlobalStore>
  );
};

export default Borrow;
