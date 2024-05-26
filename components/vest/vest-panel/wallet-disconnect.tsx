'use client';

import {useDisconnect} from 'wagmi';
import {DisconnectWalletIcon} from '@/components/icons';
import Button from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/vesting-card';

export const WalletDisconnect = () => {
  // just for testing
  const {disconnect} = useDisconnect();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <DisconnectWalletIcon />
        <Button
          variant="outline"
          onClick={() => {
            disconnect();
          }}
        >
          disconnect
        </Button>
      </CardContent>
    </Card>
  );
};
