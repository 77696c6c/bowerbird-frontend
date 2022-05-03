import { u, wallet } from '@cityofzion/neon-js';

function base64MatchesAddress(base64Hash: string, address: string) {
  const fromBase64 = u.HexString.fromBase64(base64Hash, true).toString();
  const fromAddress = wallet.getScriptHashFromAddress(address);
  return fromBase64 === fromAddress;
}

export { base64MatchesAddress };
