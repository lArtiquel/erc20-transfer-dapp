// src/store/transactionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import broadcast from './broadcast';

export interface Transaction {
  hash: string;
  status: 'pending' | 'success' | 'failed';
}

interface TransactionState {
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, action: PayloadAction<string>) {
      // Avoid duplicate transactions
      if (!state.transactions.find(tx => tx.hash === action.payload)) {
        state.transactions.push({ hash: action.payload, status: 'pending' });
        // Broadcast the new transaction to other tabs
        broadcast.postMessage({ type: 'ADD_TRANSACTION', payload: action.payload });
      }
    },
    updateTransactionStatus(
      state,
      action: PayloadAction<{ hash: string; status: 'success' | 'failed' }>
    ) {
      const tx = state.transactions.find(t => t.hash === action.payload.hash);
      if (tx) {
        tx.status = action.payload.status;
        // Broadcast the status update to other tabs
        broadcast.postMessage({ type: 'UPDATE_TRANSACTION_STATUS', payload: action.payload });
      }
    },
    clearTransactions(state) {
      state.transactions = [];
    },
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
  },
});

export const { addTransaction, updateTransactionStatus, clearTransactions, setTransactions } =
  transactionSlice.actions;

export default transactionSlice.reducer;
