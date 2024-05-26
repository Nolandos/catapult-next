'use client';

import {useContext, useEffect, useState} from 'react';
import {MembershipsContext} from '@/providers/membership-provider';
import {PresaleContext} from '@/providers/presale-provider';
import {ProjectConfigContext} from '@/providers/project-config-provider';

import AddToMetamask from './left-panel/add-to-metamask';
import {MembershipSelect} from './left-panel/membership-select';
import RoundDescription from './left-panel/round-description';
import {RoundSelect} from './left-panel/round-select';
// import { TransferMembership } from './left-panel/transfer-membership'
import VestPanel from './vest-panel/vest-panel';
import {Spinner} from '../icons/spinner';
import NoMemberships from './no-memberships';

const VestApp = () => {
  // Contexts
  const {vestedToken} = useContext(ProjectConfigContext);

  const {
    presaleData,
    selectedRoundId,
    handleRoundChange,
  } = useContext(PresaleContext);

  const {
    memberships,
    selectedMembershipId,
    handleMembershipChange,
    loading,
  } = useContext(MembershipsContext);

  const [presaleRounds, setPresaleRounds] = useState(
    presaleData?.rounds.filter((round) => memberships.some((membership) => membership.roundId === round.roundId)) ?? [],
  );

  const [selectedRound, setSelectedRound] = useState(
    presaleRounds.find((round) => round.roundId === selectedRoundId),
  );
  const [roundMemberships, setRoundMemberships] = useState(
    memberships.filter((membership) => membership.roundId === selectedRoundId),
  );
  const [selectedMembership, setSelectedMembership] = useState(
    memberships.find((membership) => membership.id === selectedMembershipId),
  );

  useEffect(() => {
    const _presaleRounds = presaleData?.rounds.filter((round) => memberships.some((membership) => membership.roundId === round.roundId)) ?? [];

    const _selectedRound = _presaleRounds.find(
      (round) => round.roundId === selectedRoundId,
    );
    const _roundMemberships = memberships.filter(
      (membership) => membership.roundId === selectedRoundId,
    );

    const _selectedMembership = memberships.find(
      (membership) => membership.id === selectedMembershipId,
    );

    setPresaleRounds(_presaleRounds);
    setSelectedRound(_selectedRound);
    setRoundMemberships(_roundMemberships);
    setSelectedMembership(_selectedMembership);
  }, [memberships, selectedRoundId, selectedMembershipId]);

  return !presaleData || loading ? (
    <Spinner className="animate-spin w-12 h-12" />
  ) : (
    <div className="xl:grid xl:grid-cols-3 space-y-4 gap-8 w-full my-8">
      <div className="space-y-12">
        <h2 className="text-3xl sm:text-5xl font-semibold space-x-4">
          <span className="text-primary">{vestedToken.name}</span>
        </h2>

        <div className="flex flex-col gap-4">
          {presaleRounds.length > 1 && (
            <RoundSelect
              rounds={presaleRounds}
              selectedRoundId={selectedRoundId}
              setSelectedRoundId={(value) => {
                handleRoundChange(value);
                handleMembershipChange(
                  memberships.find((m) => m.roundId === value)!.id,
                );
              }}
            />
          )}

          {roundMemberships.length > 1 && (
            <MembershipSelect
              memberships={roundMemberships}
              selectedMembershipId={selectedMembershipId}
              setSelectedMembershipId={(value) => handleMembershipChange(value)}
            />
          )}

          {/* @TODO fix dialog */}
          {/* {roundMemberships.length > 0 && !selectedMembership?.proofs && (
            <TransferMembership />
          )} */}
        </div>

        {selectedRound && selectedMembership && roundMemberships.length > 0 && (
          <RoundDescription
            round={selectedRound}
            membership={selectedMembership}
            vestedToken={vestedToken}
          />
        )}

        <AddToMetamask />
      </div>

      <div className="col-span-2">
        {roundMemberships.length <= 0 && <NoMemberships />}

        {selectedMembership && selectedRound && (
          <VestPanel
            roundData={selectedRound}
            membershipData={selectedMembership}
          />
        )}
      </div>
    </div>
  );
};

export default VestApp;
