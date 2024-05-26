import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
// import { Address } from 'viem';
import {useAccount} from 'wagmi';

import {Membership} from '@/class/interface/presale';

import {PresaleContext} from './presale-provider';
import {ProjectConfigContext} from './project-config-provider';

interface MembershipsContextProperties {
  memberships: Membership[];
  selectedMembershipId: string;
  handleMembershipChange: (membershipId: string) => void;
  fetchMemberships: () => void;
  loading: boolean;
}

export const MembershipsContext = createContext<MembershipsContextProperties>({
  memberships: [],
  selectedMembershipId: '',
  handleMembershipChange: () => {
  },
  fetchMemberships: () => {
  },
  loading: true,
});

interface MembershipsProviderProperties {
  children: React.ReactNode;
}

export const MembershipsProvider = ({
  children,
}: MembershipsProviderProperties) => {
  const {
    presaleInstance,
    selectedRoundId,
    handleRoundChange,
  } = useContext(PresaleContext);

  const {slug} = useContext(ProjectConfigContext);

  const {address} = useAccount();

  const [selectedMembershipId, setSelectedMembershipId] = useState<string>('');

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(!selectedMembershipId);

  const handleMembershipChange = (membershipId: string) => {
    setSelectedMembershipId(membershipId);
  };

  const fetchMemberships = async () => {
    if (presaleInstance && address) {
      const _memberships = await presaleInstance.getMemberships(
        // '0x4e1a2d824e7B8d6454e94607BF5772669d39a2D0' as Address,
        address,
        slug,
        2,
      );

      if (_memberships.length <= 0) {
        setSelectedMembershipId('');
        setLoading(false);
        return;
      }

      const roundMemberships = _memberships.filter(
        (m) => m.roundId === selectedRoundId,
      );

      if (
        roundMemberships.length > 0
        && (!selectedMembershipId
          || !roundMemberships.some((m) => m.id === selectedMembershipId))
      ) {
        handleMembershipChange(roundMemberships[0].id);
      }

      if (
        roundMemberships.length <= 0
        && (!selectedMembershipId
          || !_memberships.some((m) => m.id === selectedMembershipId))
      ) {
        handleRoundChange(_memberships[0].roundId);
        handleMembershipChange(_memberships[0].id);
      }

      setMemberships(_memberships);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [presaleInstance, address]);

  return (
    <MembershipsContext.Provider
      value={useMemo(
        () => ({
          memberships,
          selectedMembershipId,
          handleMembershipChange,
          fetchMemberships,
          loading,
        }),
        [memberships, selectedMembershipId, handleMembershipChange, fetchMemberships, loading],
      )}
    >
      {children}
    </MembershipsContext.Provider>
  );
};
