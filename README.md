# ERC20 Transfer DApp

## Overview

**ERC20 Transfer DApp** is a user-friendly decentralized application designed to facilitate the sending of ERC20 tokens on the **Sepolia** Ethereum test network. Focused on delivering a nice user experience, this DApp ensures seamless token transactions with real-time feedback and state persistence.

## Features

- **Send ERC20 Tokens:** Easily transfer your ERC20 tokens to any Ethereum address.
- **User-Friendly Interface:** Intuitive design keeps users informed about transaction statuses, including expected mining times and error notifications.
- **State Persistence:** If you close the browser and return later, the app accurately reflects the current state of your transactions.
- **Cross-Tab Consistency:** Transaction states remain consistent across multiple browser tabs, ensuring a unified experience.
- **Secure Wallet Connection:** The app starts in read-only mode and prompts users to connect their wallets only when they initiate an action.
- **WalletConnect Integration:** Connect with various wallet applications seamlessly using WalletConnect.

## Supported Tokens

- **ETH**
- **Sepolia Test PUPA Token** (Custom ERC20 Token deployed on Sepolia)

_Note: Additional ERC20 tokens can be added to the supported list as needed._

## Live Demo

Experience the DApp in action by visiting the live deployment:

🔗 [ERC20 Transfer DApp Live](https://token-transfer-dapp.artware.me/)

## Deployment Guide

### Steps to Deploy the Custom ERC20 Token

See `erc20-token` folder for a guide to setup a custom token for testing purposes on a Sepolia network.

## Technologies Used

- **React:** Frontend library for building user interfaces.
- **Redux:** State management library for JavaScript applications.
- **TypeScript:** Superset of JavaScript that adds static typing.
- **WalletConnect:** Open protocol for connecting wallets to DApps.
- **OpenZeppelin Contracts:** Library for secure smart contract development.
- **Notistack:** Snackbar library for notifications in React.
- **Material-UI (MUI):** React UI framework for building responsive interfaces.

## User Experience Highlights

- **Real-Time Transaction Feedback:** Users receive instant notifications about the status of their transactions, including expected mining times and error messages.
- **State Persistence:** The app maintains accurate transaction states even if the browser is closed and reopened, ensuring users are always informed.
- **Multi-Tab Consistency:** Transaction statuses are synchronized across all open tabs, providing a consistent user experience.
- **Secure and Intuitive Wallet Connection:** The app initiates in a read-only mode, prompting users to connect their wallets only when necessary, enhancing security and usability.

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone git@github.com:lArtiquel/erc20-transfer-dapp.git
   cd erc20-transfer-dapp
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the project root with the following:

   ```env
    REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id
    REACT_APP_RPC_ENDPOINT=https://eth-sepolia.g.alchemy.com/v2/your_api_key
   ```

4. **Run the Application**

   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
