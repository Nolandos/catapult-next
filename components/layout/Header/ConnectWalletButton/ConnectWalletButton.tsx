'use client';

import {useAccount, useDisconnect} from 'wagmi';
import {useContext} from 'react';
import Button from '@/components/ui/button';
import {Spinner} from '@/components/icons/spinner';
import {ConnectWalletDialogContext} from '@/providers/connect-wallet-provider';

const ConnectWalletButton = () => {
  const {openDialog} = useContext(ConnectWalletDialogContext);
  const {disconnect} = useDisconnect();
  const {
    status,
    address,
  } = useAccount();

  const cutedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  return (
    <Button
      variant={status === 'connected' ? 'outline' : 'default'}
      disabled={status === 'connecting'}
      onClick={() => (status === 'connected' ? disconnect() : openDialog())}
      className="space-x-2"
    >
      {status === 'connecting' && <Spinner className="animate-spin h-5 w-5" />}

      <span>
        {status === 'connected'
          ? `Disconnect ${cutedAddress}`
          : 'Connect Wallet'}
      </span>
    </Button>
  );
};

export default ConnectWalletButton;
