'use client';

import {getConnectorClient} from '@wagmi/core';
import {useContext, useState} from 'react';
import {Address} from 'viem';
import {watchAsset} from 'viem/actions';
import {WagmiContext} from 'wagmi';

import Button from '@/components/ui/button';
import {ProjectConfigContext} from '@/providers/project-config-provider';

const AddToMetamask = () => {
  const {vestedToken} = useContext(ProjectConfigContext);

  const [isPending, setIsPending] = useState(false);
  const wagmiConfig = useContext(WagmiContext);

  async function addToMetamask() {
    setIsPending(true);

    const walletClient = await getConnectorClient(wagmiConfig!);

    await watchAsset(walletClient, {
      type: 'ERC20',
      options: {
        address: vestedToken.address as Address,
        decimals: vestedToken.decimals,
        symbol: vestedToken.symbol,
        image: vestedToken.logo,
      },
    })
      .finally(() => setIsPending(false));
  }

  return (
    <Button
      variant="outline"
      onClick={() => addToMetamask()}
      disabled={isPending}
      className="flex flex-row-reverse gap-2"
    >
      Add to MetaMask
      {isPending && <p>Loading...</p>}
    </Button>
  );
};

export default AddToMetamask;
