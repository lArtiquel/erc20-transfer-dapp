// src/components/TransactionStatus.tsx

import React from 'react';
import { Typography, List, ListItem, ListItemText, Chip, Stack } from '@mui/material';
import { useTransaction } from '../hooks/useTransaction';

const TransactionStatus: React.FC = () => {
  const { transactions } = useTransaction();

  const getStatusChip = (status: string) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' = 'default';

    switch (status) {
      case 'pending':
        color = 'warning';
        break;
      case 'success':
        color = 'success';
        break;
      case 'failed':
        color = 'error';
        break;
      default:
        color = 'default';
    }

    return <Chip label={status.toUpperCase()} color={color} size="small" />;
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Transaction Status
      </Typography>
      {transactions.length > 0 ? (
        <List>
          {transactions.map(tx => (
            <ListItem key={tx.hash} divider>
              <ListItemText
                primary={
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.hash}
                  </a>
                }
                secondary={getStatusChip(tx.status)}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No transactions to display.</Typography>
      )}
    </div>
  );
};

export default TransactionStatus;
