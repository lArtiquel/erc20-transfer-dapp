import { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import type { EthereumProvider as WalletConnectProviderType } from '@walletconnect/ethereum-provider';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const walletConnectProvider = await WalletConnectProvider.init({
        projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string,
        chains: [11155111], // Sepolia test network chain ID
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
      });

      await walletConnectProvider.connect();

      const browserProvider = new BrowserProvider(walletConnectProvider);
      const network = await browserProvider.getNetwork();

      if (network.chainId !== 11155111n) {
        alert('Please switch to the Sepolia network in your wallet.');
        return;
      }

      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      setProvider(browserProvider);
      setAccount(address);
      localStorage.setItem('connected', 'true');

      // Handle session disconnect
      walletConnectProvider.on('disconnect', () => {
        disconnectWallet();
      });

      // Handle account change
      walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      // Handle chain change
      walletConnectProvider.on('chainChanged', (chainIdHex: string) => {
        const chainId = parseInt(chainIdHex, 16); // Convert hex string to number
        if (chainId !== 11155111) {
          alert('Please switch back to the Sepolia network in your wallet.');
        }
      });
    } catch (error) {
      console.error('Error connecting WalletConnect:', error);
    }
  };

  const disconnectWallet = async () => {
    if (provider) {
      await provider.destroy();
    }
    setProvider(null);
    setAccount(null);
    localStorage.removeItem('connected');
  };

  useEffect(() => {
    const isConnected = localStorage.getItem('connected');
    if (isConnected === 'true') {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { provider, account, connectWallet, disconnectWallet };
};
