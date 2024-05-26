import {Address, Chain, WalletClient} from 'viem';

// eslint-disable-next-line import/no-cycle
import {PresaleVersion} from '../presale-factory';

export type Presale = {
  presaleContractAddress: Address
  vestedToken: Address
  collectedToken: Address
  listingTimestamp: number
  claimbackPeriod: number
  rounds: Round[]
}

export const PresaleRoundState = {
  pending: 0,
  active: 1,
  vesting: 2,
} as const;

export type PresaleRoundStateValue =
  (typeof PresaleRoundState)[keyof typeof PresaleRoundState]

export type Round = {
  roundId: number
  state: PresaleRoundStateValue
  name: string
  startTimestamp: number
  endTimestamp: number
  listingTimestamp: number
  refundsEndTimestamp: number
  proofsUri: string
  whitelistRoot: string
}

export type Membership = {
  id: string
  roundId: number
  usage: {
    max: string
    current: string
  }
  price: string
  allocation: string
  claimableBackUnit: string
  tgeNumerator: number
  tgeDenominator: number
  cliffDuration: number
  cliffNumerator: number
  cliffDenominator: number
  vestingPeriodCount: number
  vestingPeriodDuration: number
  tgeStartTimestamp: number
  locked: string
  unlocked: string
  nextUnlockTimestamp: number
  nextUnlockValue: string
  proofs?: string[]
}

export interface IPresale {
  getVersion(): PresaleVersion;

  getPresaleData(): Presale;

  getMemberships(
    walletAddress: Address,
    projectName: string,
    roundsCount: number
  ): Promise<Membership[]>;

  setApproval(
    walletClient: WalletClient,
    chain: Chain,
    amount: bigint
  ): Promise<Address>;

  transferMembership(
    walletClient: WalletClient,
    chain: Chain,
    to: Address,
    membershipId: string
  ): Promise<Address>;

  claimTokens(
    walletClient: WalletClient,
    chain: Chain,
    membershipId: string
  ): Promise<Address>;

  claimBackTokens(
    walletClient: WalletClient,
    chain: Chain,
    membershipId: string,
    amount: bigint
  ): Promise<Address>;

  buyTokens(
    walletClient: WalletClient,
    chain: Chain,
    membership: Membership,
    amount: bigint
  ): Promise<Address>;
}
