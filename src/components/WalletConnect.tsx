import React from 'react';
import { Button, Typography } from '@mui/material';
import { useWallet } from '../hooks/useWallet';

const WalletConnect: React.FC = () => {
  const { connectWallet, disconnectWallet, account } = useWallet();

  return (
    <div>
      {account ? (
        <div>
          <Typography variant="subtitle1">Connected Account:</Typography>
          <Typography variant="body1">{account}</Typography>
          <Button variant="contained" color="secondary" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button variant="contained" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
