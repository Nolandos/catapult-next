import {FC, ReactNode} from 'react';
import {twMerge} from 'tailwind-merge';

type InfoChipProps = {
  children: ReactNode | string;
  className?: string
}
const InfoChip: FC<InfoChipProps> = ({
  children,
  className,
}) => {
  const classes = twMerge('flex justify-center items-center rounded-[30px] border border-g-400 min-w-[180px] min-h-[55px]', className);
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default InfoChip;
