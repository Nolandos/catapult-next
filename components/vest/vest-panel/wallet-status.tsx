'use client';

import {useAccount} from 'wagmi';
import {StatusConnectedIcon} from '@/components/icons';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/vesting-card';
import {addressShortener} from '@/utils/utils';

interface WalletStatusProperties {
  className?: string;
}

export const WalletStatus = ({className}: WalletStatusProperties) => {
  const {address} = useAccount();
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Wallet status</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <StatusConnectedIcon />
        <div>
          <span className="uppercase text-lg xl:text-2xl font-semibold">
            connected
          </span>

          {address && <p className="text-white">{addressShortener(address)}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
