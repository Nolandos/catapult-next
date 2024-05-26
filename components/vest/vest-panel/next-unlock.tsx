'use client';

import {formatUnits} from 'viem';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/vesting-card';
import {cutDecimals} from '@/utils/utils';

interface NextUnlockProperties {
  value: string;
  timestamp: number;
  tokenDecimals: number;
  allUnlocked: boolean;
}

export const NextUnlock = ({
  value,
  timestamp,
  tokenDecimals,
  allUnlocked,
}: NextUnlockProperties) => {
  timestamp = 1_715_169_600;

  const unlockDateString = new Date(timestamp * 1000).toLocaleDateString(
    'UTC',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
    },
  );

  return (
    <Card className="col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle>Unlock</CardTitle>
        {!allUnlocked && timestamp > 0 && timestamp * 1000 > Date.now() && (
          <CardDescription>{unlockDateString}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-full">
        {allUnlocked ? (
          <span className="text-lg xl:text-2xl font-semibold text-white">
            All tokens have been unlocked
          </span>
        ) : (
          <span className="text-2xl xl:text-4xl font-semibold text-white">
            {timestamp > 0
              ? cutDecimals(formatUnits(BigInt(value), tokenDecimals), 2)
              : 'TBA'}
          </span>
        )}
      </CardContent>
    </Card>
  );
};
