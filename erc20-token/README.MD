# PupaToken

## Overview

**PupaToken** is a custom ERC20 token deployed on the **Sepolia** Ethereum test network. Designed for development and testing purposes, PupaToken allows users to mint and transfer tokens.

## Deployment Instructions

### Prerequisites

Before deploying PupaToken, ensure you have the following set up:

- **Node.js and npm**: [Download and install](https://nodejs.org/en/download/)
- **Truffle Suite**: Install globally using npm:
  ```bash
  npm install -g truffle
  ```
- **MetaMask Extension**: Install the [MetaMask](https://metamask.io/) browser extension.
- **Sepolia ETH**: Obtain test ETH from a Sepolia faucet, such as the [Chainlink Sepolia Faucet](https://sepolia-faucet.pk910.de/).
- **RPC Provider**: Sign up for an [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) account to obtain a Sepolia RPC URL.

### Steps to Deploy

1. **Clone the Repository and cd**

   ```bash
   cd pupatoken
   ```

2. **Install Dependencies**

   Navigate to your project directory and install the necessary packages:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the project root and add your deployment credentials:

   ```env
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=https://eth-sepolia.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY
   ```

4. **Compile the Smart Contracts**

   Compile your ERC20 token contracts using Truffle:

   ```bash
   truffle compile
   ```

5. **Deploy to Sepolia**

   Deploy the contracts to the Sepolia test network:

   ```bash
   truffle migrate --network sepolia
   ```

6. **Verify Deployment**

   - Visit [Sepolia Etherscan](https://sepolia.etherscan.io/).
   - Search for your `PupaToken` contract address (`0xYourPupaTokenContractAddress`) to view contract details and transactions.

## Adding PupaToken to MetaMask

To interact with PupaToken in your MetaMask wallet, follow these steps:

1. **Open MetaMask Extension**

2. **Connect to Sepolia Test Network**

   - Click on the network dropdown at the top of MetaMask.
   - Select **Sepolia Test Network**. If it's not listed, you can add it manually:
     - **Network Name:** Sepolia
     - **New RPC URL:** `https://eth-sepolia.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY`
     - **Chain ID:** `11155111`
     - **Currency Symbol:** ETH
     - **Block Explorer URL:** `https://sepolia.etherscan.io/`

3. **Import PupaToken**

   - Navigate to the **"Assets"** tab in MetaMask.
   - Click on **"Import tokens"**.
   - Select the **"Custom Token"** tab.
   - **Token Contract Address:** Enter your `PupaToken` contract address (`0xYourPupaTokenContractAddress`).
   - **Token Symbol:** Should auto-populate as `PUPA`. If not, enter manually.
   - **Decimals of Precision:** Enter `18`.
   - Click **"Next"** and then **"Add Tokens"**.

4. **Verify Token Display**

   - Your PupaToken (`PUPA`) balance should now appear under the **"Assets"** tab in MetaMask.
   - You can now send and receive PupaTokens using your wallet.

## Conclusion

With PupaToken successfully deployed on the Sepolia test network and added to MetaMask, you're now equipped to:

- **Mint New Tokens:** As the contract owner, you can mint additional PupaTokens to any address.
- **Transfer Tokens:** Send PupaTokens to other Ethereum addresses through your dApp or directly via MetaMask.
