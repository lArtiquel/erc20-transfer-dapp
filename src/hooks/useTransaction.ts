// src/hooks/useTransaction.ts

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { JsonRpcProvider } from 'ethers';
import { addTransaction, updateTransactionStatus, Transaction } from '../store/transactionSlice';
import broadcast from '../store/broadcast';
import { useEffect } from 'react';

export const useTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const trackTransaction = (hash: string) => {
    dispatch(addTransaction(hash));
  };

  const updateStatus = (hash: string, status: 'success' | 'failed') => {
    dispatch(updateTransactionStatus({ hash, status }));
  };

  // Function to verify transaction statuses
  const verifyTransactionStatuses = async () => {
    const rpcEndpoint = process.env.REACT_APP_RPC_ENDPOINT;
    if (!rpcEndpoint) {
      console.error('REACT_APP_RPC_ENDPOINT is not defined in the environment variables.');
      return;
    }

    const provider = new JsonRpcProvider(rpcEndpoint);

    try {
      await Promise.all(
        transactions.map(async tx => {
          if (tx.status === 'pending') {
            try {
              const receipt = await provider.getTransactionReceipt(tx.hash);
              if (receipt) {
                const newStatus: 'success' | 'failed' = receipt.status === 1 ? 'success' : 'failed';
                dispatch(updateTransactionStatus({ hash: tx.hash, status: newStatus }));
              }
            } catch (error) {
              console.error(`Error verifying transaction ${tx.hash}:`, error);
            }
          }
        })
      );
    } catch (error) {
      console.error('Error verifying transaction statuses:', error);
    }
  };

  // Listen to BroadcastChannel messages to synchronize transactions across tabs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'ADD_TRANSACTION') {
        dispatch(addTransaction(payload));
      } else if (type === 'UPDATE_TRANSACTION_STATUS') {
        dispatch(updateTransactionStatus(payload));
      }
    };

    broadcast.addEventListener('message', handleMessage);

    return () => {
      broadcast.removeEventListener('message', handleMessage);
    };
  }, [dispatch]);

  // On initial load and whenever transactions change, verify their statuses
  useEffect(() => {
    // Only verify if there are pending transactions
    const hasPending = transactions.some(tx => tx.status === 'pending');
    if (hasPending) {
      verifyTransactionStatuses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    transactions,
    trackTransaction,
    updateStatus,
  };
};
