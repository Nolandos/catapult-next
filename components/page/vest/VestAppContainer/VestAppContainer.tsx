'use client';

import {FC} from 'react';
import {ProjectConfig} from '@/utils/types.common';
import {supportedChains} from '@/lib/wagmi/supported-chains';
import {ProjectConfigProvider} from '@/providers/project-config-provider';
import {PresaleProvider} from '@/providers/presale-provider';
import {TokensProvider} from '@/providers/tokens-provider';
import {MembershipsProvider} from '@/providers/membership-provider';
import NetworkWrapper from '@/components/common/NetworkWrapper';
import VestApp from '@/components/vest/vest-app';

const projectConfig: ProjectConfig = {
  // Tenset
  chain: supportedChains.base,
  name: 'LEMU',
  slug: 'the-lucky-lemu',
  vestedToken: {
    name: 'LEMU',
    symbol: 'LEMU',
    decimals: 18,
    address: '0x2F626E22C3AbBe0744B76E1c72F2eAf4EA5823b9',
    // @TODO add logo
    logo: '',
  },
  collectedToken: {
    isNative: false,
    symbol: 'USDT',
    decimals: 18,
    address: '0x55d398326f99059fF775485246999027B3197955',
  },
  presaleVersion: 'v4',
  presaleAddress: '0x077099047ee4CEb99A2AC2f70AdAD32b03F266bc',
  company: {
    name: 'LEMU',
    website: 'https://luckylemu.com',
    logo: '',
  },
};

const VestAppContainer: FC = () => (
  <div className="container flex items-center justify-center">
    <NetworkWrapper chains={[projectConfig.chain]}>
      <ProjectConfigProvider projectConfig={projectConfig}>
        <PresaleProvider>
          <TokensProvider>
            <MembershipsProvider>
              <VestApp />
            </MembershipsProvider>
          </TokensProvider>
        </PresaleProvider>
      </ProjectConfigProvider>
    </NetworkWrapper>
  </div>
);

export default VestAppContainer;
