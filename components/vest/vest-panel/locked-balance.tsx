'use client';

import {formatUnits} from 'viem';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/vesting-card';
import {cutDecimals} from '@/utils/utils';

interface LockedBalanceProperties {
  locked: string;
  tokenDecimals: number;
}

export const LockedBalance = ({
  locked,
  tokenDecimals,
}: LockedBalanceProperties) => (
  <Card>
    <CardHeader>
      <CardTitle>Locked balance</CardTitle>
    </CardHeader>
    <CardContent className="h-full">
      <span className="text-2xl xl:text-4xl font-semibold text-white">
        {cutDecimals(formatUnits(BigInt(locked), tokenDecimals), 2)}
      </span>
    </CardContent>
  </Card>
);
