'use client';

import {CheckIcon} from '@/components/icons';
import {Membership, PresaleRoundState, Round} from '@/class/interface/presale';

interface RoundDescriptionProperties {
  round: Round;
  membership: Membership;
  vestedToken: {
    symbol: string
  };
}

const RoundDescription = ({
  round,
  membership,
  vestedToken,
}: RoundDescriptionProperties) => {
  const sale = round.state !== PresaleRoundState.vesting
    && BigInt(membership.allocation)
    > BigInt(membership.usage.max) + BigInt(10 * 10 ** 12);

  const header = sale
    ? `You can buy by clicking the “Buy ${vestedToken.symbol}” button.`
    : `claim your ${vestedToken.symbol} tokens.`;

  const description: Element[] | string[] = sale
    ? [
      `Enter the amount of tokens you wish to purchase and click
        “Buy ${vestedToken.symbol}” and approve the transactions on your wallet.`,
    ]
    : [
      `You can claim the available amount anytime by clicking
        the “Claim ${vestedToken.symbol}” button.`,
      `Once it processes, your tokens will be transferred to
        your wallet.`,
    ];

  return (
    <div className="flex flex-col gap-4">
      <p>{header}</p>

      {description.length > 0 && (
        <ul className="pl-4 flex flex-col gap-2">
          {description.map((item, index) => (
            <li className="flex gap-2 max-w-[350px]" key={index}>
              <span className="pt-2">
                <CheckIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoundDescription;
