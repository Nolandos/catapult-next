'use client';

import {Card, CardContent} from '@/components/ui/vesting-card';
import {WalletDisconnect} from './vest-panel/wallet-disconnect';
import {WalletStatus} from './vest-panel/wallet-status';

const NoMemberships = () => (
  <div className="grid grid-cols-2 gap-4 w-full">
    <Card className="col-span-2 min-h-56">
      <CardContent className="w-full h-full p-0">
        <h2 className="text-3xl m-auto">You don&apos;t have any vestings</h2>
      </CardContent>
    </Card>

    <WalletStatus />

    <WalletDisconnect />
  </div>
);

export default NoMemberships;
