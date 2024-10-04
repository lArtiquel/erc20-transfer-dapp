// src/hooks/useTransaction.ts

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  addTransaction,
  updateTransactionStatus,
  setTransactions,
} from '../store/transactionSlice';
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

  // On initial load, ensure all transactions are synchronized
  useEffect(() => {
    // Optionally, you can implement logic to fetch and verify transaction statuses here
  }, []);

  return {
    transactions,
    trackTransaction,
    updateStatus,
  };
};
