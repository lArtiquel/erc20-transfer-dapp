import { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';

export const useWallet = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const browserProvider = new BrowserProvider(window.ethereum);
        const network = await browserProvider.getNetwork();

        if (network.chainId !== 11155111n) {
          // Request network change
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
            });
            // Re-initialize provider after network switch
            const updatedProvider = new BrowserProvider(window.ethereum);
            const updatedNetwork = await updatedProvider.getNetwork();
            if (updatedNetwork.chainId !== 11155111n) {
              alert('Failed to switch to the Sepolia network.');
              return;
            } else {
              // Proceed with connecting
              const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
              });
              const address = accounts[0];
              setProvider(updatedProvider);
              setAccount(address);
              localStorage.setItem('connected', 'true');
            }
          } catch (switchError) {
            console.error('Error switching network:', switchError);
            alert('Please switch to the Sepolia network in MetaMask.');
            return;
          }
        } else {
          // Network is correct, proceed with connecting
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          const address = accounts[0];
          setProvider(browserProvider);
          setAccount(address);
          localStorage.setItem('connected', 'true');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
    localStorage.removeItem('connected');
  };

  useEffect(() => {
    const isConnected = localStorage.getItem('connected');
    if (isConnected === 'true') {
      connectWallet();
    }
  }, []);

  return { provider, account, connectWallet, disconnectWallet };
};
