// truffle-config.js

const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          privateKeys: [PRIVATE_KEY],
          providerOrUrl: SEPOLIA_RPC_URL,
        }),
      network_id: 11155111, // Sepolia's network ID
      gas: 5500000, // Gas limit
      confirmations: 2, // # of confirmations to wait between deployments
      timeoutBlocks: 200, // # of blocks before a deployment times out
      skipDryRun: true, // Skip dry run before migrations
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.0', // Fetch exact version from solc-bin
    },
  },
};
