'use client';

import clsx from 'clsx';
import {useContext} from 'react';

import {TokensContext} from '@/providers/tokens-provider';
import {Membership, Round} from '@/class/interface/presale';

import {TgeTimer} from '../left-panel/tge-timer';
import {ClaimBack} from './claim-back';
import {ClaimTokens} from './claim-tokens';
import {LockedBalance} from './locked-balance';
import {NextUnlock} from './next-unlock';
import {RememberFee} from './remember-fee';
import {TokensClaimed} from './tokens-claimed';
import {WalletDisconnect} from './wallet-disconnect';
import {WalletStatus} from './wallet-status';
import {YouOwn} from './you-own';
import {ClaimVesting} from './claim-vesting';

interface VestPanelProperties {
  // eslint-disable-next-line react/no-unused-prop-types
  roundData: Round;
  membershipData: Membership;
}

const VestPanel = ({membershipData}: VestPanelProperties) => {
  const {vestedToken} = useContext(TokensContext);
  const isRefundable = BigInt(membershipData.claimableBackUnit) > Date.now() / 1000
    && membershipData.usage.current === '0';

  return (
    <>
      <TgeTimer timestamp={membershipData.tgeStartTimestamp * 1000} />

      <div
        className="grid grid-cols-2 gap-4 xl:grid-cols-3 xl:grid-rows-4 w-full"
      >
        <TokensClaimed
          current={membershipData.usage.current}
          max={membershipData.usage.max}
          tokenDecimals={vestedToken.decimals}
        />
        <div
          className="contents xl:grid xl:grid-cols-subgrid xl:row-span-4 xl:grid-rows-3 xl:gap-4 xl:grid-areas-panel-right-wide"
        >
          <YouOwn
            balance={vestedToken.balance}
            symbol={vestedToken.symbol}
            decimals={vestedToken.decimals}
          />

          <div className="hidden xl:contents">
            <WalletStatus />
            <WalletDisconnect />
          </div>
        </div>

        <div className="xl:hidden col-span-2 grid grid-cols-2 gap-4 order-1">
          <WalletStatus />

          <WalletDisconnect />
        </div>

        <LockedBalance
          locked={membershipData.locked}
          tokenDecimals={vestedToken.decimals}
        />

        <div
          className={clsx(
            'grid row-span-2 col-span-2 xl:col-span-1 gap-4',
            isRefundable && 'xl:grid xl:row-span-3 xl:grid-rows-3',
          )}
        >
          {membershipData.proofs ? (
            <ClaimVesting membershipData={membershipData} />
          ) : (
            <ClaimTokens membershipData={membershipData} />
          )}

          {isRefundable && <ClaimBack membership={membershipData} />}
        </div>

        <NextUnlock
          timestamp={membershipData.nextUnlockTimestamp}
          value={membershipData.nextUnlockValue}
          tokenDecimals={vestedToken.decimals}
          allUnlocked={
            membershipData.allocation === membershipData.usage.current
          }
        />

        <RememberFee isRefundable={isRefundable} />
      </div>
    </>
  );
};

export default VestPanel;
