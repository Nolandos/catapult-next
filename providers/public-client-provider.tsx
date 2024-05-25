import {createContext, useMemo} from 'react';
import {
  Chain, createPublicClient, http, PublicClient,
} from 'viem';
import {supportedChains} from '@/lib/wagmi/supported-chains';

const chains: readonly [Chain, ...Chain[]] = Object.values(supportedChains) as [
  Chain,
  ...Chain[],
];

export interface PublicClientContextProperties {
  publicClients: { [chianId: number]: PublicClient };
}

export const PublicClientContext = createContext<PublicClientContextProperties>(
  {
    publicClients: {} as PublicClient,
  },
);

export const PublicClientProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const publicClients = chains.reduce(
    (accumulator, chain) => {
      accumulator[chain.id] = createPublicClient({
        chain,
        transport: http(),
        batch: {
          multicall: true,
        },
      });
      return accumulator;
    },
    {} as { [chainId: number]: PublicClient },
  );

  return (
    <PublicClientContext.Provider value={useMemo(
      () => ({
        publicClients,
      }),
      [publicClients],
    )}
    >
      {children}
    </PublicClientContext.Provider>
  );
};
