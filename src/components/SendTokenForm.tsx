import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, MenuItem } from '@mui/material';
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
  const { register, handleSubmit } = useForm<FormData>();
  const { enqueueSnackbar } = useSnackbar();
  const { trackTransaction } = useTransaction();

  const onSubmit = async (data: FormData) => {
    if (!provider || !account) {
      enqueueSnackbar('Please connect your wallet.', { variant: 'warning' });
      return;
    }

    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
      enqueueSnackbar('Please switch to the Sepolia network in your wallet.', {
        variant: 'warning',
      });
      return;
    }

    try {
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        select
        label="Token"
        fullWidth
        margin="normal"
        {...register('tokenAddress', { required: true })}
      >
        {supportedTokens.map(token => (
          <MenuItem key={token.address} value={token.address}>
            {token.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Recipient Address"
        fullWidth
        margin="normal"
        {...register('recipient', { required: true })}
      />
      <TextField
        label="Amount"
        type="number"
        fullWidth
        margin="normal"
        {...register('amount', { required: true })}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Send
      </Button>
    </form>
  );
};

export default SendTokenForm;
