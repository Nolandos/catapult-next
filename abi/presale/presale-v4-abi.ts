export const presaleV4Abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'membership_',
        type: 'address',
        internalType: 'contract IVestMembership',
      },
      {
        name: 'feeCollectorProvider_',
        type: 'address',
        internalType: 'contract IVestFeeCollectorProvider',
      },
      {
        name: 'configuration',
        type: 'tuple',
        internalType: 'struct Presale.Configuration',
        components: [
          {
            name: 'fees',
            type: 'tuple',
            internalType: 'struct Presale.Fees',
            components: [
              {
                name: 'tokenANumerator',
                type: 'uint16',
                internalType: 'uint16',
              },
              {
                name: 'tokenADenominator',
                type: 'uint16',
                internalType: 'uint16',
              },
              {
                name: 'tokenBNumerator',
                type: 'uint16',
                internalType: 'uint16',
              },
              {
                name: 'tokenBDenominator',
                type: 'uint16',
                internalType: 'uint16',
              },
            ],
          },
          {
            name: 'tokenA',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'tokenB',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'manager',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'beneficiary',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'tgeTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'listingTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'claimbackPeriod',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'rounds_',
        type: 'tuple[]',
        internalType: 'struct Round[]',
        components: [
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'startTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'endTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'whitelistRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'proofsUri',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'addRound',
    inputs: [
      {
        name: 'round',
        type: 'tuple',
        internalType: 'struct Round',
        components: [
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'startTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'endTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'whitelistRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'proofsUri',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'beneficiary',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'buy',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amountA',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'attributes',
        type: 'tuple',
        internalType: 'struct IVestMembership.Attributes',
        components: [
          {
            name: 'price',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'allocation',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'claimbackPeriod',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tgeNumerator',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'tgeDenominator',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'cliffDuration',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'cliffNumerator',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'cliffDenominator',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'vestingPeriodCount',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'vestingPeriodDuration',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'tradeable',
            type: 'uint8',
            internalType: 'uint8',
          },
        ],
      },
      {
        name: 'proof',
        type: 'bytes32[]',
        internalType: 'bytes32[]',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'claim',
    inputs: [
      {
        name: 'membershipId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimback',
    inputs: [
      {
        name: 'membershipId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amountA',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'newPublicId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimbackPeriod',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'depositTokenA',
    inputs: [
      {
        name: 'amountA',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'extend',
    inputs: [
      {
        name: 'membershipId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amountA',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'feeCollectorProvider',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IVestFeeCollectorProvider',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFeeCollector',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFees',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Presale.Fees',
        components: [
          {
            name: 'tokenANumerator',
            type: 'uint16',
            internalType: 'uint16',
          },
          {
            name: 'tokenADenominator',
            type: 'uint16',
            internalType: 'uint16',
          },
          {
            name: 'tokenBNumerator',
            type: 'uint16',
            internalType: 'uint16',
          },
          {
            name: 'tokenBDenominator',
            type: 'uint16',
            internalType: 'uint16',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getListingTimestamp',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRound',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Round',
        components: [
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'startTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'endTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'whitelistRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'proofsUri',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRoundState',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'enum RoundState',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRounds',
    inputs: [],
    outputs: [
      {
        name: 'ids',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: 'rounds_',
        type: 'tuple[]',
        internalType: 'struct Round[]',
        components: [
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'startTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'endTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'whitelistRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'proofsUri',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
      {
        name: 'states',
        type: 'uint8[]',
        internalType: 'enum RoundState[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTgeTimestamp',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'liquidityA',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'liquidityB',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'manager',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'membership',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IVestMembership',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nonClaimableBackTokenB',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'removeRound',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'roundParticipants',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenA',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenB',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'updateBeneficiary',
    inputs: [
      {
        name: 'value',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateListingTimestamp',
    inputs: [
      {
        name: 'timestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateManager',
    inputs: [
      {
        name: 'value',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateRound',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'round',
        type: 'tuple',
        internalType: 'struct Round',
        components: [
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'startTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'endTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'whitelistRoot',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'proofsUri',
            type: 'string',
            internalType: 'string',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateTgeTimestamp',
    inputs: [
      {
        name: 'timestamp',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateWhitelist',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'whitelistRoot',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'proofsUri',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawCoin',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawToken',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawTokenA',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawTokenB',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'BeneficiaryUpdated',
    inputs: [
      {
        name: 'current',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Claimed',
    inputs: [
      {
        name: 'vMembershipId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'amountA',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ClaimedBack',
    inputs: [
      {
        name: 'vMembershipId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'amountA',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DepositedA',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ListingTimestampUpdated',
    inputs: [
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ManagerUpdated',
    inputs: [
      {
        name: 'current',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RoundUpdated',
    inputs: [
      {
        name: 'id',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TgeTimestampUpdated',
    inputs: [
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawnA',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawnB',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AccountMismatch',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'AlreadyRoundParticipant',
    inputs: [
      {
        name: 'roundId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ClaimNotAllowed',
    inputs: [
      {
        name: 'membershipId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'ClaimbackNotAllowed',
    inputs: [
      {
        name: 'membershipId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'CliffHeightWithoutSubsequentUnlocks',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CliffLikeVesting',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CliffWithImmediateUnlock',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DenominatorZero',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedInnerCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Forbidden',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OutOfLiquidityA',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RoundIsLocked',
    inputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RoundNotExists',
    inputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'RoundStateMismatch',
    inputs: [
      {
        name: 'id',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'current',
        type: 'uint8',
        internalType: 'enum RoundState',
      },
      {
        name: 'expected',
        type: 'uint8',
        internalType: 'enum RoundState',
      },
    ],
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'TokenWithTransferFees',
    inputs: [
      {
        name: 'tokenAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'UnacceptableReference',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UnacceptableValue',
    inputs: [],
  },
  {
    type: 'error',
    name: 'Unauthorized',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'VestingSize',
    inputs: [],
  },
  {
    type: 'error',
    name: 'VestingWithImmediateUnlock',
    inputs: [],
  },
  {
    type: 'error',
    name: 'VestingWithoutUnlocks',
    inputs: [],
  },
  {
    type: 'error',
    name: 'WithdrawToZeroAddress',
    inputs: [],
  },
] as const;
