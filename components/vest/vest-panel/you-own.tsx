'use client';

import {formatUnits} from 'viem';
import {WalletIcon} from '@/components/icons';
import {Spinner} from '@/components/icons/spinner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/vesting-card';
import {cutDecimals} from '@/utils/utils';

interface YouOwnProperties {
  balance: string;
  symbol: string;
  decimals: number;
}

export const YouOwn = ({
  balance,
  symbol,
  decimals,
}: YouOwnProperties) => (
  <Card>
    <CardHeader>
      <CardTitle>You own</CardTitle>
    </CardHeader>
    <CardContent>
      <WalletIcon />
      {balance === undefined ? (
        <Spinner className="animate-spin" />
      ) : (
        <div className="flex flex-col gap-2 text-white">
          <span className="text-2xl xl:text-4xl font-semibold">
            {cutDecimals(formatUnits(BigInt(balance), decimals), 2)}
          </span>
          <span className="text-xl xl:text-2xl font-semibold">{symbol}</span>
        </div>
      )}
    </CardContent>
  </Card>
);
