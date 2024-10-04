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
    name: 'Sepolia Test Token',
    address: '0x', // todo
  },
];
