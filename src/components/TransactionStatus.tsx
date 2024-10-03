import React from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTransaction } from '../hooks/useTransaction';

const TransactionStatus: React.FC = () => {
  const { pendingTransactions } = useTransaction();

  return (
    <div>
      <Typography variant="subtitle1">Pending Transactions:</Typography>
      {pendingTransactions.length > 0 ? (
        <List>
          {pendingTransactions.map(txHash => (
            <ListItem key={txHash}>
              <ListItemText primary={`Transaction Hash: ${txHash}`} secondary="Status: Pending" />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No pending transactions.</Typography>
      )}
    </div>
  );
};

export default TransactionStatus;
