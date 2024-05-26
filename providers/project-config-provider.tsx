import {createContext, useMemo} from 'react';
import {Address, Chain} from 'viem';

import {PresaleVersion} from '@/class/presale-factory';

export type ProjectConfig = {
  name: string
  slug: string
  chain: Chain
  vestedToken: {
    name: string
    symbol: string
    decimals: number
    address: Address
    logo?: string
  }
  collectedToken: {
    isNative?: boolean
    symbol: string
    decimals: number
    address: Address
  }
  presaleVersion: PresaleVersion
  presaleAddress: Address
  company: {
    name: string
    website: string
    logo: string
  }
}

export const ProjectConfigContext = createContext<ProjectConfig>(
  {} as ProjectConfig,
);

interface ProjectConfigProviderProperties {
  projectConfig: ProjectConfig;
  children: React.ReactNode;
}

export const ProjectConfigProvider = ({
  projectConfig,
  children,
}: ProjectConfigProviderProperties) => (
  <ProjectConfigContext.Provider value={useMemo(
    () => ({...projectConfig}),
    [projectConfig],
  )}
  >
    {children}
  </ProjectConfigContext.Provider>
);
