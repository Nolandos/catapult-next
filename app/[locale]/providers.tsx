'use client';

import {config} from '@/lib/wagmi/config';
import {WagmiProvider} from 'wagmi';
import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConnectWalletDialogProvider} from '@/providers/connect-wallet-provider';

const Providers = ({children}: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config('ef27756cb7e71c030c568b2a4d1a2c8a')}>
      <QueryClientProvider client={queryClient}>
        <ConnectWalletDialogProvider>
          {children}
        </ConnectWalletDialogProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
