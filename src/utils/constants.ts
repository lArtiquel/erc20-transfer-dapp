// src/utils/constants.ts

interface Token {
  name: string;
  address: string;
}

export const supportedTokens: Token[] = [
  {
    name: 'ETH',
    address: 'ETH',
  },
  {
    name: 'Sepolia Test LINK Token',
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
  },
  // any other ERC-20 token you wish to import here
];
