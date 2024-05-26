'use client';

import {Label} from '@/components/ui/label';
import {Membership} from '@/class/interface/presale';
import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MembershipSelectProperties {
  memberships: Membership[];
  selectedMembershipId: string;
  setSelectedMembershipId: (membershipId: string) => void;
}

export const MembershipSelect = ({
  memberships,
  selectedMembershipId,
  setSelectedMembershipId,
}: MembershipSelectProperties) => (
  <div>
    <Label htmlFor="membership" className="text-white">
      Membership
    </Label>

    <Select
      value={selectedMembershipId.toString()}
      onValueChange={(value) => {
        setSelectedMembershipId(value);
      }}
    >
      <SelectTrigger className="w-24 text-white">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="text-white bg-[#202020]">
        {memberships.map((membership) => (
          <SelectItem
            key={membership.id.toString()}
            value={membership.id.toString()}
          >
            {membership.id.length > 14
              ? `${membership.id.toString()
                .slice(0, 8)}...`
              : membership.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
