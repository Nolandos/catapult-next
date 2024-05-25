'use client';

import {clsx} from 'clsx';
import {
  FC, useContext, useEffect, useState,
} from 'react';
import {cutDecimals} from '@/utils/utils';
import {supportedChains} from '@/lib/wagmi/supported-chains';
import {PublicClientContext} from '@/providers/public-client-provider';
import {
  Address, erc20Abi, formatUnits, getContract,
} from 'viem';
import {Presale, Token} from '@/utils/types.common';
import BuyTokens from '@/components/presale/BuyTokens';
import NetworkWrapper from '@/components/common/NetworkWrapper';
import {useTranslations} from 'next-intl';

const StartedProject: FC = () => {
  const t = useTranslations('Project');
  const chains = [supportedChains.bsc, supportedChains.base];
  const [tokensData, setTokensData] = useState<{ [chianId: number]: Token }>({
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
  const presaleData: { [chainId: number]: Presale } = {
    56: {
      address: '0x25957BE678dD622a044ee3597dea5FEb93CDC2FA' as Address,
    },
    8453: {
      address: '0x6d37AF79722266fa1c38A8453106789f57168F3B' as Address,
    },
  };
  const [loadingTotalLocked, setLoadingTotalLocked] = useState<boolean>(false);
  const [totalLocked, setTotalLocked] = useState('0');
  const {publicClients} = useContext(PublicClientContext);

  const handleFetchTokensData = async () => {
    setLoadingTotalLocked(true);

    const balancePromises = chains.map(async (chain) => {
      const client = publicClients[chain.id];

      const tokenContract = getContract({
        address: tokensData[chain.id].address,
        abi: erc20Abi,
        client,
      });

      const balance = await tokenContract.read.balanceOf([
        presaleData[chain.id].address,
      ]);

      return balance;
    });

    const balances = await Promise.all(balancePromises);

    const summaryLocked = balances.reduce((acc, balance) => acc + balance, BigInt(0));
    setTotalLocked(summaryLocked.toString());
    setLoadingTotalLocked(false);
  };

  useEffect(() => {
    handleFetchTokensData();
    const interval = setInterval(() => handleFetchTokensData(), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-[30px] w-full max-w-[700px]">
      <div
        className="flex flex-wrap justify-between border border-cyan-500 text-cyan-500 px-4 py-2 rounded-[37px] items-center gap-2"
      >
        <p className="capitalize text-white font-normal">{t('startedProject.totallyLockedInfo')}</p>

        <p
          className={clsx(
            'transition-colors duration-300 font-semibold text-[20px]',
            loadingTotalLocked && 'text-yellow-500',
          )}
        >
          {cutDecimals(formatUnits(BigInt(totalLocked), 18), 2)}
          {' '}
          {tokensData[56].symbol}
        </p>
      </div>

      <NetworkWrapper chains={chains}>
        <BuyTokens
          chains={chains}
          tokensData={tokensData}
          setTokensData={setTokensData}
          presaleData={presaleData}
        />
      </NetworkWrapper>
    </div>
  );
};

export default StartedProject;
