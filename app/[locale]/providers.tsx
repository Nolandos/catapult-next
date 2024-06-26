'use client';

import {config} from '@/lib/wagmi/config';
import {WagmiProvider} from 'wagmi';
import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ConnectWalletDialogProvider} from '@/providers/connect-wallet-provider';
import {PublicClientProvider} from '@/providers/public-client-provider';

const Providers = ({children}: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config(process.env.NEXT_PUBLIC_WALLET_CONNECTED_PROJECT_ID || '')}>
      <QueryClientProvider client={queryClient}>
        <ConnectWalletDialogProvider>
          <PublicClientProvider>
            {children}
          </PublicClientProvider>
        </ConnectWalletDialogProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
