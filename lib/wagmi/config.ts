import {Chain} from 'viem/chains';
import {createConfig, http} from 'wagmi';
import {injected, walletConnect} from 'wagmi/connectors';

import {supportedChains} from './supported-chains';

const chains: readonly [Chain, ...Chain[]] = Object.values(supportedChains) as [
  Chain,
  ...Chain[],
];

export const config = (walletConnectProjectId: string) => createConfig({
  chains,
  connectors: [
    injected({
      target: 'metaMask',
    }),
    walletConnect({
      projectId: walletConnectProjectId,
    }),
  ],
  transports: chains.reduce(
    (accumulator, chain) => {
      accumulator[chain.id] = http();
      return accumulator;
    },
    {} as { [chainId: number]: ReturnType<typeof http> },
  ),
});

export type WagmiConfig = typeof config

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
