'use client';

import {Label} from '@/components/ui/label';
import {Round} from '@/class/interface/presale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoundSelectProperties {
  rounds: Round[];
  selectedRoundId: number;
  setSelectedRoundId: (round: number) => void;
}

export const RoundSelect = ({
  rounds,
  selectedRoundId,
  setSelectedRoundId,
}: RoundSelectProperties) => (
  <div className="space-y-2">
    <Label htmlFor="round" className="text-white">
      Round
    </Label>

    <Select
      value={selectedRoundId?.toString()}
      onValueChange={(value) => {
        setSelectedRoundId(Number.parseInt(value, 10));
      }}
    >
      <SelectTrigger className="w-24 text-white">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="text-white bg-[#202020]">
        {rounds.map((round) => (
          <SelectItem
            key={round.roundId.toString()}
            value={round.roundId.toString()}
          >
            {round.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
