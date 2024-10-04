// src/store/walletSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers, BrowserProvider } from 'ethers';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { RootState, AppThunk } from './index';

interface WalletState {
  provider: BrowserProvider | null;
  account: string | null;
  networkId: string | null;
  isConnecting: boolean;
  error: string | null;
}

const initialState: WalletState = {
  provider: null,
  account: null,
  networkId: null,
  isConnecting: false,
  error: null,
};

// Async thunk to connect wallet
export const connectWallet = (): AppThunk => async dispatch => {
  dispatch(walletConnecting());
  try {
    const wcProvider = await WalletConnectProvider.init({
      projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID as string,
      chains: [11155111], // Sepolia Testnet Chain ID
      showQrModal: true,
      methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
    });

    await wcProvider.connect();

    const bProvider = new BrowserProvider(wcProvider);
    const network = await bProvider.getNetwork();
    const signer = await bProvider.getSigner();
    const address = await signer.getAddress();

    // Dispatch success action
    dispatch(
      walletConnected({
        provider: bProvider,
        account: address,
        networkId: network.chainId.toString(),
      })
    );

    // Attach event listeners
    wcProvider.on('disconnect', () => {
      dispatch(disconnectWalletAction());
    });
    wcProvider.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        dispatch(disconnectWalletAction());
      } else {
        dispatch(accountChanged(accounts[0]));
      }
    });
    wcProvider.on('chainChanged', (chainIdHex: string) => {
      const chainIdDecimal = parseInt(chainIdHex, 16).toString();
      dispatch(networkChanged(chainIdDecimal));
    });

    // Persist connection status
    localStorage.setItem('connected', 'true');
  } catch (error: any) {
    dispatch(walletError(error.message || 'Failed to connect wallet'));
  }
};

// Actions
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    walletConnecting(state) {
      state.isConnecting = true;
      state.error = null;
    },
    walletConnected(
      state,
      action: PayloadAction<{ provider: BrowserProvider; account: string; networkId: string }>
    ) {
      state.provider = action.payload.provider;
      state.account = action.payload.account;
      state.networkId = action.payload.networkId;
      state.isConnecting = false;
      state.error = null;
    },
    disconnectWalletAction(state) {
      state.provider = null;
      state.account = null;
      state.networkId = null;
      state.isConnecting = false;
      state.error = null;
      localStorage.removeItem('connected');
    },
    accountChanged(state, action: PayloadAction<string>) {
      state.account = action.payload;
    },
    networkChanged(state, action: PayloadAction<string>) {
      state.networkId = action.payload;
    },
    walletError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isConnecting = false;
    },
  },
});

export const {
  walletConnecting,
  walletConnected,
  disconnectWalletAction,
  accountChanged,
  networkChanged,
  walletError,
} = walletSlice.actions;

// Thunk to disconnect wallet
export const disconnectWallet = (): AppThunk => async (dispatch, getState) => {
  const { wallet } = getState();
  const { provider } = wallet;

  if (provider) {
    try {
      const walletConnectProvider = (provider.provider as any).wcProvider as WalletConnectProvider;
      if (walletConnectProvider) {
        await walletConnectProvider.disconnect();
      }
    } catch (error: any) {
      console.error('Error disconnecting WalletConnect:', error);
    }
  }

  dispatch(disconnectWalletAction());
};

export default walletSlice.reducer;
