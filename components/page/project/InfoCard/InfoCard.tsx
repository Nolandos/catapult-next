import {FC, ReactNode} from 'react';
import {Card} from '@/components/ui/card';
import {clsx} from 'clsx';

type InfoCardProps = {
  info: {
    label: string | ReactNode,
    value: string | ReactNode
    hidden?: boolean,
    ongoingStatus?: boolean
  }
}

const InfoCard: FC<InfoCardProps> = ({info}) => {
  const {
    label,
    value,
    ongoingStatus,
  } = info;
  const className = clsx(
    'flex flex-col bg-gradient-card-third w-full h-[80px] border border-g-500 rounded-[15px] px-[16px] py-[11px] max-w-[250px] max-[550px]:max-w-[350px] md:max-w-[220px]',
    ongoingStatus ? 'border-0 border-transparent bg-gradient-card card-with-border before:rounded-[15px] ' : '',
  );

  return (
    <Card className={className}>
      <div className="flex justify-start w-full mb-[8px] text-g-500">{label}</div>
      <div className="flex justify-end w-full font-semibold text-white text-[20px]">{value}</div>
    </Card>
  );
};

export default InfoCard;
