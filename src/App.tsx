// src/App.tsx

import React from 'react';
import { Container, Typography, Divider, Box } from '@mui/material';
import SendTokenForm from './components/SendTokenForm';
import TransactionStatus from './components/TransactionStatus';

const App: React.FC = () => {
  return (
    <Container maxWidth="xs">
      {/* Header with Logo and Theme Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src="/logo.png"
          alt="logo"
          sx={{
            width: '50px',
            height: '50px',
            mr: '12px',
            mt: '8px',
          }}
        />
        <Typography variant="h4" color="text.primary">
          Token Transfer DApp
        </Typography>
      </Box>
      <Divider sx={{ marginY: 4 }} />
      <SendTokenForm />
      <Divider sx={{ marginY: 4 }} />
      <TransactionStatus />
    </Container>
  );
};

export default App;
