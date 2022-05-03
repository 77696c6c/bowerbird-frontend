type NeoType = 'Boolean' | 'Integer' | 'Array' | 'ByteArray' | 'String' | 'Hash160' | 'Hash256';

type TypedValue = { type: NeoType; value: string | boolean | any[] };

type Networks = {
  networks: string[];
  defaultNetwork: string;
};

type InvokeReadArgs = {
  scriptHash: string;
  operation: string;
  args: TypedValue[];
};

type InvokeWriteArgs = {
  fee?: string;
  extraSystemFee?: string;
  broadcastOverride?: boolean;
};

type NeoAccount = {
  address: string;
  label: string
};

type Signers = {
  signers: Signer[];
};

type Signer = {
  account: string;
  scopes: number
};

export type {
  Networks, InvokeReadArgs, InvokeWriteArgs, NeoAccount, Signers, Signer, TypedValue,
};
