import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';

// import timemachine from 'timemachine';
import {IPresale, Presale, PresaleRoundState} from '@/class/interface/presale';
import {PresaleFactory} from '@/class/presale-factory';

import {ProjectConfigContext} from './project-config-provider';
import {PublicClientContext} from './public-client-provider';

interface PresaleContextProperties {
  presaleInstance: IPresale | null;
  presaleData: Presale | null;
  selectedRoundId: number;
  handleRoundChange: (roundId: number) => void;
  fetchPresaleData: () => void;
  loading: boolean;
}

export const PresaleContext = createContext<PresaleContextProperties>({
  presaleInstance: null,
  presaleData: null,
  selectedRoundId: 0,
  handleRoundChange: () => {
  },
  fetchPresaleData: () => {
  },
  loading: true,
});

export const PresaleProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const {
    presaleAddress,
    presaleVersion,
    chain,
  } = useContext(ProjectConfigContext);

  /// --- State
  const {publicClients} = useContext(PublicClientContext);

  const publicClient = publicClients[chain.id];

  const [presaleInstance, setPresaleInstance] = useState<IPresale | null>(null);

  const [presaleData, setPresaleData] = useState<Presale | null>(null);

  const [selectedRoundId, setselectedRoundId] = useState<number>(
    presaleData?.rounds.find((round) => round.state !== PresaleRoundState.vesting)
      ?.roundId ?? 0,
  );

  const [loading, setLoading] = useState(!presaleData);
  /// --- State

  const handleRoundChange = (roundId: number) => {
    setselectedRoundId(roundId);
  };

  const fetchPresale = async () => {
    const _presaleInstance = await PresaleFactory.createInstance(
      presaleVersion,
      publicClient,
      presaleAddress,
    );

    setPresaleInstance(_presaleInstance);

    const _presaleData = _presaleInstance.getPresaleData();

    setPresaleData(_presaleData);

    if (selectedRoundId === 0) {
      const activeRound = _presaleData.rounds.find(
        (round) => round.state !== PresaleRoundState.vesting,
      );
      setselectedRoundId(activeRound?.roundId ?? 0);
    }

    // const block = await publicClient.getBlock();

    // console.log({
    //   timestamp: +block.timestamp.toString() * 1000,
    //   date: new Date(+block.timestamp.toString() * 1000),
    // });

    // timemachine.config({
    //   timestamp: +block.timestamp.toString() * 1000,
    //   tick: true,
    // });

    setLoading(false);
  };

  useEffect(() => {
    fetchPresale();
  }, [presaleAddress]);

  return (
    <PresaleContext.Provider
      value={useMemo(
        () => ({
          presaleInstance,
          presaleData,
          selectedRoundId,
          handleRoundChange,
          fetchPresaleData: fetchPresale,
          loading,
        }),
        [presaleInstance, presaleData, selectedRoundId, loading, handleRoundChange, fetchPresale],
      )}
    >
      {children}
    </PresaleContext.Provider>
  );
};
