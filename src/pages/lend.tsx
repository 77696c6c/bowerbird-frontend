import React, { useContext } from 'react';

import { globalContext, GlobalStore } from '../state/Store';
import { LendPage } from '../templates/lend/LendPage';

const Lend = () => {
  useContext(globalContext);

  return (
    <GlobalStore>
      <LendPage />
    </GlobalStore>
  );
};

export default Lend;
