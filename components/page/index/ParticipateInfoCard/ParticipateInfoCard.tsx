import {FC} from 'react';
import {ParticipateInformation} from '@/utils/types.common';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import HTMLBox from '@/components/common/HTMLBox';

type ParticipateInfoCardProps = {
  participateInfo: ParticipateInformation['attributes']
}

const ParticipateInfoCard: FC<ParticipateInfoCardProps> = ({participateInfo}) => {
  const {
    title,
    description,
    ordinalNumber,
  } = participateInfo;
  return (
    <Card
      className="w-full min-h-[300px] max-w-[560px] m-[18px] bg-black border border-g-500 bg-gradient-card-secondary rounded-[30px] md:min-h-[auto] md:h-[215px]"
    >
      <CardHeader className="pt-[20px] pb-[8px]">
        <h3 className="w-full flex justify-center text-2xl font-bold text-center">
          {ordinalNumber}
          .
          {title}
        </h3>
      </CardHeader>
      <CardContent className="[&>p>a]:text-y-500 [&>p>a]:underline [&>*]:break-all px-[15px]">
        <HTMLBox>{description}</HTMLBox>
      </CardContent>
    </Card>
  );
};

export default ParticipateInfoCard;
