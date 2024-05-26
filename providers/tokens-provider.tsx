import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  Address, erc20Abi, getContract, maxInt256, zeroAddress,
} from 'viem';
import {useAccount} from 'wagmi';

import {ProjectConfigContext} from './project-config-provider';
import {PublicClientContext} from './public-client-provider';

export type Token = {
  address: Address
  symbol: string
  decimals: number
  balance: string
  allowance?: string
  url?: string
}

export interface TokensContextProperties {
  vestedToken: Token;
  collectedToken: Token;
  fetchVestedTokenData: () => void;
  fetchCollectedTokenData: () => void;
  loading: boolean;
}

export const TokensContext = createContext<TokensContextProperties>({
  vestedToken: {
    address: zeroAddress,
    symbol: '',
    balance: '0',
    decimals: 18,
  },
  collectedToken: {
    address: zeroAddress,
    symbol: '',
    balance: '0',
    decimals: 18,
  },
  fetchVestedTokenData: () => {
  },
  fetchCollectedTokenData: () => {
  },
  loading: true,
});

interface TokensProviderProperties {
  children: React.ReactNode;
}

export const TokensProvider = ({children}: TokensProviderProperties) => {
  const {
    vestedToken,
    collectedToken,
    presaleAddress,
  } = useContext(ProjectConfigContext);
  const {publicClients} = useContext(PublicClientContext);
  const {
    address: walletAddress,
    chainId,
  } = useAccount();

  const publicClient = publicClients[chainId!];

  const [vestedTokenData, setVestedTokenData] = useState<Token>({
    ...vestedToken,
    balance: '0',
  });

  const [collectedTokenData, setCollectedTokenData] = useState<Token>({
    ...collectedToken,
    balance: '0',
    allowance: '0',
  });

  const fetchVestedTokenData = async () => {
    const vestedTokenContract = getContract({
      client: publicClient,
      address: vestedToken.address,
      abi: erc20Abi,
    });

    const balance = await vestedTokenContract.read.balanceOf([walletAddress!]);

    const _vestedToken = {
      ...vestedToken,
      balance: balance.toString(),
    };

    setVestedTokenData(_vestedToken);
  };

  const fetchCollectedTokenData = async () => {
    if (collectedToken.isNative) {
      const balance = await publicClient.getBalance({address: walletAddress!});

      const _collectedToken = {
        ...collectedToken,
        balance: balance.toString(),
        allowance: maxInt256.toString(),
      };

      setCollectedTokenData(_collectedToken);

      return;
    }

    const collectedTokenContract = getContract({
      client: publicClient,
      address: collectedToken.address,
      abi: erc20Abi,
    });

    const [balance, allowance] = await Promise.all([
      collectedTokenContract.read.balanceOf([walletAddress!]),
      collectedTokenContract.read.allowance([walletAddress!, presaleAddress]),
    ]);

    const _collectedToken = {
      ...collectedToken,
      balance: balance.toString(),
      allowance: allowance.toString(),
    };

    setCollectedTokenData(_collectedToken);
  };

  const fetchTokensData = async () => {
    await Promise.all([fetchVestedTokenData(), fetchCollectedTokenData()]);
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokensData();
    }
  }, [walletAddress]);

  return (
    <TokensContext.Provider
      value={useMemo(
        () => ({
          vestedToken: vestedTokenData,
          collectedToken: collectedTokenData,
          fetchVestedTokenData,
          fetchCollectedTokenData,
          loading: false,
        }),
        [vestedTokenData, collectedTokenData, fetchVestedTokenData, fetchCollectedTokenData],
      )}
    >
      {children}
    </TokensContext.Provider>
  );
};
