// src/App.tsx

import React from 'react';
import { Container, Typography, Divider } from '@mui/material';
import SendTokenForm from './components/SendTokenForm';
import TransactionStatus from './components/TransactionStatus';

const App: React.FC = () => {
  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Token Sender
      </Typography>
      <Divider sx={{ marginY: 4 }} />
      <SendTokenForm />
      <Divider sx={{ marginY: 4 }} />
      <TransactionStatus />
    </Container>
  );
};

export default App;
