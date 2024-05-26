// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
import {
  Address,
  Chain,
  Client,
  encodeAbiParameters,
  erc20Abi,
  getContract,
  keccak256,
  WalletClient,
} from 'viem';

import {membershipV4Abi} from '@/abi/membership/membership-v4-abi';
import {presaleV4Abi} from '@/abi/presale/presale-v4-abi';

// eslint-disable-next-line import/no-cycle
import {
  IPresale,
  Membership,
  Presale,
  PresaleRoundState,
  PresaleRoundStateValue,
  Round,
} from './interface/presale';
import {PresaleVersion} from './presale-factory';

type GetRoundsReturnType = [number[], Round[], PresaleRoundStateValue[]]

interface PresaleV4Properties {
  client: Client;
  contractAddress: Address;
  vestedToken: Address;
  collectedToken: Address;
  listingTimestamp: bigint;
  claimbackPeriod: bigint;
  rounds: Round[];
  membership: Address;
}

interface PresaleV4Proofs {
  address: Address;
  price: string;
  allocation: string;
  claimbackPeriod: number;
  tradeable: number;
  tgeNumerator: number;
  tgeDenominator: number;
  cliffDuration: number;
  cliffNumerator: number;
  cliffDenominator: number;
  vestingPeriodCount: number;
  vestingPeriodDuration: number;
  proofs: string[];
}

interface PresaleV4Membership extends Membership {
  tradeable: 1 | 2;
  claimbackPeriod: number;
}

export class PresaleV4 implements IPresale {
  // eslint-disable-next-line class-methods-use-this
  public getVersion(): PresaleVersion {
    return 'v4';
  }

  public client: Client;

  public presaleContractAddress: Address;

  /// ERC20 implementation of the token sold.
  public vestedToken: Address;

  /// ERC20 implementation of the token collected.
  public collectedToken: Address;

  /// Timestamp indicating when the tge should be available.
  public listingTimestamp: bigint;

  /// How much time in seconds since `listingTimestamp` do Users have to claimback collectedToken
  public claimbackPeriod: bigint;

  /// Presale rounds settings
  public rounds: Round[];

  public membership: Address;

  constructor({
    client,
    contractAddress,
    vestedToken,
    collectedToken,
    listingTimestamp,
    claimbackPeriod,
    rounds,
    membership,
  }: PresaleV4Properties) {
    this.client = client;

    this.presaleContractAddress = contractAddress;

    this.vestedToken = vestedToken;
    this.collectedToken = collectedToken;
    this.listingTimestamp = listingTimestamp;
    this.claimbackPeriod = claimbackPeriod;
    this.rounds = rounds;

    this.membership = membership;
  }

  public static async createInstance(
    publicClient: Client,
    presaleContractAddress: Address,
  ): Promise<IPresale> {
    const presaleContract = getContract({
      client: publicClient,
      address: presaleContractAddress,
      abi: presaleV4Abi,
    });

    const [
      vestedToken,
      collectedToken,
      rawRoundsData,
      membership,
      listingTimestamp,
      claimbackPeriod,
    ] = await Promise.all([
      presaleContract.read.tokenA() as Promise<Address>,
      presaleContract.read.tokenB() as Promise<Address>,
      presaleContract.read.getRounds() as unknown as Promise<GetRoundsReturnType>,
      presaleContract.read.membership() as Promise<Address>,
      presaleContract.read.getListingTimestamp() as Promise<bigint>,
      presaleContract.read.claimbackPeriod() as Promise<bigint>,
    ]);

    const [ids, data, states] = rawRoundsData;

    // for each id in ids, create a round object
    const rounds: Round[] = ids.map((id, index) => {
      const round = data[index];
      const state = states[index];

      return {
        roundId: Number(id),
        state,
        name: round.name,
        startTimestamp: Number(round.startTimestamp) * 1000,
        endTimestamp: Number(round.endTimestamp) * 1000,
        listingTimestamp: Number(listingTimestamp) * 1000,
        refundsEndTimestamp:
          listingTimestamp > 0n
            ? Number(listingTimestamp + claimbackPeriod) * 1000
            : 0,
        proofsUri: round.proofsUri,
        whitelistRoot: round.whitelistRoot,
      };
    });

    return new PresaleV4({
      client: publicClient,
      contractAddress: presaleContractAddress,
      vestedToken,
      collectedToken,
      listingTimestamp,
      claimbackPeriod,
      rounds,
      membership,
    });
  }

  public getPresaleData(): Presale {
    return {
      presaleContractAddress: this.presaleContractAddress,
      vestedToken: this.vestedToken,
      collectedToken: this.collectedToken,
      listingTimestamp: Number(this.listingTimestamp),
      claimbackPeriod: Number(this.claimbackPeriod),
      rounds: this.rounds,
    };
  }

  public async getMemberships(
    walletAddress: Address,
    projectName: string,
    roundsCount: number,
  ): Promise<PresaleV4Membership[]> {
    const memberships: PresaleV4Membership[] = [];

    const proofsMemberships = await this.getProofsMemberships(
      walletAddress,
      projectName,
      roundsCount,
    );

    if (proofsMemberships.length > 0) {
      memberships.push(...proofsMemberships);
    }

    const nftMemberships = await this.getNftMemberships(walletAddress);

    if (nftMemberships.length > 0) {
      memberships.push(...nftMemberships);
    }

    return memberships;
  }

  private async getProofsMemberships(
    walletAddress: Address,
    projectName: string,
    roundsCount: number,
  ): Promise<PresaleV4Membership[]> {
    const activeRounds = this.rounds.filter(
      (round) => round.state !== PresaleRoundState.vesting,
    );

    const getProofsForTier = async (
      round: string,
      tier: number,
      address: Address,
    ) => fetch(
      `/proofs/${projectName}/vesting/${round.toLowerCase()}/${tier}/${address.toLowerCase()}.json`,
    )
      .then((response) => response.json())
      .catch(() => {
        // console.log(`No proofs for address ${address} in round ${round} tier ${tier}`);

      });

    const proofsPromises = activeRounds.map((round) => {
      const tiers = Array.from({length: roundsCount}, (_, index) => index + 1);
      const promises = tiers.map((tier) => getProofsForTier(round.name, tier, walletAddress));

      return Promise.all(promises);
    });

    const proofs: { [key: number]: PresaleV4Proofs[] } = await Promise.all(proofsPromises);

    const memberships: PresaleV4Membership[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, round] of activeRounds.entries()) {
      for (const [tier, proof] of proofs[index].entries()) {
        if (proof) {
          const _membership: PresaleV4Membership = {
            id: `${round.name} Tier ${tier < 2 ? tier + 1 : '3-5'}`,
            roundId: round.roundId,
            usage: {
              max: proof.allocation,
              current: '0',
            },
            price: proof.price,
            allocation: proof.allocation,
            claimbackPeriod: proof.claimbackPeriod,
            claimableBackUnit: '0',
            tgeNumerator: proof.tgeNumerator,
            tgeDenominator: proof.tgeDenominator,
            cliffDuration: proof.cliffDuration,
            cliffNumerator: proof.cliffNumerator,
            cliffDenominator: proof.cliffDenominator,
            vestingPeriodCount: proof.vestingPeriodCount,
            vestingPeriodDuration: proof.vestingPeriodDuration,
            tgeStartTimestamp: 0,
            locked: proof.allocation,
            unlocked: '0',
            nextUnlockTimestamp: 0,
            nextUnlockValue: '0',
            tradeable: proof.tradeable as 1 | 2,
            proofs: proof.proofs,
          };

          memberships.push(_membership);
        }
      }
    }

    const presaleContract = getContract({
      client: this.client,
      address: this.presaleContractAddress,
      abi: presaleV4Abi,
    });

    return await Promise.all(
      memberships.map(async (membership) => {
        const proofsHash = this.getProofsHash({
          address: walletAddress,
          price: BigInt(membership.price),
          allocation: BigInt(membership.allocation),
          claimbackPeriod: BigInt(membership.claimbackPeriod),
          tgeNumerator: membership.tgeNumerator,
          tgeDenominator: membership.tgeDenominator,
          cliffDuration: membership.cliffDuration,
          cliffNumerator: membership.cliffNumerator,
          cliffDenominator: membership.cliffDenominator,
          vestingPeriodCount: membership.vestingPeriodCount,
          vestingPeriodDuration: membership.vestingPeriodDuration,
          tradeable: membership.tradeable,
        });

        return {
          participated: await presaleContract.read.roundParticipants([
            BigInt(membership.roundId),
            proofsHash,
          ]),
          membership,
        };
      }),
    )
      .then((results) => results
        .filter((result) => !result.participated)
        .map((result) => result.membership));
  }

  private async getNftMemberships(walletAddress: Address) {
    const memberships: PresaleV4Membership[] = [];

    const membershipNftContract = getContract({
      address: this.membership,
      abi: membershipV4Abi,
      client: this.client,
    });

    const membershipBalance = await membershipNftContract.read.balanceOf([
      walletAddress,
    ]);
    // const membershipBalance = await Promise.resolve(3n);

    if (membershipBalance > BigInt(0)) {
      const allMembershipNfts = Array.from(
        {length: Number(membershipBalance)},
        (_, index) => index,
      );

      // for each membership nft, get the membershipId
      const promises = allMembershipNfts.map((_, index) => membershipNftContract.read.tokenOfOwnerByIndex([
        walletAddress,
        BigInt(index),
      ]));

      const membershipIds = await Promise.all(promises);

      const presaleContract = getContract({
        client: this.client,
        address: this.presaleContractAddress,
        abi: presaleV4Abi,
      });

      // for each membershipId, get the membership
      const membershipPromises = membershipIds.map((membershipId) => Promise.all([
        membershipNftContract.read.getUsage([membershipId]),
        membershipNftContract.read.getAttributes([membershipId]),
        membershipNftContract.read.getRoundId([membershipId]),
        presaleContract.read.getTgeTimestamp(),
        membershipNftContract.read.unlocked([
          membershipId,
        ]) as Promise<bigint>,
      ]));

      const membershipData = await Promise.all(membershipPromises);

      memberships.push(
        ...membershipData.map((membership, index) => {
          const [usage, attributes, roundId, start, unlocked] = membership;

          return {
            id: membershipIds[index].toString(),
            roundId: Number(roundId),
            usage: {
              max: usage.max.toString(),
              current: usage.current.toString(),
            },
            price: attributes.price.toString(),
            allocation: attributes.allocation.toString(),
            claimbackPeriod: Number(attributes.claimbackPeriod),
            claimableBackUnit:
              attributes.claimbackPeriod > 0 ? usage.max.toString() : '0',
            tgeNumerator: Number(attributes.tgeNumerator),
            tgeDenominator: Number(attributes.tgeDenominator),
            cliffDuration: Number(attributes.cliffDuration),
            cliffNumerator: Number(attributes.cliffNumerator),
            cliffDenominator: Number(attributes.cliffDenominator),
            vestingPeriodCount: Number(attributes.vestingPeriodCount),
            vestingPeriodDuration: Number(attributes.vestingPeriodDuration),
            tradeable: attributes.tradeable as 1 | 2,
            tgeStartTimestamp: Number(start),
            locked:
              start > 0n
                ? (usage.max - unlocked).toString()
                : usage.max.toString(),
            unlocked: start > 0n ? unlocked.toString() : 0n.toString(),
            nextUnlockTimestamp:
              start === 0n
                ? 0
                : this.calculateNextUnlock(
                  Date.now() / 1000,
                  {
                    cliffDuration: Number(attributes.cliffDuration),
                    vestingPeriodCount: Number(attributes.vestingPeriodCount),
                    vestingPeriodDuration: Number(
                      attributes.vestingPeriodDuration,
                    ),
                  },
                  Number(start),
                ),
            nextUnlockValue:
              start === 0n
                ? '0'
                : this.calculateNextUnlockValue(
                  Date.now() / 1000,
                  {
                    usageMax: usage.max.toString(),
                    cliffDuration: Number(attributes.cliffDuration),
                    vestingPeriodCount: Number(attributes.vestingPeriodCount),
                    vestingPeriodDuration: Number(
                      attributes.vestingPeriodDuration,
                    ),
                    tgeNumerator: Number(attributes.tgeNumerator),
                    tgeDenominator: Number(attributes.tgeDenominator),
                  },
                  Number(start),
                ),
          };
        }),
      );
    }

    return memberships.filter((membership) => membership.roundId !== 4);
  }

  public setApproval(
    walletClient: WalletClient,
    chain: Chain,
    amount: bigint,
  ): Promise<Address> {
    if (walletClient.account === undefined) {
      throw new Error('Account is undefined');
    }

    return walletClient.writeContract({
      address: this.collectedToken,
      abi: erc20Abi,
      functionName: 'approve',
      args: [this.presaleContractAddress, amount],
      account: walletClient.account,
      chain,
    });
  }

  public buyTokens(
    walletClient: WalletClient,
    chain: Chain,
    membership: PresaleV4Membership,
    amount: bigint,
  ): Promise<Address> {
    if (walletClient.account === undefined) {
      throw new Error('Account is undefined');
    }

    // const EthValue = (BigInt(membership.price) * amount) / 10n ** 18n

    if (membership.proofs) {
      return walletClient.writeContract({
        address: this.presaleContractAddress,
        abi: presaleV4Abi,
        functionName: 'buy',
        // value: EthValue,
        args: [
          BigInt(membership.roundId),
          amount,
          {
            price: BigInt(membership.price),
            allocation: BigInt(membership.allocation),
            claimbackPeriod: BigInt(membership.claimbackPeriod),
            tgeNumerator: Number(membership.tgeNumerator),
            tgeDenominator: Number(membership.tgeDenominator),
            cliffDuration: Number(membership.cliffDuration),
            cliffNumerator: Number(membership.cliffNumerator),
            cliffDenominator: Number(membership.cliffDenominator),
            vestingPeriodCount: Number(membership.vestingPeriodCount),
            vestingPeriodDuration: Number(membership.vestingPeriodDuration),
            tradeable: membership.tradeable,
          },
          membership.proofs! as Address[],
        ],
        account: walletClient.account,
        chain,
      });
    }
    return walletClient.writeContract({
      address: this.presaleContractAddress,
      abi: presaleV4Abi,
      functionName: 'extend',
      // value: EthValue,
      args: [BigInt(membership.id), amount],
      account: walletClient.account,
      chain,
    });
  }

  public claimTokens(
    walletClient: WalletClient,
    chain: Chain,
    membershipId: string,
  ): Promise<Address> {
    if (walletClient.account === undefined) {
      throw new Error('Account is undefined');
    }

    return walletClient.writeContract({
      address: this.presaleContractAddress,
      abi: presaleV4Abi,
      functionName: 'claim',
      args: [BigInt(membershipId)],
      account: walletClient.account,
      chain,
    });
  }

  public claimBackTokens(
    walletClient: WalletClient,
    chain: Chain,
    membershipId: string,
    amount: bigint,
  ): Promise<Address> {
    if (walletClient.account === undefined) {
      throw new Error('Account is undefined');
    }

    return walletClient.writeContract({
      address: this.presaleContractAddress,
      abi: presaleV4Abi,
      functionName: 'claimback',
      args: [BigInt(membershipId), amount],
      account: walletClient.account,
      chain,
    });
  }

  public transferMembership(
    walletClient: WalletClient,
    chain: Chain,
    to: Address,
    membershipId: string,
  ): Promise<Address> {
    if (walletClient.account === undefined) {
      throw new Error('Account is undefined');
    }

    return walletClient.writeContract({
      address: this.membership,
      abi: membershipV4Abi,
      functionName: 'transferFrom',
      args: [walletClient.account.address, to, BigInt(membershipId)],
      account: walletClient.account,
      chain,
    });
  }

  private calculateNextUnlockValue(
    timestamp: number,
    attributes: {
      usageMax: string
      cliffDuration: number
      vestingPeriodCount: number
      vestingPeriodDuration: number
      tgeNumerator: number
      tgeDenominator: number
    },
    tgeStartTimestamp: number,
  ) {
    if (attributes.vestingPeriodCount === 0) return attributes.usageMax;

    const duration = (attributes.vestingPeriodCount - 1) * attributes.vestingPeriodDuration
      + attributes.cliffDuration;

    if (timestamp >= tgeStartTimestamp + duration) return '0';

    const tgeValue = (BigInt(attributes.usageMax) * BigInt(attributes.tgeNumerator))
      / BigInt(attributes.tgeDenominator);

    const unlockValue = (BigInt(attributes.usageMax) - tgeValue)
      / BigInt(attributes.vestingPeriodCount);

    // TGE
    if (timestamp < tgeStartTimestamp) {
      return tgeValue.toString();
    }

    return unlockValue.toString();
  }

  private calculateNextUnlock(
    timestamp: number,
    attributes: {
      cliffDuration: number
      vestingPeriodCount: number
      vestingPeriodDuration: number
    },
    tgeStartTimestamp: number,
  ) {
    if (attributes.vestingPeriodCount === 0) return tgeStartTimestamp;

    const duration = (attributes.vestingPeriodCount - 1) * attributes.vestingPeriodDuration
      + attributes.cliffDuration;

    const firstUnlock = tgeStartTimestamp + attributes.cliffDuration;

    if (timestamp >= tgeStartTimestamp + duration) return 0;

    // TGE
    if (timestamp < tgeStartTimestamp) {
      return tgeStartTimestamp;
    }

    // First unlock
    if (timestamp < firstUnlock && attributes.cliffDuration != 0) {
      return firstUnlock;
    }

    // calculate next unlock if u know that it is + attributes.vestingPeriodDuration from first unlock
    const periodsSinceStart = Math.floor(
      (timestamp - firstUnlock) / attributes.vestingPeriodDuration,
    );

    return (
      firstUnlock + (periodsSinceStart + 1) * attributes.vestingPeriodDuration
    );
  }

  private getProofsHash = ({
    address,
    price,
    allocation,
    claimbackPeriod,
    tgeNumerator,
    tgeDenominator,
    cliffDuration,
    cliffNumerator,
    cliffDenominator,
    vestingPeriodCount,
    vestingPeriodDuration,
    tradeable,
  }: {
    address: Address
    price: bigint
    allocation: bigint
    claimbackPeriod: bigint
    tgeNumerator: number
    tgeDenominator: number
    cliffDuration: number
    cliffNumerator: number
    cliffDenominator: number
    vestingPeriodCount: number
    vestingPeriodDuration: number
    tradeable: number
  }) => {
    const encodedData = encodeAbiParameters(
      [
        {
          name: 'address',
          type: 'address',
        },
        {
          name: 'price',
          type: 'uint256',
        },
        {
          name: 'allocation',
          type: 'uint256',
        },
        {
          name: 'claimbackPeriod',
          type: 'uint256',
        },
        {
          name: 'tgeNumerator',
          type: 'uint32',
        },
        {
          name: 'tgeDenominator',
          type: 'uint32',
        },
        {
          name: 'cliffDuration',
          type: 'uint32',
        },
        {
          name: 'cliffNumerator',
          type: 'uint32',
        },
        {
          name: 'cliffDenominator',
          type: 'uint32',
        },
        {
          name: 'vestingPeriodCount',
          type: 'uint32',
        },
        {
          name: 'vestingPeriodDuration',
          type: 'uint32',
        },
        {
          name: 'tradeable',
          type: 'uint8',
        },
      ],
      [
        address,
        price,
        allocation,
        claimbackPeriod,
        tgeNumerator,
        tgeDenominator,
        cliffDuration,
        cliffNumerator,
        cliffDenominator,
        vestingPeriodCount,
        vestingPeriodDuration,
        tradeable,
      ],
    );

    return keccak256(encodedData);
  };
}
