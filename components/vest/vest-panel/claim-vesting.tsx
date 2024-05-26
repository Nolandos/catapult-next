'use client';

import {getWalletClient} from '@wagmi/core';
import {useContext, useState} from 'react';
import {WagmiContext} from 'wagmi';

import {Spinner} from '@/components/icons/spinner';
import {ClaimIcon} from '@/components/icons';
import {MembershipsContext} from '@/providers/membership-provider';
import {PresaleContext} from '@/providers/presale-provider';
import {ProjectConfigContext} from '@/providers/project-config-provider';
import {PublicClientContext} from '@/providers/public-client-provider';
import {TokensContext} from '@/providers/tokens-provider';
import {Membership} from '@/class/interface/presale';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/vesting-card';
import Button from '@/components/ui/button';

interface ClaimTokensProperties {
  membershipData: Membership;
}

export const ClaimVesting = ({membershipData}: ClaimTokensProperties) => {
  const {chain} = useContext(ProjectConfigContext);
  const config = useContext(WagmiContext);
  const {presaleInstance} = useContext(PresaleContext);
  const {fetchMemberships} = useContext(MembershipsContext);
  const {fetchVestedTokenData} = useContext(TokensContext);

  const {publicClients} = useContext(PublicClientContext);

  const publicClient = publicClients[chain.id];

  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    if (!presaleInstance || !config) return;

    const client = await getWalletClient(config);

    setIsLoading(true);

    try {
      const txHash = await presaleInstance!.buyTokens(
        client,
        chain,
        membershipData,
        BigInt(membershipData.allocation),
      );

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      fetchMemberships();
      fetchVestedTokenData();

      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Card className="row-span-2">
      <div className="flex flex-col justify-between items-center h-full">
        <CardHeader>
          <CardTitle>Get Vesting</CardTitle>
        </CardHeader>

        <CardContent>
          <ClaimIcon />
        </CardContent>

        <CardFooter>
          <Button
            className="space-x-2"
            onClick={handleClaim}
            disabled={isLoading}
          >
            {isLoading && <Spinner className="animate-spin" />}
            <span>Get Vesting</span>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
