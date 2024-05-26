'use client';

import {getWalletClient} from '@wagmi/core';
import {useContext, useState} from 'react';
import {formatUnits} from 'viem';
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
import {cutDecimals} from '@/utils/utils';
import Button from '@/components/ui/button';

interface ClaimTokensProperties {
  membershipData: Membership;
}

export const ClaimTokens = ({membershipData}: ClaimTokensProperties) => {
  const {
    vestedToken,
    chain,
  } = useContext(ProjectConfigContext);
  const config = useContext(WagmiContext);
  const {presaleInstance} = useContext(PresaleContext);
  const {
    selectedMembershipId,
    fetchMemberships,
  } = useContext(MembershipsContext);
  const {fetchVestedTokenData} = useContext(TokensContext);

  const {publicClients} = useContext(PublicClientContext);

  const publicClient = publicClients[chain.id];

  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    if (!presaleInstance || !config) return;

    const client = await getWalletClient(config);

    setIsLoading(true);

    try {
      const txHash = await presaleInstance.claimTokens(
        client,
        chain,
        selectedMembershipId,
      );

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      await fetchMemberships();
      await fetchVestedTokenData();

      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const claimable = BigInt(membershipData.unlocked) - BigInt(membershipData.usage.current);

  return (
    <Card className="row-span-2">
      <div className="flex flex-col justify-between items-center h-full">
        <CardHeader>
          <CardTitle>Claim tokens</CardTitle>
        </CardHeader>

        <CardContent>
          <span className="text-2xl xl:text-4xl font-semibold text-white">
            {cutDecimals(formatUnits(claimable, vestedToken.decimals), 2)}
          </span>

          <ClaimIcon />
        </CardContent>

        <CardFooter>
          <Button
            className="space-x-2"
            onClick={handleClaim}
            disabled={claimable <= 0n || isLoading}
          >
            {isLoading && <Spinner className="animate-spin" />}
            <span>
              Claim
              {vestedToken.symbol}
            </span>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
