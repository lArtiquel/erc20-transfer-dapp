import { useState, useEffect } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { useSnackbar } from 'notistack';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useTransaction = () => {
  const [pendingTransactions, setPendingTransactions] = useState<string[]>(() => {
    const saved = localStorage.getItem('pendingTransactions');
    return saved ? JSON.parse(saved) : [];
  });
  const { enqueueSnackbar } = useSnackbar();

  const trackTransaction = (txHash: string) => {
    setPendingTransactions(prev => {
      const updated = [...prev, txHash];
      localStorage.setItem('pendingTransactions', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum !== null) {
      const provider = new BrowserProvider(window.ethereum);

      const interval = setInterval(async () => {
        if (pendingTransactions.length === 0) return;

        const updatedTransactions: string[] = [];

        for (const txHash of pendingTransactions) {
          const receipt = await provider.getTransactionReceipt(txHash);
          if (receipt) {
            if (receipt.status === 1) {
              enqueueSnackbar(`Transaction ${txHash} confirmed!`, {
                variant: 'success',
              });
            } else {
              enqueueSnackbar(`Transaction ${txHash} failed.`, {
                variant: 'error',
              });
            }
          } else {
            updatedTransactions.push(txHash); // Still pending
          }
        }

        setPendingTransactions(updatedTransactions);
        localStorage.setItem('pendingTransactions', JSON.stringify(updatedTransactions));
      }, 5000);

      return () => clearInterval(interval);
    } else {
      alert('Please install MetaMask!');
    }
  }, [pendingTransactions, enqueueSnackbar]);

  // Synchronize state across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'pendingTransactions') {
        setPendingTransactions(JSON.parse(event.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { pendingTransactions, trackTransaction };
};
