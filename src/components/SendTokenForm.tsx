import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem, Stack } from '@mui/material';
import { useWallet } from '../hooks/useWallet';
import { ethers, parseUnits, parseEther, Contract } from 'ethers';
import { erc20Abi } from '../utils/abi';
import { useSnackbar } from 'notistack';
import { supportedTokens } from '../utils/constants';
import { useTransaction } from '../hooks/useTransaction';

interface FormData {
  tokenAddress: string;
  recipient: string;
  amount: string;
}

const SendTokenForm: React.FC = () => {
  const { provider, account } = useWallet();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const { trackTransaction } = useTransaction();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!provider || !account) {
      console.log(provider);
      console.log(account);
      enqueueSnackbar('Please connect your wallet.', { variant: 'warning' });
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        enqueueSnackbar('Please switch to the Sepolia network in your wallet.', {
          variant: 'warning',
        });
        return;
      }

      const signer = await provider.getSigner();
      if (data.tokenAddress === 'ETH') {
        // Sending ETH
        const tx = await signer.sendTransaction({
          to: data.recipient,
          value: parseEther(data.amount),
        });
        enqueueSnackbar(`Transaction submitted: ${tx.hash}`, { variant: 'info' });
        trackTransaction(tx.hash);
      } else {
        // Sending ERC20 Token
        const contract = new Contract(data.tokenAddress, erc20Abi, signer);
        const decimals = await contract.decimals();
        const amount = parseUnits(data.amount, decimals);
        const tx = await contract.transfer(data.recipient, amount);
        enqueueSnackbar(`Transaction submitted: ${tx.hash}`, { variant: 'info' });
        trackTransaction(tx.hash);
      }
    } catch (error) {
      enqueueSnackbar('Transaction failed!', { variant: 'error' });
      console.error('Error sending transaction:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </Stack>
    </form>
  );
};

export default SendTokenForm;
