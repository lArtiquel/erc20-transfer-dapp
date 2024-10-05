// src/components/TransactionStatus.tsx

import React from 'react';
import { Typography, List, ListItem, Chip, Stack, Box } from '@mui/material';
import { useTransaction } from '../hooks/useTransaction';
import { truncateAddress } from '../utils/helperFunctions';
import { Transaction } from '../store/transactionSlice'; // Ensure correct import

// Helper function to determine Chip color based on status
const getStatusChipColor = (
  status: string
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'success':
      return 'success';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

const TransactionStatus: React.FC = () => {
  const { transactions } = useTransaction();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      {transactions.length > 0 ? (
        <List
          sx={{
            maxHeight: '400px',
            overflow: 'auto',
            backgroundColor: 'background.paper',
            borderRadius: 1,
            padding: 0,
          }}
        >
          {transactions
            .slice()
            .reverse() // Newest transactions on top
            .map((tx: Transaction) => (
              <ListItem
                key={tx.hash}
                divider
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                onClick={() =>
                  window.open(
                    `https://sepolia.etherscan.io/tx/${tx.hash}`,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  {/* Transaction Hash */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1976d2',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: '#0d47a1',
                      },
                    }}
                  >
                    {truncateAddress(tx.hash)}
                  </Typography>

                  {/* Status Chip */}
                  <Chip
                    label={tx.status.toUpperCase()}
                    color={getStatusChipColor(tx.status)}
                    size="small"
                  />
                </Stack>
              </ListItem>
            ))}
        </List>
      ) : (
        <Typography variant="body2">No transactions to display.</Typography>
      )}
    </Box>
  );
};

export default TransactionStatus;
