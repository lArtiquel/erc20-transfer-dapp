import React from 'react';
import { Container, Typography } from '@mui/material';
import WalletConnect from './components/WalletConnect';
import SendTokenForm from './components/SendTokenForm';
import TransactionStatus from './components/TransactionStatus';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          ERC20 Token Sender
        </Typography>
        <WalletConnect />
        <SendTokenForm />
        <TransactionStatus />
      </Container>
    </SnackbarProvider>
  );
}

export default App;
