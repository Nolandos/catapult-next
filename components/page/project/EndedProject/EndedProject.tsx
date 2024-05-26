'use client';

import NetworkWrapper from '@/components/common/NetworkWrapper';
import ClaimBackCata from '@/components/presale/claim-back-cata';
import {FC, useState} from 'react';
import {Token} from '@/utils/types.common';
import {supportedChains} from '@/lib/wagmi/supported-chains';
import {
  Address,
} from 'viem';

type EndedProjectProps = {
  data: {
    token: string,
    withdrawalContractAddress: string,
    slug: string,
  }
}

const EndedProject: FC<EndedProjectProps> = ({data}) => {
  const {
    token,
    withdrawalContractAddress,
    slug,
  } = data;
  const [tokensData] = useState<{ [chianId: number]: Token }>({
    56: {
      address: '0xBDf5bAfEE1291EEc45Ae3aadAc89BE8152D4E673' as Address,
      chainId: 56,
      balance: '0',
      allowance: '0',
      deposited: '0',
      decimals: 18,
      symbol: 'CATA',
    },
    8453: {
      address: '0xBDf5bAfEE1291EEc45Ae3aadAc89BE8152D4E673' as Address,
      chainId: 8453,
      balance: '0',
      allowance: '0',
      deposited: '0',
      decimals: 18,
      symbol: 'CATA',
    },
  });
  return (
    <div className="flex flex-col gap-4 mt-[30px] w-full max-w-[700px]">
      <NetworkWrapper chains={[supportedChains.base]}>
        <ClaimBackCata
          vestedTokenSymbol={token}
          withdrawalContractAddress={
            withdrawalContractAddress as Address
          }
          tokensData={tokensData}
          slug={slug!}
        />
      </NetworkWrapper>
    </div>
  );
};

export default EndedProject;
