// src/hooks/useWallet.ts

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { connectWallet, disconnectWallet } from '../store/walletSlice';

export const useWallet = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wallet = useSelector((state: RootState) => state.wallet);

  const connect = () => {
    dispatch(connectWallet());
  };

  const disconnect = () => {
    dispatch(disconnectWallet());
  };

  return {
    provider: wallet.provider,
    account: wallet.account,
    networkId: wallet.networkId,
    isConnecting: wallet.isConnecting,
    error: wallet.error,
    connectWallet: connect,
    disconnectWallet: disconnect,
  };
};
