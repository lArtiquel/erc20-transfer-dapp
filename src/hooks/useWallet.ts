import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { useSnackbar } from 'notistack';

// Declare global window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  // State variables
  const [browserProvider, setBrowserProvider] = useState<BrowserProvider | null>(null);
  const [walletConnectProvider, setWalletConnectProvider] = useState<WalletConnectProvider | null>(
    null
  );
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<string | null>(null);

  const { enqueueSnackbar } = useSnackbar(); // Initialize enqueueSnackbar

  /**
   * Disconnects the wallet and resets state
   */
  const disconnectWallet = useCallback(async () => {
    if (walletConnectProvider) {
      try {
        await walletConnectProvider.disconnect();
      } catch (error) {
        console.error('Error disconnecting WalletConnect:', error);
        enqueueSnackbar('Error disconnecting WalletConnect.', { variant: 'error' });
      }
    }
    setBrowserProvider(null);
    setWalletConnectProvider(null);
    setAccount(null);
    setNetworkId(null);
    localStorage.removeItem('connected');
    enqueueSnackbar('WalletConnect disconnected!', { variant: 'info' });
  }, [walletConnectProvider, enqueueSnackbar]);

  /**
   * Handles account changes
   * @param accounts - Array of new accounts
   */
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        enqueueSnackbar(`Account changed to ${accounts[0]}`, { variant: 'warning' });
      }
    },
    [disconnectWallet, enqueueSnackbar]
  );

  /**
   * Handles chain (network) changes
   * @param chainIdHex - New chain ID in hexadecimal
   */
  const handleChainChanged = useCallback(
    (chainIdHex: string) => {
      const chainIdDecimal = parseInt(chainIdHex, 16).toString(); // Convert hex to decimal string
      setNetworkId(chainIdDecimal);
      enqueueSnackbar(`Network changed to Chain ID ${chainIdDecimal}`, { variant: 'info' });

      if (chainIdDecimal !== '11155111') {
        // Sepolia Testnet Chain ID as string
        enqueueSnackbar("Be careful as you're not on Sepolia network.", {
          variant: 'warning',
        });
      }
    },
    [enqueueSnackbar]
  );

  /**
   * Connects to the wallet using WalletConnect
   */
  const connectWallet = useCallback(async () => {
    try {
      const wcProvider = await WalletConnectProvider.init({
        projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string, // Ensure this is set in .env
        chains: [11155111], // Sepolia Testnet Chain ID
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
      });

      await wcProvider.connect();

      // Create an Ethers.js BrowserProvider using the WalletConnectProvider
      const bProvider = new BrowserProvider(wcProvider);
      const network = await bProvider.getNetwork();

      setNetworkId(network.chainId.toString()); // Store as string

      const signer = await bProvider.getSigner();
      const address = await signer.getAddress();

      setBrowserProvider(bProvider);
      setWalletConnectProvider(wcProvider);
      setAccount(address);
      localStorage.setItem('connected', 'true');

      // Attach event listeners using named handlers
      wcProvider.on('disconnect', disconnectWallet);
      wcProvider.on('accountsChanged', handleAccountsChanged);
      wcProvider.on('chainChanged', handleChainChanged);

      enqueueSnackbar('Wallet connected successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error connecting WalletConnect:', error);
      enqueueSnackbar('Error connecting WalletConnect.', { variant: 'error' });
    }
  }, [disconnectWallet, handleAccountsChanged, handleChainChanged, enqueueSnackbar]);

  /**
   * Initializes the wallet connection on component mount
   */
  useEffect(() => {
    const isConnected = localStorage.getItem('connected');
    if (isConnected === 'true') {
      connectWallet();
    }

    // Cleanup function to remove event listeners
    return () => {
      if (walletConnectProvider) {
        walletConnectProvider.removeListener('disconnect', disconnectWallet);
        walletConnectProvider.removeListener('accountsChanged', handleAccountsChanged);
        walletConnectProvider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [
    connectWallet,
    walletConnectProvider,
    disconnectWallet,
    handleAccountsChanged,
    handleChainChanged,
  ]);

  return { provider: browserProvider, account, networkId, connectWallet, disconnectWallet };
};
