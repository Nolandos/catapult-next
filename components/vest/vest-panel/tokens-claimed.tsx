'use client';

import {formatUnits} from 'viem';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/vesting-card';
import {Progress} from '@/components/ui/progress';
import {cutDecimals} from '@/utils/utils';

interface TokensClaimedProperties {
  current: string;
  max: string;
  tokenDecimals: number;
}

export const TokensClaimed = ({
  current,
  max,
  tokenDecimals,
}: TokensClaimedProperties) => {
  const claimedPercentage = (Number(current.replaceAll(' ', ''))
      / (Number(max.replaceAll(' ', '')) || 1))
    * 100;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Tokens claimed</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <h2 className="text-2xl xl:text-4xl font-semibold text-white">
          {cutDecimals(formatUnits(BigInt(current), tokenDecimals), 2)}
          {' '}
          of
          {' '}
          {cutDecimals(formatUnits(BigInt(max), tokenDecimals), 2)}
        </h2>
        <Progress value={claimedPercentage} />
      </CardContent>
    </Card>
  );
};
