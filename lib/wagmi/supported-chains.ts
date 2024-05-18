import {
  Chain, bsc, base, baseSepolia, foundry,
} from 'viem/chains';

export const supportedChains: { [key: string]: Chain } = {
  // bscTestnet,
  // baseSepolia,
  bsc,
  base,
  baseSepolia,
  foundry,
  // bsc: {
  //   ...bsc,
  //   name: 'Phalcon Lemu',
  //   rpcUrls: {
  //     default: {
  //       http: [
  //         'https://rpc.phalcon.blocksec.com/rpc_8934c8529b28409297a7a9447f887c15',
  //       ],
  //     },
  //   },
  // },
};
