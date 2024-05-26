'use client';

import clsx from 'clsx';
import {useContext} from 'react';
import {FeeIcon} from '@/components/icons';
import {ProjectConfigContext} from '@/providers/project-config-provider';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/vesting-card';

export const RememberFee = ({isRefundable}: { isRefundable: boolean }) => {
  const {
    vestedToken,
    chain,
  } = useContext(ProjectConfigContext);

  return (
    <Card
      className={clsx(
        'col-span-2 xl:col-span-1',
        !isRefundable && 'xl:col-span-2',
      )}
    >
      <CardHeader>
        <CardTitle>Remember Fee</CardTitle>
      </CardHeader>
      <CardContent className="xl:flex-row gap-6 text-white">
        {!isRefundable && (
          <FeeIcon className="max-w-24 w-full h-auto hidden xl:block" />
        )}

        <p>
          Please remember that you must have
          {' '}
          {chain.nativeCurrency.symbol}
          {' '}
          in
          your wallet to cover network fees each time you claim your
          {' '}
          {vestedToken.symbol}
          .
        </p>
      </CardContent>
    </Card>
  );
};
