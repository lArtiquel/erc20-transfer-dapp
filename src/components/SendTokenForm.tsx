// src/components/SendTokenForm.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { useWallet } from '../hooks/useWallet';
import { ethers, parseUnits, parseEther, Contract, TransactionResponse } from 'ethers';
import { erc20Abi } from '../utils/abi';
import { useSnackbar, SnackbarKey } from 'notistack';
import { supportedTokens } from '../utils/constants';
import { useTransaction } from '../hooks/useTransaction';

// Import MUI icons
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

interface FormData {
  tokenAddress: string;
  recipient: string;
  amount: string;
}

// Helper function to truncate Ethereum addresses
const truncateAddress = (address: string, startLength = 6, endLength = 4): string => {
  if (!address) return '';
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
};

const SendTokenForm: React.FC = () => {
  const { provider, account, networkId, connectWallet, disconnectWallet } = useWallet();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { trackTransaction, updateStatus } = useTransaction();
  const [isLoading, setIsLoading] = useState(false);

  // Refs to store the timeout ID and snackbar key
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const waitingSnackbarKeyRef = useRef<SnackbarKey | null>(null);

  const onSubmit = async (data: FormData) => {
    if (!provider || !account) {
      enqueueSnackbar('Please connect your wallet.', { variant: 'warning' });
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const network = await provider.getNetwork();

      // Convert network.chainId (number) to string for comparison
      const networkChainId = network.chainId.toString();
      const expectedChainId = networkId; // networkId is already a string

      if (networkChainId !== expectedChainId) {
        enqueueSnackbar('Please switch to the Sepolia network in your wallet.', {
          variant: 'warning',
        });
        return;
      }

      const signer = await provider.getSigner();

      let tx: TransactionResponse;

      // Inform the user to confirm the transaction in the wallet
      enqueueSnackbar('Please confirm the transaction in your wallet.', {
        variant: 'info',
        autoHideDuration: 6000,
      });

      if (data.tokenAddress === 'ETH') {
        // Sending ETH
        tx = await signer.sendTransaction({
          to: data.recipient,
          value: parseEther(data.amount),
        });
      } else {
        // Sending ERC20 Token
        const contract = new Contract(data.tokenAddress, erc20Abi, signer);
        const decimals = await contract.decimals();
        const amount = parseUnits(data.amount, decimals);
        tx = await contract.transfer(data.recipient, amount);
      }

      enqueueSnackbar(`Transaction submitted: ${tx.hash}`, { variant: 'info' });
      trackTransaction(tx.hash);

      // Show a loading snackbar for 'Waiting for transaction to be mined'
      const waitingKey = enqueueSnackbar('Waiting for transaction to be mined...', {
        variant: 'info',
        persist: true, // Keeps the snackbar open until manually closed
      });
      waitingSnackbarKeyRef.current = waitingKey;

      // Set a timeout to remove the 'Waiting' snackbar after 30 seconds
      const timeout = setTimeout(() => {
        if (waitingSnackbarKeyRef.current !== null) {
          closeSnackbar(waitingSnackbarKeyRef.current);
          waitingSnackbarKeyRef.current = null;
        }
        enqueueSnackbar(
          'Transaction is taking longer than expected. Please check Etherscan for updates.',
          {
            variant: 'warning',
            autoHideDuration: 6000,
          }
        );
      }, 30000); // 30,000 milliseconds = 30 seconds
      timeoutIdRef.current = timeout;

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Transaction mined successfully, clear the timeout
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      // Close the 'Waiting' snackbar if it's still open
      if (waitingSnackbarKeyRef.current !== null) {
        closeSnackbar(waitingSnackbarKeyRef.current);
        waitingSnackbarKeyRef.current = null;
      }

      if (receipt && receipt.status === 1) {
        enqueueSnackbar(`Transaction confirmed: ${tx.hash}`, {
          variant: 'success',
          autoHideDuration: 6000, // Auto hide after 6 seconds
        });
        updateStatus(tx.hash, 'success');
      } else {
        enqueueSnackbar(`Transaction failed: ${tx.hash}`, {
          variant: 'error',
          autoHideDuration: 6000,
        });
        updateStatus(tx.hash, 'failed');
      }

      reset(); // Reset form after transaction
    } catch (error: any) {
      // Clear the timeout if an error occurs
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      // Close the 'Waiting' snackbar if it's still open
      if (waitingSnackbarKeyRef.current !== null) {
        closeSnackbar(waitingSnackbarKeyRef.current);
        waitingSnackbarKeyRef.current = null;
      }

      // Enhanced error handling based on error code
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        enqueueSnackbar('Transaction rejected by the user.', { variant: 'error' });
      } else {
        enqueueSnackbar('Transaction failed or was rejected.', { variant: 'error' });
      }

      console.error('Error sending transaction:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Cleanup timeout and snackbar on component unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (waitingSnackbarKeyRef.current) {
        closeSnackbar(waitingSnackbarKeyRef.current);
      }
    };
  }, [closeSnackbar]);

  // Handle button click based on connection status
  const handleButtonClick = () => {
    if (!account) {
      connectWallet();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex', // Enable flexbox
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        padding: 2,
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#fff', // White background for the form
        }}
      >
        {/* Disconnect Wallet Button */}
        {account && (
          <Button
            variant="contained"
            color="error"
            onClick={disconnectWallet}
            startIcon={<PowerSettingsNewIcon />}
            sx={{ alignSelf: 'flex-end' }}
          >
            Disconnect Wallet
          </Button>
        )}

        {/* Show connected account and network */}
        {account && (
          <Box>
            <Typography variant="subtitle1" noWrap>
              <strong>Connected Account:</strong> {truncateAddress(account)}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Network ID:</strong> {networkId}
            </Typography>
          </Box>
        )}

        {/* Token Selection */}
        <Controller
          name="tokenAddress"
          control={control}
          defaultValue=""
          rules={{ required: 'Token is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Token"
              fullWidth
              margin="normal"
              error={!!errors.tokenAddress}
              helperText={errors.tokenAddress ? errors.tokenAddress.message : ''}
            >
              {supportedTokens.map(token => (
                <MenuItem key={token.address} value={token.address}>
                  {token.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Recipient Address */}
        <Controller
          name="recipient"
          control={control}
          defaultValue=""
          rules={{
            required: 'Recipient address is required',
            pattern: {
              value: /^0x[a-fA-F0-9]{40}$/,
              message: 'Invalid Ethereum address',
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Recipient Address"
              fullWidth
              margin="normal"
              error={!!errors.recipient}
              helperText={errors.recipient ? errors.recipient.message : ''}
            />
          )}
        />

        {/* Amount */}
        <Controller
          name="amount"
          control={control}
          defaultValue=""
          rules={{
            required: 'Amount is required',
            min: {
              value: 0.000000000000000001,
              message: 'Amount must be greater than zero',
            },
            validate: {
              positive: value => parseFloat(value) > 0 || 'Amount must be positive',
              decimalPlaces: value => {
                const decimal = value.split('.')[1];
                if (decimal && decimal.length > 18) {
                  return 'Amount cannot have more than 18 decimal places';
                }
                return true;
              },
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.amount}
              helperText={errors.amount ? errors.amount.message : ''}
              inputProps={{
                step: 'any', // Allows decimal values
              }}
            />
          )}
        />

        {/* Send/Connect Wallet Button */}
        <Button
          variant="contained"
          color={account ? 'primary' : 'secondary'}
          onClick={handleButtonClick}
          fullWidth
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : account ? (
              <SendIcon />
            ) : (
              <AccountBalanceWalletIcon />
            )
          }
          type="button" // Prevent form submission
          sx={{ marginTop: 2 }}
        >
          {isLoading
            ? account
              ? 'Sending...'
              : 'Connecting...'
            : account
              ? 'Send'
              : 'Connect Wallet'}
        </Button>
      </Stack>
    </Box>
  );
};

export default SendTokenForm;
