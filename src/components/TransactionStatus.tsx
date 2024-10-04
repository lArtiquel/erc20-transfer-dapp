// src/components/TransactionStatus.tsx

import React from 'react';
import { Typography, List, ListItem, Chip, Stack, Box } from '@mui/material';
import { useTransaction } from '../hooks/useTransaction';

// Helper function to truncate Ethereum addresses or hashes
const truncateAddress = (address: string, startLength = 6, endLength = 4): string => {
  if (!address) return '';
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
};

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
            maxHeight: '400px', // Fixed height
            overflow: 'auto', // Scrollable
            backgroundColor: 'background.paper',
            borderRadius: 1,
            padding: 0,
          }}
        >
          {transactions
            .slice() // Create a shallow copy to avoid mutating the original array
            .reverse() // Newest transactions on top
            .map(tx => (
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
                    onClick={() =>
                      window.open(
                        `https://sepolia.etherscan.io/tx/${tx.hash}`,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
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
