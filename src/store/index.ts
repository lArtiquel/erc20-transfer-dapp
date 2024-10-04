// src/store/index.ts

import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import transactionReducer from './transactionSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['wallet', 'transactions'], // Specify which slices to persist
};

// Combine reducers
const rootReducer = combineReducers({
  wallet: walletReducer,
  transactions: transactionReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware to handle redux-persist actions
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define a type for Thunk actions
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
