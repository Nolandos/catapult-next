import {ArrowUpRightFromSquareIcon} from 'lucide-react';
import {useContext, useEffect, useState} from 'react';
import {Address, formatUnits, getContract} from 'viem';
import {WagmiContext, useAccount} from 'wagmi';
import {getWalletClient} from '@wagmi/core';
import Button from '@/components/ui/button';
import {PublicClientContext} from '@/providers/public-client-provider';
import {withdrawalsAbi} from '@/abi/withdrawals';
import {cutDecimals} from '@/utils/utils';
import {Token} from '@/utils/types.common';
import Link from 'next/link';

interface ClaimBackCataProperties {
  vestedTokenSymbol: string;
  withdrawalContractAddress: Address;
  tokensData: { [chianId: number]: Token };
  slug: string;
}

interface Proof {
  allocation: string;
  proofs: unknown;
}

const ClaimBackCata = ({
  vestedTokenSymbol,
  withdrawalContractAddress,
  tokensData,
  slug,
}: ClaimBackCataProperties) => {
  const {publicClients} = useContext(PublicClientContext);
  const config = useContext(WagmiContext);

  const [proofs, setProofs] = useState<Proof>({} as Proof);
  const {
    address,
    chainId,
  } = useAccount();

  const publicClient = publicClients[chainId!];

  const [token, setToken] = useState<Token>(tokensData[chainId!]);

  useEffect(() => {
    setToken(tokensData[chainId!]);

    const fetchProofs = async () => {
      const response = await fetch(
        `/proofs/${slug}/claimback/${address!.toLowerCase()}.json`,
      );
      const data = await response.json();

      const withdrawalContract = getContract({
        address: withdrawalContractAddress,
        abi: withdrawalsAbi,
        client: publicClient,
      });

      // lemu
      if (slug === 'the-lucky-lemu') {
        const withdrawed = await withdrawalContract.read.deposits([address!]);

        if (withdrawed) {
          delete data.allocation;
        }
      }

      // pingu
      if (slug === 'pingu-on-base') {
        const withdrawed = await withdrawalContract.read.withdrawals([address!]);

        if (withdrawed) {
          delete data.allocation;
        }
      }

      setProofs(data);
    };

    fetchProofs();
  }, [address, chainId]);

  const claimBackCata = async (amount: string, _proofs: unknown) => {
    const client = await getWalletClient(config!);

    const withdrawalContract = getContract({
      address: withdrawalContractAddress,
      abi: withdrawalsAbi,
      client,
    });

    const txHash = await withdrawalContract.write.withdraw([
      BigInt(amount),
      _proofs as Address[],
    ]);

    await publicClients[chainId!].waitForTransactionReceipt({
      hash: txHash,
      confirmations: 5,
    });

    setProofs({} as Proof);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        className="flex justify-between border border-cyan-500 text-cyan-500 font-semibold px-4 py-2 rounded-[37px] items-center gap-2 text-xl md:text-2xl"
      >
        <p className="capitalize text-white">Get CATA back </p>
        {proofs.allocation
          ? cutDecimals(formatUnits(BigInt(proofs.allocation), 18), 2)
          : '0'}
        {' '}
        {token.symbol}
      </div>

      <div className="flex flex-row gap-4 justify-center">
        <Link href={`/vesting/${slug}`}>
          <Button variant="link">
            Claim
            {' '}
            {vestedTokenSymbol}
            {' '}
            <ArrowUpRightFromSquareIcon className="ml-2" />
          </Button>
        </Link>

        {proofs.allocation && (
          <Button
            onClick={() => claimBackCata(proofs.allocation, proofs.proofs)}
          >
            Get
            {' '}
            {token.symbol}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClaimBackCata;
